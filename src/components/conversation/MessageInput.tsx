import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send } from 'lucide-react';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';

interface MessageInputProps {
  onSendMessage: (message: string) => Promise<void>;
  disabled?: boolean;
}

export const MessageInput = ({ onSendMessage, disabled }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = async () => {
    if (!message.trim() || isSending) return;

    const messageToSend = message.trim();
    setMessage('');
    setIsSending(true);

    try {
      await onSendMessage(messageToSend);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [message]);

  return (
    <div className="p-4 bg-transparent">
      <div className="max-w-4xl mx-auto">
        {/* Floating input container */}
        <div className="relative bg-background border border-border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 px-4 py-2">
          <div className="flex items-center gap-3">
            {/* Message input */}
            <div className="flex-1 min-w-0">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Làm thế nào để Wutip có thể giúp bạn?"
                disabled={disabled || isSending}
                rows={1}
                className="min-h-[60px] max-h-[120px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-2 text-sm placeholder:text-muted-foreground overflow-hidden w-full"
                style={{ height: 'auto' }}
              />
            </div>

            {/* Send button */}
            <Button
              onClick={handleSend}
              disabled={!message.trim() || isSending || disabled}
              size="sm"
              className="h-8 w-8 p-0 rounded-full bg-foreground hover:bg-foreground/90 text-background flex-shrink-0 disabled:opacity-50"
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>


      </div>
    </div>
  );
};
