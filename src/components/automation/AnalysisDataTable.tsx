import React, { useState, useMemo } from 'react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  MoreHorizontal,
  TrendingUp,
  DollarSign,
  Users,
  AlertCircle,
  FileText,
  Calendar,
  Clock
} from 'lucide-react';
import type { AutomationTask, TaskResult } from '@/types/automation';

interface EnrichedTaskResult extends TaskResult {
  taskTitle?: string;
  taskCategory?: string;
  taskId?: string;
  taskInstruction?: string;
}

interface AnalysisDataTableProps {
  tasks: AutomationTask[];
}

const AnalysisDataTable: React.FC<AnalysisDataTableProps> = ({ tasks }) => {
  const [selectedResult, setSelectedResult] = useState<EnrichedTaskResult | null>(null);
  const [selectedTaskTitle, setSelectedTaskTitle] = useState<string>('');
  const [showContentDialog, setShowContentDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get all results with task information
  const allResults = useMemo(() => {
    return tasks
      .flatMap(task => 
        (task.results || []).map(result => ({
          ...result,
          taskTitle: task.title,
          taskCategory: task.category,
          taskId: task.id,
          taskInstruction: task.instruction
        }))
      )
      .filter(result => result.generatedContent) // Only show results with actual data
      .sort((a, b) => new Date(b.executedAt).getTime() - new Date(a.executedAt).getTime());
  }, [tasks]);

  // Filter by category
  const filteredResults = useMemo(() => {
    if (selectedCategory === 'all') return allResults;
    return allResults.filter(result => result.taskCategory === selectedCategory);
  }, [allResults, selectedCategory]);

  // Pagination
  const totalPages = Math.ceil(filteredResults.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedResults = filteredResults.slice(startIndex, startIndex + pageSize);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(allResults.map(r => r.taskCategory))];
    return cats;
  }, [allResults]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'data-analysis': return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'reporting': return <DollarSign className="h-4 w-4 text-green-600" />;
      case 'maintenance': return <AlertCircle className="h-4 w-4 text-orange-600" />;
      case 'notification': return <Users className="h-4 w-4 text-purple-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'data-analysis': return 'Trading Analysis';
      case 'reporting': return 'Customer Analytics';
      case 'maintenance': return 'Risk Analysis';
      case 'notification': return 'Market Intelligence';
      default: return category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getContentPreview = (content: string) => {
    // Extract the first line or two from the content for preview
    const lines = content.split('\n').filter(line => line.trim());
    const title = lines[0] || 'Analysis Result';
    const preview = lines.slice(1, 3).join(' ').substring(0, 100) + '...';
    return { title: title.replace(/[📊🔥💱⏰🎯🚨💰🌍]/g, '').trim(), preview };
  };

  const handleViewContent = (result: EnrichedTaskResult) => {
    setSelectedResult(result);
    setSelectedTaskTitle(result.taskTitle || 'Unknown Task');
    setShowContentDialog(true);
  };

  const handleDownloadContent = (result: EnrichedTaskResult) => {
    const content = result.generatedContent || 'No content available';
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(result.taskTitle || 'task').replace(/\s+/g, '_')}_${(result.executedAt || '').split('T')[0] || 'unknown'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (allResults.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <CardTitle className="text-xl mb-2">No Analysis Results</CardTitle>
          <CardDescription className="text-center">
            No analysis data has been generated yet. Create and run some automation tasks to see results here.
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters and Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category || 'custom'} value={category || 'custom'}>
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(category || 'custom')}
                    {getCategoryName(category || 'custom')}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={pageSize.toString()} onValueChange={(value) => {
            setPageSize(parseInt(value));
            setCurrentPage(1);
          }}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 per page</SelectItem>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="20">20 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1}-{Math.min(startIndex + pageSize, filteredResults.length)} of {filteredResults.length} results
        </div>
      </div>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Analysis Data Results
          </CardTitle>
          <CardDescription>
            View and download the actual data generated by your AI analysis tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Analysis Result</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Generated</TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedResults.map((result) => {
                const { title, preview } = getContentPreview(result.generatedContent || '');
                return (
                  <TableRow key={`${result.taskId}-${result.id}`} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-sm">{title}</div>
                        <div className="text-xs text-muted-foreground line-clamp-2">
                          {preview}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex items-center gap-1 w-fit">
                        {getCategoryIcon(result.taskCategory || 'custom')}
                        {getCategoryName(result.taskCategory || 'custom')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(result.executedAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{result.taskTitle}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">
                        {result.taskInstruction}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewContent(result)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Content
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownloadContent(result)}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => goToPage(page)}
                      >
                        {page}
                      </Button>
                    );
                  })}
                  {totalPages > 5 && (
                    <>
                      <span className="text-muted-foreground">...</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => goToPage(totalPages)}
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content View Dialog */}
      {selectedResult && (
        <Dialog open={showContentDialog} onOpenChange={setShowContentDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getCategoryIcon(selectedResult.taskCategory || 'custom')}
                {selectedTaskTitle}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Generated on {formatDate(selectedResult.executedAt || '')}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <pre className="whitespace-pre-wrap text-sm font-mono">
                  {selectedResult.generatedContent}
                </pre>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <Button onClick={() => handleDownloadContent(selectedResult)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Content
                </Button>
                <Button variant="outline" onClick={() => setShowContentDialog(false)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AnalysisDataTable;
