import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Loader2, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language: string;
  onExecute?: () => void;
  isExecuting?: boolean;
}

export const CodeBlock = ({ code, language, onExecute, isExecuting }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="overflow-hidden max-w-full">
      <div className="flex items-center justify-between px-3 py-1.5 border-b bg-muted/50">
        <span className="text-xs font-medium text-muted-foreground uppercase">{language}</span>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="h-6 px-1.5"
          >
            {copied ? (
              <Check className="size-3 text-green-500" />
            ) : (
              <Copy className="size-3" />
            )}
          </Button>
          {onExecute && (
            <Button
              size="sm"
              variant="secondary"
              onClick={onExecute}
              disabled={isExecuting}
              className="h-6 text-xs"
            >
              {isExecuting ? (
                <Loader2 className="size-3 mr-0.5 animate-spin" />
              ) : (
                <Play className="size-3 mr-0.5" />
              )}
              Execute
            </Button>
          )}
        </div>
      </div>
      <div className="p-3 overflow-x-auto max-h-96">
        <pre className="text-xs">
          <code className={cn("language-" + language)}>{code}</code>
        </pre>
      </div>
    </Card>
  );
};
