import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Zap, 
  Eye, 
  Download, 
  MoreHorizontal, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingUp,
  Users,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import type { AutomationTask, TaskResult } from '@/types/automation';

interface AutomationResultsTableProps {
  tasks: AutomationTask[];
}

const AutomationResultsTable: React.FC<AutomationResultsTableProps> = ({ tasks }) => {
  const [selectedResult, setSelectedResult] = useState<TaskResult | null>(null);
  const [selectedTaskTitle, setSelectedTaskTitle] = useState<string>('');
  const [showResultDialog, setShowResultDialog] = useState(false);

  // Get recent results from all tasks
  const recentResults = tasks
    .flatMap(task => 
      (task.results || []).map(result => ({
        ...result,
        taskTitle: task.title,
        taskCategory: task.category,
        taskId: task.id
      }))
    )
    .sort((a, b) => new Date(b.executedAt).getTime() - new Date(a.executedAt).getTime())
    .slice(0, 10); // Show last 10 results

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'partial': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'data-analysis': return <TrendingUp className="h-4 w-4" />;
      case 'reporting': return <DollarSign className="h-4 w-4" />;
      case 'notification': return <AlertCircle className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const formatDuration = (duration: number) => {
    const seconds = duration / 1000;
    return `${seconds.toFixed(1)}s`;
  };

  const handleViewResult = (result: any) => {
    setSelectedResult(result);
    setSelectedTaskTitle(result.taskTitle);
    setShowResultDialog(true);
  };

  const handleDownloadResult = (result: any) => {
    const content = result.generatedContent || result.output || 'No content available';
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.taskTitle.replace(/\s+/g, '_')}_${result.executedAt.split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (recentResults.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            Recent Analysis Results
          </CardTitle>
          <CardDescription>
            Latest automation task analysis results and insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Zap className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No analysis results yet.</p>
            <p className="text-sm">Create automation tasks to see analysis results here.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            Recent Analysis Results
          </CardTitle>
          <CardDescription>
            Latest automation task analysis results and insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Analysis Task</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Executed</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentResults.map((result) => (
                <TableRow key={`${result.taskId}-${result.id}`} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(result.taskCategory || 'custom')}
                      <div>
                        <div className="font-medium text-sm">{result.taskTitle || 'Unknown Task'}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {result.output || 'Analysis completed'}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {(result.taskCategory || 'custom').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`flex items-center gap-1 ${getStatusColor(result.status)}`}>
                      {getStatusIcon(result.status)}
                      {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(result.executedAt)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDuration(result.duration)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewResult(result)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Result
                        </DropdownMenuItem>
                        {(result.generatedContent || result.output) && (
                          <DropdownMenuItem onClick={() => handleDownloadResult(result)}>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Result Detail Dialog */}
      <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Analysis Result - {selectedTaskTitle}
            </DialogTitle>
            <DialogDescription>
              Detailed analysis result and generated insights
            </DialogDescription>
          </DialogHeader>

          {selectedResult && (
            <div className="space-y-4">
              {/* Result Info */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedResult.status.charAt(0).toUpperCase() + selectedResult.status.slice(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">Status</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {formatDate(selectedResult.executedAt)}
                  </div>
                  <div className="text-sm text-muted-foreground">Executed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {formatDuration(selectedResult.duration)}
                  </div>
                  <div className="text-sm text-muted-foreground">Duration</div>
                </div>
              </div>

              {/* Generated Content */}
              {selectedResult.generatedContent && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">Analysis Result</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadResult(selectedResult)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  <div className="bg-muted p-4 rounded-md max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap font-sans text-sm">
                      {selectedResult.generatedContent}
                    </pre>
                  </div>
                </div>
              )}

              {/* Output */}
              {selectedResult.output && !selectedResult.generatedContent && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Output</h3>
                  <div className="bg-muted p-4 rounded-md">
                    <p className="text-sm">{selectedResult.output}</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {selectedResult.errorMessage && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-red-600">Error Details</h3>
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {selectedResult.errorMessage}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AutomationResultsTable;
