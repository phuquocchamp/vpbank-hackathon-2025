import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useConversation } from '@/contexts/ConversationContext';
import { useHeader } from '@/contexts/HeaderContext';
import { AlertCircle, Bot, MessageSquare } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { EmptyState } from './components/EmptyState';
import { MessageInput } from './components/MessageInput';
import { MessageItem } from './components/MessageItem';

const AdminConversation = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { state, loadConversation, sendMessage } = useConversation();
  const { setHeaderInfo } = useHeader();
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

  const handleSendMessage = async (message: string) => {
    if (!conversationId) return;
    await sendMessage(conversationId, message);
  };

  const handleExecuteQuery = async (query: string, database: string, messageId: string) => {
    const queryKey = `${messageId}_${query}`;
    setExecutingQueries(prev => ({ ...prev, [queryKey]: true }));

    try {
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
        <Skeleton className="h-20 w-full" />
        <div className="flex-1 p-6 space-y-4">
          <Skeleton className="h-16 w-3/4" />
          <Skeleton className="h-16 w-1/2 ml-auto" />
          <Skeleton className="h-16 w-2/3" />
        </div>
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (state.error) {
    return (
      <EmptyState
        icon={<AlertCircle className="size-12 text-destructive mx-auto mb-4" />}
        title="Error"
        description={state.error}
      />
    );
  }

  return (
    <div className="conversation-container flex flex-col h-full bg-background">
      <div className="flex-1 min-h-0 overflow-hidden">
        <ScrollArea className="conversation-scroll-area h-full">
          <div className="p-4 space-y-3">
            {Array.isArray(state.currentConversation?.messages) && state.currentConversation.messages.length > 0 ? (
              <>
                {state.currentConversation.messages.map((message) => (
                  <MessageItem
                    key={message.id}
                    message={message}
                    onExecuteQuery={handleExecuteQuery}
                    queryResults={queryResults}
                    executingQueries={executingQueries}
                    onDownloadResults={downloadResults}
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
            {/* Add padding at bottom for message input */}
            <div className="h-24"></div>
          </div>
        </ScrollArea>
      </div>

      <div className="flex-shrink-0">
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={state.loading}
        />
      </div>
    </div>
  );
};

export default AdminConversation;
