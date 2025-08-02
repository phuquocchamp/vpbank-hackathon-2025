import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Timer, 
  FileText,
  Copy,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { TaskResult } from '@/types/automation';

interface TaskResultsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskTitle: string;
  results: TaskResult[];
}

const TaskResultsDialog: React.FC<TaskResultsDialogProps> = ({
  open,
  onOpenChange,
  taskTitle,
  results
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'partial': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300';
      case 'error': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300';
      case 'partial': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatDuration = (duration: number) => {
    const seconds = duration / 1000;
    if (seconds < 60) {
      return `${seconds.toFixed(1)}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds.toFixed(1)}s`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Execution Results - {taskTitle}
          </DialogTitle>
          <DialogDescription>
            View execution history and results for this automation task.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{results.length}</div>
                <div className="text-sm text-muted-foreground">Total Runs</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {results.filter(r => r.status === 'success').length}
                </div>
                <div className="text-sm text-muted-foreground">Successful</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">
                  {results.filter(r => r.status === 'error').length}
                </div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {results.length > 0 ? formatDuration(results.reduce((sum, r) => sum + r.duration, 0) / results.length) : '0s'}
                </div>
                <div className="text-sm text-muted-foreground">Avg Duration</div>
              </CardContent>
            </Card>
          </div>

          {/* Results List */}
          <ScrollArea className="h-[400px] border rounded-md">
            <div className="p-4 space-y-4">
              {results.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No execution results yet.</p>
                  <p className="text-sm">This task hasn't been executed yet.</p>
                </div>
              ) : (
                results
                  .sort((a, b) => new Date(b.executedAt).getTime() - new Date(a.executedAt).getTime())
                  .map((result) => (
                    <Card key={result.id} className="border">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {/* Header */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(result.status)}
                              <Badge className={getStatusColor(result.status)}>
                                {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                              </Badge>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {formatDate(result.executedAt)}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Timer className="h-3 w-3" />
                              {formatDuration(result.duration)}
                            </div>
                          </div>

                          {/* Output */}
                          {result.output && (
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Output:</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(result.output!)}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="bg-muted p-3 rounded-md text-sm font-mono whitespace-pre-wrap">
                                {result.output}
                              </div>
                            </div>
                          )}

                          {/* Generated Content */}
                          {result.generatedContent && (
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Generated Content:</span>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(result.generatedContent!)}
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      const blob = new Blob([result.generatedContent!], { type: 'text/plain' });
                                      const url = URL.createObjectURL(blob);
                                      const a = document.createElement('a');
                                      a.href = url;
                                      a.download = `${taskTitle.replace(/\s+/g, '_')}_${result.executedAt.split('T')[0]}.txt`;
                                      a.click();
                                      URL.revokeObjectURL(url);
                                    }}
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              <div className="bg-muted p-3 rounded-md text-sm max-h-40 overflow-y-auto">
                                <pre className="whitespace-pre-wrap font-sans">{result.generatedContent}</pre>
                              </div>
                            </div>
                          )}

                          {/* Error Message */}
                          {result.errorMessage && (
                            <div>
                              <span className="text-sm font-medium text-red-600">Error:</span>
                              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md text-sm text-red-700 dark:text-red-300 mt-1">
                                {result.errorMessage}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskResultsDialog;
