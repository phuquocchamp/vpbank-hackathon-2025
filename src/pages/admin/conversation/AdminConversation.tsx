import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useConversation } from '@/contexts/ConversationContext';
import { Bot, Send, User, AlertCircle } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';

const AdminConversation = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { state, loadConversation, sendMessage } = useConversation();
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.currentConversation?.messages]);

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

  console.log('Current conversation:', state.currentConversation?.messages);

  // Helper function to render message content
  const renderMessageContent = (content: string | { sql?: string; database?: string; message: string }) => {
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
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">SQL Query:</div>
                <div className="text-sm font-mono text-gray-800 dark:text-gray-200 overflow-x-auto text-left">
                  {content.sql};
                </div>
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
          <p className="text-gray-500 mt-2">Start a new chat or select an existing conversation</p>
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
      {/* Header */}
      <div className="border-b bg-white px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">
              {state.currentConversation?.title || 'Conversation'}
            </h1>
            <p className="text-sm text-gray-500">
              Admin Chat • {(state.currentConversation?.messages?.length ?? 0)} messages
            </p>
          </div>
          <Badge variant="secondary">
            <Bot className="size-3 mr-1" />
            AI Assistant
          </Badge>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {Array.isArray(state.currentConversation?.messages) && state.currentConversation.messages.length > 0 ? (
          <>
            {state.currentConversation.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] ${message.role === 'user'
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
                      {message.role === 'user' ? 'Admin' : 'AI Assistant'}
                    </span>
                  </div>
                  <div className="text-justify">

                    {renderMessageContent(message.content)}
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

      {/* Input */}
      <div className="border-t bg-white p-4 flex-shrink-0">
        <div className="flex gap-2">
          <Input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1"
            disabled={isTyping}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!messageInput.trim() || isTyping}
            size="icon"
          >
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminConversation;
