import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  RefreshCw, 
  Target,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Task tracking interfaces based on the provided data format
interface TaskStep {
  numOrder: number;
  title: string;
  totalTime: number;
  status: string;
}

interface TaskTrackingEntry {
  databaseName: string | null;
  stepGroup: TaskStep[];
  sqlQuery: string | null;
  createdAt: string;
  memoryUsage: string;
  prompt: string;
  duration: number;
  traceId: string;
}

interface TaskTrackingProps {
  userId?: string;
  className?: string;
}

const TaskTracking = ({ userId, className = '' }: TaskTrackingProps) => {
  const [taskData, setTaskData] = useState<TaskTrackingEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2; // Reduced to show pagination more often

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch task tracking data
  const fetchTaskTracking = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const vpbankToken = localStorage.getItem('vpbank_id_token') || sessionStorage.getItem('vpbank_id_token');
      
      if (!vpbankToken) {
        throw new Error('Authentication token not found. Please login again.');
      }

      const response = await fetch(`${BASE_URL}/task-tracking/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${vpbankToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setTaskData(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error('Failed to fetch task tracking data:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch task tracking data');
      
      // Set mock data as fallback for development
      setTaskData([
        {
          databaseName: null,
          stepGroup: [
            {
              numOrder: 1,
              title: "Đăng suy luận",
              totalTime: 2714,
              status: "SUCCESS"
            },
            {
              numOrder: 2, 
              title: "Hoàn thành và trả lời người dùng",
              totalTime: 2905,
              status: "SUCCESS"
            }
          ],
          sqlQuery: null,
          createdAt: "2025-07-29T06:56:31.501239+07:00",
          memoryUsage: "128",
          prompt: "Tổng hợp dữ liệu thông tin khách hàng T7",
          duration: -1,
          traceId: "813bd-16"
        },
        {
          databaseName: null,
          stepGroup: [
            {
              numOrder: 1,
              title: "Đăng suy luận",
              totalTime: 1854,
              status: "SUCCESS"
            },
            {
              numOrder: 2,
              title: "Hoàn thành và trả lời người dùng",
              totalTime: 3421,
              status: "SUCCESS"
            }
          ],
          sqlQuery: null,
          createdAt: "2025-07-29T05:45:12.123456+07:00",
          memoryUsage: "320",
          prompt: "Hello",
          duration: 5275,
          traceId: "c3fcf7c68"
        },
        {
          databaseName: null,
          stepGroup: [
            {
              numOrder: 1,
              title: "Đăng suy luận",
              totalTime: 2341,
              status: "SUCCESS"
            }
          ],
          sqlQuery: null,
          createdAt: "2025-07-28T14:23:45.654321+07:00",
          memoryUsage: "256",
          prompt: "hi",
          duration: 2341,
          traceId: "bb135179"
        },
        {
          databaseName: "analytics_db",
          stepGroup: [
            {
              numOrder: 1,
              title: "Database Query Analysis",
              totalTime: 1854,
              status: "SUCCESS"
            },
            {
              numOrder: 2,
              title: "Data Processing",
              totalTime: 3421,
              status: "PENDING"
            },
            {
              numOrder: 3,
              title: "Response Generation",
              totalTime: 0,
              status: "WAITING"
            }
          ],
          sqlQuery: "SELECT * FROM users WHERE active = 1",
          createdAt: "2025-07-28T10:15:30.789012+07:00",
          memoryUsage: "512",
          prompt: "Get all active users data",
          duration: 5275,
          traceId: "def456"
        },
        {
          databaseName: "customer_db",
          stepGroup: [
            {
              numOrder: 1,
              title: "Data Validation",
              totalTime: 987,
              status: "SUCCESS"
            },
            {
              numOrder: 2,
              title: "Query Execution",
              totalTime: 2134,
              status: "SUCCESS"
            },
            {
              numOrder: 3,
              title: "Result Formatting",
              totalTime: 456,
              status: "ERROR"
            }
          ],
          sqlQuery: "SELECT customer_id, name, email FROM customers WHERE created_at > '2025-01-01'",
          createdAt: "2025-07-28T09:30:15.456789+07:00",
          memoryUsage: "128",
          prompt: "Show recent customers",
          duration: 3577,
          traceId: "ghi789"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskTracking();
  }, [userId]);

  // Helper functions
  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'SUCCESS':
        return <Badge variant="outline" className="text-green-600 border-green-600"><CheckCircle className="size-3 mr-1" />Success</Badge>;
      case 'PENDING':
        return <Badge variant="outline" className="text-orange-600 border-orange-600"><Clock className="size-3 mr-1" />Pending</Badge>;
      case 'WAITING':
        return <Badge variant="outline" className="text-blue-600 border-blue-600"><Clock className="size-3 mr-1" />Waiting</Badge>;
      case 'ERROR':
        return <Badge variant="destructive"><AlertCircle className="size-3 mr-1" />Error</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDuration = (ms: number) => {
    if (ms < 0) return 'N/A';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Pagination logic
  const totalPages = Math.ceil(taskData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTasks = taskData.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Task Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-500 dark:text-gray-400">Loading task tracking data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Task Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
              <p className="text-red-600 dark:text-red-400 font-medium">Failed to load task data</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{error}</p>
              <Button onClick={fetchTaskTracking} variant="outline" size="sm" className="mt-2">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Task Tracking
            <Badge variant="outline" className="ml-2">
              {taskData.length} total tasks
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              Page {currentPage} of {totalPages}
            </Badge>
            <Button onClick={fetchTaskTracking} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Monitor task execution and step-by-step progress • Showing {Math.min(itemsPerPage, taskData.length)} tasks per page
        </p>
      </CardHeader>
      <CardContent>
        {taskData.length === 0 ? (
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">No tasks found</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">No task tracking data available for this user</p>
          </div>
        ) : (
          <>
            {/* Task Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {currentTasks.map((task) => (
                <Card key={task.traceId} className="border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs font-mono">
                          {task.traceId}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {task.stepGroup.length} steps
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="h-3 w-3" />
                        {formatDate(task.createdAt)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Task Prompt */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Prompt</span>
                      </div>
                      <p className="text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 p-2 rounded border dark:border-gray-600">
                        {task.prompt}
                      </p>
                    </div>

                    {/* Task Steps */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Execution Steps
                      </h4>
                      {task.stepGroup.map((step) => (
                        <div key={step.numOrder} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border dark:border-gray-600">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-full">
                              {step.numOrder}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{step.title}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Duration: {formatDuration(step.totalTime)}
                              </p>
                            </div>
                          </div>
                          <div>
                            {getStatusBadge(step.status)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Task Metadata */}
                    <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Memory Usage:</span>
                          <span className="font-mono ml-1 text-gray-900 dark:text-gray-100">{task.memoryUsage}MB</span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Total Duration:</span>
                          <span className="font-mono ml-1 text-gray-900 dark:text-gray-100">{formatDuration(task.duration)}</span>
                        </div>
                      </div>
                      {task.sqlQuery && (
                        <div className="mt-2">
                          <span className="text-gray-500 dark:text-gray-400">SQL Query:</span>
                          <code className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-1 rounded ml-1 block mt-1">
                            {task.sqlQuery}
                          </code>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {taskData.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="min-w-[80px]"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>
                    
                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => goToPage(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="min-w-[80px]"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                  
                  <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-4">
                    <span>
                      Showing {startIndex + 1}-{Math.min(endIndex, taskData.length)} of {taskData.length} tasks
                    </span>
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                      Page {currentPage} of {totalPages}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskTracking;
