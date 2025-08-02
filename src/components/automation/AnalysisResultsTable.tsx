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
  Clock,
  History,
  CheckCircle
} from 'lucide-react';
import type { AnalysisTask, AnalysisTaskResult } from '@/types/automation';

interface EnrichedAnalysisResult extends AnalysisTaskResult {
  taskTitle: string;
  taskCategory: string;
  taskId: string;
  taskInstruction: string;
}

interface AnalysisResultsTableProps {
  analysisTasks: AnalysisTask[];
  onGetS3Content: (filePath: string) => Promise<string>;
}

const AnalysisResultsTable: React.FC<AnalysisResultsTableProps> = ({ 
  analysisTasks, 
  onGetS3Content 
}) => {
  const [selectedResult, setSelectedResult] = useState<EnrichedAnalysisResult | null>(null);
  const [selectedTaskTitle, setSelectedTaskTitle] = useState<string>('');
  const [showContentDialog, setShowContentDialog] = useState(false);
  const [showVersionDialog, setShowVersionDialog] = useState(false);
  const [selectedTaskVersions, setSelectedTaskVersions] = useState<EnrichedAnalysisResult[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [s3Content, setS3Content] = useState<string>('');

  // Get all results with task information, showing only the latest successful result per task
  const allResults = useMemo(() => {
    const latestResults: EnrichedAnalysisResult[] = [];
    
    analysisTasks.forEach(task => {
      if (task.result && task.result.length > 0) {
        // Find the latest successful result
        const successfulResults = task.result.filter(r => r.status === 'success' && r.filePath);
        if (successfulResults.length > 0) {
          const latestResult = successfulResults[successfulResults.length - 1];
          latestResults.push({
            ...latestResult,
            taskTitle: task.title,
            taskCategory: task.category,
            taskId: task.taskId,
            taskInstruction: task.instruction
          });
        }
      }
    });
    
    return latestResults.sort((a, b) => new Date(b.executeTime).getTime() - new Date(a.executeTime).getTime());
  }, [analysisTasks]);

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
      case 'trading-analysis': return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'customer-analytics': return <Users className="h-4 w-4 text-green-600" />;
      case 'risk-analysis': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'reporting': return <DollarSign className="h-4 w-4 text-green-600" />;
      case 'maintenance': return <AlertCircle className="h-4 w-4 text-orange-600" />;
      case 'notification': return <Users className="h-4 w-4 text-purple-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'trading-analysis': return 'Trading Analysis';
      case 'customer-analytics': return 'Customer Analytics';
      case 'risk-analysis': return 'Risk Analysis';
      case 'reporting': return 'Financial Reporting';
      case 'maintenance': return 'System Maintenance';
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

  const handleViewContent = async (result: EnrichedAnalysisResult) => {
    setSelectedResult(result);
    setSelectedTaskTitle(result.taskTitle);
    setIsLoadingContent(true);
    setShowContentDialog(true);
    
    try {
      const content = await onGetS3Content(result.filePath);
      setS3Content(content);
    } catch (error) {
      setS3Content('Failed to load content from S3. Please try again.');
    } finally {
      setIsLoadingContent(false);
    }
  };

  const handleDownloadContent = async (result: EnrichedAnalysisResult) => {
    try {
      const content = await onGetS3Content(result.filePath);
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${result.taskTitle.replace(/\s+/g, '_')}_${result.executeTime.split('T')[0]}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download content:', error);
    }
  };

  const handleViewVersions = (taskId: string) => {
    const task = analysisTasks.find(t => t.taskId === taskId);
    if (task && task.result) {
      const versions = task.result
        .filter(r => r.status === 'success' && r.filePath)
        .map(r => ({
          ...r,
          taskTitle: task.title,
          taskCategory: task.category,
          taskId: task.taskId,
          taskInstruction: task.instruction
        }))
        .sort((a, b) => new Date(b.executeTime).getTime() - new Date(a.executeTime).getTime());
      
      setSelectedTaskVersions(versions);
      setSelectedTaskTitle(task.title);
      setShowVersionDialog(true);
    }
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
            No successful analysis results found. Create and run some automation tasks to see results here.
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
            AI Analysis Results
          </CardTitle>
          <CardDescription>
            View and download the latest results from your AI analysis tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Last Executed</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedResults.map((result) => {
                const task = analysisTasks.find(t => t.taskId === result.taskId);
                const totalVersions = task?.result?.filter(r => r.status === 'success' && r.filePath).length || 0;
                
                return (
                  <TableRow key={`${result.taskId}-${result.executeTime}`} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-sm">{result.taskTitle}</div>
                        <div className="text-xs text-muted-foreground line-clamp-2">
                          {result.taskInstruction}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex items-center gap-1 w-fit">
                        {getCategoryIcon(result.taskCategory)}
                        {getCategoryName(result.taskCategory)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(result.executeTime)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        Success
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {totalVersions > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewVersions(result.taskId)}
                          >
                            <History className="h-3 w-3 mr-1" />
                            {totalVersions} versions
                          </Button>
                        )}
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
                      </div>
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
                {getCategoryIcon(selectedResult.taskCategory)}
                {selectedTaskTitle}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Generated on {formatDate(selectedResult.executeTime)}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              {isLoadingContent ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">Loading content...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {(() => {
                    try {
                      const parsedData = JSON.parse(s3Content);
                      
                      // Handle array of objects (tabular data)
                      if (Array.isArray(parsedData) && parsedData.length > 0 && typeof parsedData[0] === 'object') {
                        const columns = Object.keys(parsedData[0]);
                        return (
                          <div className="border rounded-lg overflow-hidden">
                            <div className="bg-muted px-4 py-3 border-b">
                              <h3 className="font-semibold text-sm">Analysis Results ({parsedData.length} rows)</h3>
                            </div>
                            <div className="max-h-96 overflow-auto">
                              <Table>
                                <TableHeader className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                                  <TableRow>
                                    {columns.map((column) => (
                                      <TableHead key={column} className="font-semibold text-xs uppercase tracking-wide">
                                        {column.replace(/_/g, ' ')}
                                      </TableHead>
                                    ))}
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {parsedData.map((row: any, index: number) => (
                                    <TableRow key={index} className="hover:bg-muted/50">
                                      {columns.map((column) => (
                                        <TableCell key={column} className="text-sm">
                                          {typeof row[column] === 'object' 
                                            ? JSON.stringify(row[column]) 
                                            : String(row[column] ?? '-')
                                          }
                                        </TableCell>
                                      ))}
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        );
                      }
                      
                      // Handle single object with key-value pairs
                      else if (typeof parsedData === 'object' && parsedData !== null && !Array.isArray(parsedData)) {
                        const entries = Object.entries(parsedData);
                        return (
                          <div className="border rounded-lg overflow-hidden">
                            <div className="bg-muted px-4 py-3 border-b">
                              <h3 className="font-semibold text-sm">Analysis Summary</h3>
                            </div>
                            <div className="max-h-96 overflow-auto">
                              <Table>
                                <TableHeader className="bg-gray-50 dark:bg-gray-800">
                                  <TableRow>
                                    <TableHead className="font-semibold text-xs uppercase tracking-wide w-1/3">
                                      Metric
                                    </TableHead>
                                    <TableHead className="font-semibold text-xs uppercase tracking-wide">
                                      Value
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {entries.map(([key, value]) => (
                                    <TableRow key={key} className="hover:bg-muted/50">
                                      <TableCell className="font-medium text-sm">
                                        {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                      </TableCell>
                                      <TableCell className="text-sm">
                                        {typeof value === 'object' 
                                          ? JSON.stringify(value, null, 2) 
                                          : String(value ?? '-')
                                        }
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        );
                      }
                      
                      // Handle other JSON structures (arrays of primitives, etc.)
                      else {
                        return (
                          <div className="border rounded-lg overflow-hidden">
                            <div className="bg-muted px-4 py-3 border-b">
                              <h3 className="font-semibold text-sm">Raw Analysis Data</h3>
                            </div>
                            <div className="bg-muted/30 p-4 max-h-96 overflow-auto">
                              <pre className="whitespace-pre-wrap text-sm font-mono">
                                {JSON.stringify(parsedData, null, 2)}
                              </pre>
                            </div>
                          </div>
                        );
                      }
                    } catch (error) {
                      // Fallback for non-JSON content
                      return (
                        <div className="border rounded-lg overflow-hidden">
                          <div className="bg-muted px-4 py-3 border-b">
                            <h3 className="font-semibold text-sm">Analysis Content</h3>
                          </div>
                          <div className="bg-muted/30 p-4 max-h-96 overflow-auto">
                            <pre className="whitespace-pre-wrap text-sm font-mono">
                              {s3Content}
                            </pre>
                          </div>
                        </div>
                      );
                    }
                  })()}
                </div>
              )}
              <div className="flex items-center gap-2 mt-4">
                <Button 
                  onClick={() => handleDownloadContent(selectedResult)}
                  disabled={isLoadingContent}
                >
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

      {/* Version History Dialog */}
      <Dialog open={showVersionDialog} onOpenChange={setShowVersionDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Execution History - {selectedTaskTitle}
            </DialogTitle>
            <DialogDescription>
              View all successful executions of this analysis task
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-2">
            {selectedTaskVersions.map((version, index) => (
              <Card key={version.executeTime} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={index === 0 ? "default" : "secondary"}>
                        {index === 0 ? 'Latest' : `Version ${selectedTaskVersions.length - index}`}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(version.executeTime)}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      File: {version.filePath.split('/').pop()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewContent(version)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadContent(version)}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AnalysisResultsTable;
