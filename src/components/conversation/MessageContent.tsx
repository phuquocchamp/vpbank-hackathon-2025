import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Download } from 'lucide-react';
import { CodeBlock } from './CodeBlock';
import { QueryResultsTable } from './QueryResultsTable';


interface MessageContentProps {
  content: string | { sql?: string; database?: string; message: string };
  messageId: string;
  onExecuteQuery: (query: string, database: string, messageId: string) => void;
  queryResults: { [key: string]: any };
  executingQueries: { [key: string]: boolean };
  onDownloadResults: (url: string, filename?: string) => void;
}

export const MessageContent = ({
  content,
  messageId,
  onExecuteQuery,
  queryResults,
  executingQueries,
  onDownloadResults
}: MessageContentProps) => {
  const highlightBackticks = (text: string) => {
    if (!text) return text;
    const parts = text.split(/(`[^`]*`)/g);
    if (parts.length === 1) return text;

    return parts.map((part, index) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        const content = part.slice(1, -1);
        return (
          <code
            key={index}
            className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm"
          >
            {content}
          </code>
        );
      }
      return part;
    });
  };

  if (typeof content === 'string') {
    return (
      <div className="text-sm whitespace-pre-wrap break-words">
        {highlightBackticks(content)}
      </div>
    );
  }

  const queryKey = `${messageId}_${content.sql}`;

  return (
    <div className="space-y-4">
      <div className="text-sm whitespace-pre-wrap break-words">
        {highlightBackticks(content.message)}
      </div>

      {(content.sql || content.database) && (
        <div className="space-y-3">
          {content.database && content.database.trim() !== '' && (
            <Alert>
              <AlertTitle className="text-sm font-medium">Database</AlertTitle>
              <AlertDescription className="font-mono text-sm mt-1">
                {content.database}
              </AlertDescription>
            </Alert>
          )}

          {content.sql && content.sql.trim() !== '' && (
            <>
              <CodeBlock
                code={content.sql}
                language="sql"
                onExecute={() => onExecuteQuery(content.sql!, content.database || '', messageId)}
                isExecuting={executingQueries[queryKey]}
              />

              {queryResults[queryKey] && (
                <div className="mt-4">
                  {queryResults[queryKey].error ? (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Query Error</AlertTitle>
                      <AlertDescription>
                        {queryResults[queryKey].error}
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-base">Query Results</CardTitle>
                            <CardDescription>
                              {queryResults[queryKey].results?.length || 0} rows returned
                            </CardDescription>
                          </div>
                          {queryResults[queryKey].presigned_url && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onDownloadResults(queryResults[queryKey].presigned_url)}
                            >
                              <Download className="size-4 mr-2" />
                              Download Excel
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <QueryResultsTable results={queryResults[queryKey].results} />
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
