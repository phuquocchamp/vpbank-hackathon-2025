import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useConversation } from '@/contexts/ConversationContext';
import { useHeader } from '@/contexts/HeaderContext';
import { AlertCircle, Bot, Send, User, Play, Download, FileSpreadsheet, MessageSquare } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

const ClientConversation = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { state, loadConversation, sendMessage } = useConversation();
  const { setHeaderInfo } = useHeader();
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [queryResults, setQueryResults] = useState<{ [key: string]: any }>({});
  const [executingQueries, setExecutingQueries] = useState<{ [key: string]: boolean }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.currentConversation?.messages]);

  // Update header info when conversation changes
  useEffect(() => {
    if (state.currentConversation) {
      setHeaderInfo({
        title: state.currentConversation.title || 'Conversation',
        description: `${state.currentConversation.messages?.length || 0} messages`,
        badge: (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MessageSquare className="h-4 w-4" />
            <span>{state.currentConversation.messages?.length || 0}</span>
          </div>
        ),
      });
    } else if (conversationId && !state.loading) {
      setHeaderInfo({
        title: 'Conversation',
        description: 'Loading...',
      });
    } else if (!conversationId) {
      setHeaderInfo({
        title: 'Conversations',
        description: 'Select a conversation to start chatting',
      });
    }

    // Cleanup function to clear header info when component unmounts
    return () => {
      setHeaderInfo(null);
    };
  }, [state.currentConversation, conversationId, state.loading, setHeaderInfo]);

  useEffect(() => {
    if (conversationId) {
      loadConversation(conversationId);
    }
  }, [conversationId, loadConversation]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !conversationId) return;

    const message = messageInput.trim();
    setMessageInput('');
    setIsTyping(true);

    try {
      await sendMessage(conversationId, message);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Show error message to user
      // You might want to add an error state here
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleExecuteQuery = async (query: string, database: string, messageId: string) => {
    const queryKey = `${messageId}_${query}`;
    setExecutingQueries(prev => ({ ...prev, [queryKey]: true }));

    try {
      // Get the vpbank_id_token from localStorage
      const vpbankIdToken = localStorage.getItem('vpbank_id_token');

      const response = await fetch(`${BASE_URL}/chatbot/execute_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${vpbankIdToken}`,
        },
        body: JSON.stringify({
          query: query,
          database: database
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      setQueryResults(prev => ({
        ...prev,
        [queryKey]: result.body
      }));
    } catch (error) {
      console.error('Failed to execute query:', error);
      setQueryResults(prev => ({
        ...prev,
        [queryKey]: { error: 'Failed to execute query' }
      }));
    } finally {
      setExecutingQueries(prev => ({ ...prev, [queryKey]: false }));
    }
  };

  const downloadResults = (presignedUrl: string, filename = 'query_results.xlsx') => {
    const link = document.createElement('a');
    link.href = presignedUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper function to highlight text within backticks
  const highlightBackticks = (text: string) => {
    if (!text) return text; // Handle undefined or null text
    const parts = text.split(/(`[^`]*`)/g);
    if (parts.length === 1) return text; // No backticks found, return original text
    return parts.map((part, index) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        const content = part.slice(1, -1); // Remove backticks
        return (
          <span
            key={index}
            className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-xs font-mono"
          >
            {content}
          </span>
        );
      }
      return part;
    });
  };

  // Helper function to render message content
  const renderMessageContent = (content: string | { sql?: string; database?: string; message: string }, messageId: string) => {
    if (typeof content === 'string') {
      return (
        <div className="text-sm whitespace-pre-wrap break-words text-justify">
          {highlightBackticks(content)}
        </div>
      );
    }

    // Handle object content (assistant messages)
    return (
      <div className="text-sm space-y-3">
        {/* Message part - always show */}
        <div className="whitespace-pre-wrap break-words text-justify">
          {highlightBackticks(content.message)}
        </div>

        {/* SQL and Database parts - only show if they exist and are not empty */}
        {(content.sql || content.database) && (
          <div className="space-y-2">
            {content.database && content.database.trim() !== '' && (
              <div className="bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-md">
                <div className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">Database:</div>
                <div className="text-sm font-mono text-blue-800 dark:text-blue-200">
                  {content.database}
                </div>
              </div>
            )}

            {content.sql && content.sql.trim() !== '' && (
              <div className="bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-md">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300">SQL Query:</div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleExecuteQuery(content.sql!, content.database || '', messageId)}
                    disabled={executingQueries[`${messageId}_${content.sql}`]}
                    className="h-6 px-2 text-xs"
                  >
                    {executingQueries[`${messageId}_${content.sql}`] ? (
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-1"></div>
                    ) : (
                      <Play className="size-3 mr-1" />
                    )}
                    Execute
                  </Button>
                </div>
                <div className="text-sm font-mono text-gray-800 dark:text-gray-200 overflow-x-auto text-left">
                  {content.sql};
                </div>
              </div>
            )}

            {/* Query Results */}
            {content.sql && queryResults[`${messageId}_${content.sql}`] && (
              <div className="mt-3">
                {queryResults[`${messageId}_${content.sql}`].error ? (
                  <Card className="p-3 border-red-200 bg-red-50 dark:bg-red-900/20">
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                      <AlertCircle className="size-4" />
                      <span className="text-sm">Query failed: {queryResults[`${messageId}_${content.sql}`].error}</span>
                    </div>
                  </Card>
                ) : (
                  <Card className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="size-4 text-green-600" />
                        <span className="text-sm font-medium">Query Results</span>
                        <Badge variant="secondary" className="text-xs">
                          {queryResults[`${messageId}_${content.sql}`].resultCount || 0} rows
                        </Badge>
                      </div>
                      {queryResults[`${messageId}_${content.sql}`].presignedUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadResults(queryResults[`${messageId}_${content.sql}`].presignedUrl)}
                          className="h-6 px-2 text-xs"
                        >
                          <Download className="size-3 mr-1" />
                          Download Excel
                        </Button>
                      )}
                    </div>
                    {queryResults[`${messageId}_${content.sql}`].displayResults && (
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-xs">
                          <thead>
                            <tr className="border-b">
                              {Object.keys(queryResults[`${messageId}_${content.sql}`].displayResults[0] || {}).map((key) => (
                                <th key={key} className="px-2 py-1 text-left font-medium text-gray-700 dark:text-gray-300">
                                  {key}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {queryResults[`${messageId}_${content.sql}`].displayResults.map((row: any, idx: number) => (
                              <tr key={idx} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                                {Object.values(row).map((value: any, cellIdx: number) => (
                                  <td key={cellIdx} className="px-2 py-1 text-gray-600 dark:text-gray-400">
                                    {value?.toString() || ''}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </Card>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (!conversationId) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Bot className="size-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600">No conversation selected</h2>
          <p className="text-gray-500 mt-2">Start a new chat from the sidebar</p>
        </div>
      </div>
    );
  }

  if (state.loading && !state.currentConversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle className="size-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-600">Error</h2>
          <p className="text-gray-500 mt-2">{state.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-h-screen">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-24">
        {Array.isArray(state.currentConversation?.messages) && state.currentConversation.messages.length > 0 ? (
          <>
            {state.currentConversation.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[50%] overflow-auto ${message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                    } rounded-lg px-4 py-2 shadow-sm`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {message.role === 'user' ? (
                      <User className="size-4" />
                    ) : (
                      <Bot className="size-4" />
                    )}
                    <span className="text-xs opacity-75">
                      {message.role === 'user' ? 'You' : 'AI Assistant'}
                    </span>
                  </div>
                  <div className="text-justify">
                    {renderMessageContent(message.content, message.id)}
                  </div>
                  <p className="text-xs opacity-75 mt-1">
                    {message.timestamp instanceof Date
                      ? message.timestamp.toLocaleTimeString()
                      : new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="flex items-center justify-center h-32">
            <div className="text-center text-gray-500">
              <Bot className="size-8 mx-auto mb-2 opacity-50" />
              <p>No messages yet</p>
              <p className="text-sm">Start the conversation!</p>
            </div>
          </div>
        )}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 shadow-sm">
              <div className="flex items-center gap-2">
                <Bot className="size-4" />
                <span className="text-xs text-gray-500 dark:text-gray-400">AI Assistant is typing...</span>
                <div className="flex space-x-1 ml-2">
                  <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Message Input */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border/40 p-4 flex-shrink-0 z-50 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 items-end bg-background border border-border/50 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow duration-200">
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="min-h-[40px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              disabled={isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!messageInput.trim() || isTyping}
              size="icon"
              className="flex-shrink-0 h-10 w-10 rounded-lg"
            >
              <Send className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientConversation;

export const ConversationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(conversationReducer, initialState);
  const { user, isLoading: authLoading } = useAuth();

  const userId = user?.id;
  const co_code_ld = user?.co_code_ld;
  const isAdmin = user?.role === 'ADMIN';

  // Determine API endpoint based on user role
  const getConversationEndpoint = useCallback(() => {
    return isAdmin ? '/admin/conversations' : '/client/conversations';
  }, [isAdmin]);

  const createNewConversation = useCallback(async (): Promise<Conversation> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      if (authLoading) {
        throw new Error('Authentication still loading');
      }

      if (!user || !user.id) {
        throw new Error('User not authenticated');
      }

      const newConversation: any = {
        conversationId: uuidv4(),
        title: 'New Chat',
        userId: user.id,
      };

      // Add co_code_ld only for CLIENT users
      if (!isAdmin && user.co_code_ld) {
        newConversation.co_code_ld = user.co_code_ld;
      }

      const response = await fetch(`${API_BASE_URL}${getConversationEndpoint()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConversation),
      });

      if (!response.ok) throw new Error('Failed to create conversation');

      const createdConversation = await response.json();
      dispatch({ type: 'CREATE_CONVERSATION', payload: createdConversation });

      return createdConversation;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [user, authLoading, isAdmin, getConversationEndpoint]);

  const sendMessage = useCallback(async (conversationId: string, content: string): Promise<void> => {
    const userMessage: Message = {
      id: uuidv4(),
      content: content,
      role: 'user',
      timestamp: new Date(),
    };

    dispatch({ type: 'ADD_MESSAGE', payload: { conversationId, message: userMessage } });

    try {
      const vpbankIdToken = localStorage.getItem('vpbank_id_token');

      const endpoint = `${API_BASE_URL}${getConversationEndpoint()}/${conversationId}/messages`;

      const requestBody: any = {
        content: content,
        idToken: vpbankIdToken
      };

      // Add co_code_ld for CLIENT users
      if (!isAdmin && user?.co_code_ld) {
        requestBody.co_code_ld = user.co_code_ld;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${vpbankIdToken}`
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const data = await response.json();

      if (data.assistant) {
        const assistantMessage: Message = {
          id: data.assistant.id,
          content: data.assistant.content,
          role: data.assistant.role,
          timestamp: new Date(data.assistant.timestamp),
        };

        dispatch({ type: 'ADD_MESSAGE', payload: { conversationId, message: assistantMessage } });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
    }
  }, [isAdmin, user?.co_code_ld, getConversationEndpoint]);

  const loadConversations = useCallback(async (): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await fetch(`${API_BASE_URL}${getConversationEndpoint()}`);
      if (!response.ok) throw new Error('Failed to load conversations');

      const data = await response.json();
      const rawConversations = data.conversations || [];
      const conversations = rawConversations.map((conv: any) => ({
        ...conv,
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt),
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));

      dispatch({ type: 'SET_CONVERSATIONS', payload: conversations });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [getConversationEndpoint]);

  // ...existing code...
};