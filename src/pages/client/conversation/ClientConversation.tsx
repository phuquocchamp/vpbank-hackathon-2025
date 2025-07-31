import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useConversation } from '@/contexts/ConversationContext';
import { useHeader } from '@/contexts/HeaderContext';
import { AlertCircle, Bot, MessageSquare } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { EmptyState } from '../../../components/conversation/EmptyState';
import { MessageInput } from '../../../components/conversation/MessageInput';
import { MessageItem } from '../../../components/conversation/MessageItem';

const ClientConversation = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { state, loadConversation, sendMessage, updateMessage } = useConversation();
  const { setHeaderInfo } = useHeader();

  // Query execution states
  const [queryResults, setQueryResults] = useState<{ [key: string]: any }>({});
  const [executingQueries, setExecutingQueries] = useState<{ [key: string]: boolean }>({});

  // Component states
  const [queryError, setQueryError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Auto scroll to bottom only when number of messages changes (not when editing)
  const prevMessageCountRef = useRef<number>(0);
  useEffect(() => {
    const currentCount = state.currentConversation?.messages?.length || 0;
    if (currentCount > prevMessageCountRef.current) {
      scrollToBottom();
    }
    prevMessageCountRef.current = currentCount;
  }, [state.currentConversation?.messages.length]);

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

  // Load conversation when component mounts or conversationId changes
  useEffect(() => {
    if (conversationId) {
      loadConversation(conversationId).catch((error) => {
        console.error('Failed to load conversation:', error);
      });
    }
  }, [conversationId, loadConversation]);

  // Clear error states when conversation changes
  useEffect(() => {
    setQueryError(null);
    setQueryResults({});
    setExecutingQueries({});
  }, [conversationId]);

  const handleSendMessage = async (message: string) => {
    if (!conversationId) {
      console.error('No conversation ID available');
      return;
    }

    try {
      await sendMessage(conversationId, message);
    } catch (error) {
      console.error('Failed to send message:', error);
      // The error is already handled in the ConversationContext
    }
  };

  const handleExecuteQuery = async (query: string, database: string, messageId: string) => {
    const queryKey = `${messageId}_${query}`;
    setExecutingQueries(prev => ({ ...prev, [queryKey]: true }));
    setQueryError(null);

    try {
      const vpbankIdToken = localStorage.getItem('vpbank_id_token');

      if (!vpbankIdToken) {
        throw new Error('Authentication token not found');
      }

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

      // Handle successful response
      if (result.body) {
        setQueryResults(prev => ({
          ...prev,
          [queryKey]: result.body
        }));
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Failed to execute query:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to execute query';
      setQueryError(errorMessage);
      setQueryResults(prev => ({
        ...prev,
        [queryKey]: { error: errorMessage }
      }));
    } finally {
      setExecutingQueries(prev => ({ ...prev, [queryKey]: false }));
    }
  };

  const handleUpdateMessage = async (messageId: string, sql: string, database: string) => {
    if (!conversationId) {
      throw new Error('No conversation ID available');
    }
    try {
      await updateMessage(conversationId, messageId, sql, database);
    } catch (error) {
      console.error('Failed to update message:', error);
      throw error;
    }
  };

  const downloadResults = (presignedUrl: string, filename = 'query_results.xlsx') => {
    try {
      const link = document.createElement('a');
      link.href = presignedUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to download file:', error);
      setQueryError('Failed to download file');
    }
  };

  if (!conversationId) {
    return (
      <EmptyState
        title="No conversation selected"
        description="Start a new chat or select an existing conversation"
      />
    );
  }

  if (state.loading && !state.currentConversation) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 p-6 space-y-4">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-3/4 ml-auto" />
          <Skeleton className="h-16 w-2/3" />
          <Skeleton className="h-16 w-1/2 ml-auto" />
        </div>
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (state.error) {
    return (
      <EmptyState
        icon={<AlertCircle className="size-12 text-destructive mx-auto mb-4" />}
        title="Error loading conversation"
        description={state.error}
      />
    );
  }

  return (
    <div className="conversation-container flex flex-col h-full bg-background">
      <div className="flex-1 min-h-0 overflow-hidden relative">
        <ScrollArea className="conversation-scroll-area h-full">
          <div className="p-4 space-y-3 pb-32">
            {/* Query Error Display */}
            {queryError && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="size-4" />
                  <span className="text-sm font-medium">Query Error</span>
                </div>
                <p className="text-sm text-destructive/80 mt-1">{queryError}</p>
              </div>
            )}

            {Array.isArray(state.currentConversation?.messages) && state.currentConversation.messages.length > 0 ? (
              <>
                {state.currentConversation.messages.map((message) => (
                  <MessageItem
                    key={message.id}
                    message={message}
                    conversationId={conversationId}
                    onExecuteQuery={handleExecuteQuery}
                    queryResults={queryResults}
                    executingQueries={executingQueries}
                    onDownloadResults={downloadResults}
                    onUpdateMessage={message.role === 'assistant' ? handleUpdateMessage : undefined}
                  />
                ))}
                <div ref={messagesEndRef} />
              </>
            ) : (
              <div className="flex items-center justify-center min-h-[200px]">
                <div className="text-center text-muted-foreground">
                  <Bot className="size-8 mx-auto mb-2 opacity-50" />
                  <p>No messages yet</p>
                  <p className="text-sm">Start the conversation!</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Floating message input */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 via-background/80 to-transparent pt-8">
          <MessageInput
            onSendMessage={handleSendMessage}
            disabled={state.loading}
          />
        </div>
      </div>
    </div>
  );
};

export default ClientConversation;