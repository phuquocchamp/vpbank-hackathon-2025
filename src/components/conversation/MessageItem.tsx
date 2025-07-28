import { Bot, User } from 'lucide-react';
import type { Message } from '@/contexts/ConversationContext';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { MessageContent } from './MessageContent';

interface MessageItemProps {
  message: Message;
  onExecuteQuery: (query: string, database: string, messageId: string) => void;
  queryResults: { [key: string]: any };
  executingQueries: { [key: string]: boolean };
  onDownloadResults: (url: string, filename?: string) => void;
}

export const MessageItem = ({
  message,
  onExecuteQuery,
  queryResults,
  executingQueries,
  onDownloadResults
}: MessageItemProps) => {
  const isUser = message.role !== 'assistant';

  return (
    <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <Avatar className="size-8 flex-shrink-0">
          <AvatarFallback>
            <Bot className="size-4" />
          </AvatarFallback>
        </Avatar>
      )}

      <Card className={cn(
        "max-w-[70%] overflow-hidden",
        isUser ? "bg-primary text-primary-foreground" : "bg-muted"
      )}>
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium opacity-70">
              {isUser ? 'Admin' : 'AI Assistant'}
            </span>
            <span className="text-xs opacity-50">
              {message.timestamp instanceof Date
                ? message.timestamp.toLocaleTimeString()
                : new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>

          <MessageContent
            content={message.content}
            messageId={message.id}
            onExecuteQuery={onExecuteQuery}
            queryResults={queryResults}
            executingQueries={executingQueries}
            onDownloadResults={onDownloadResults}
          />
        </div>
      </Card>

      {isUser && (
        <Avatar className="size-8 flex-shrink-0">
          <AvatarFallback>
            <User className="size-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};
