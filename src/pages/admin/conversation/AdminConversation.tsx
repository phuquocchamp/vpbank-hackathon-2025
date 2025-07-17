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
                  className={`max-w-[70%] ${message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                    } rounded-lg px-4 py-2`}
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
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <div className="flex items-center gap-2">
                <Bot className="size-4" />
                <span className="text-xs text-gray-500">AI Assistant is typing...</span>
                <div className="flex space-x-1">
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
