import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Terminal, AlertCircle, CheckCircle, RefreshCw, User, Clock, Code } from 'lucide-react';

interface LogEntry {
  time: string | null;
  user_name: string | null;
  user_role: string | null;
  log_level: string | null;
  code: number | null;
  message: string | null;
  service_name: string | null;
  date: string | null;
}

interface LogData {
  statusCode: number;
  headers: {
    "Content-Type": string;
    "Access-Control-Allow-Origin": string;
  };
  body: LogEntry[];
}

interface SystemLogsProps {
  userId: string;
  userEmail?: string;
  className?: string;
}

const SystemLogs = ({ userId, userEmail, className = '' }: SystemLogsProps) => {
  const [logData, setLogData] = useState<LogData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAllLogs, setShowAllLogs] = useState(false); // Debug toggle
  const itemsPerPage = 10;

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchLogs = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const vpbankToken = localStorage.getItem('vpbank_id_token') || sessionStorage.getItem('vpbank_id_token');
      
      if (!vpbankToken) {
        throw new Error('Authentication token not found. Please login again.');
      }

      const response = await fetch(`${BASE_URL}/admin/log`, {
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
      console.log('Raw API Response:', result); // Debug log
      console.log('Body type:', typeof result.body); // Debug log
      console.log('Body content (first 200 chars):', typeof result.body === 'string' ? result.body.substring(0, 200) : result.body); // Debug log
      
      // Parse the body string as JSON if it's a string
      let parsedBody;
      if (typeof result.body === 'string') {
        try {
          // The body might be a JSON string containing an array of log entries
          parsedBody = JSON.parse(result.body);
          console.log('Parsed body type:', typeof parsedBody, Array.isArray(parsedBody)); // Debug log
          console.log('Parsed body:', parsedBody); // Debug log
          
          // If parsedBody is an object with a property containing the logs, extract it
          if (parsedBody && typeof parsedBody === 'object' && !Array.isArray(parsedBody)) {
            // Check if there's a logs array in the parsed body
            if (parsedBody.logs && Array.isArray(parsedBody.logs)) {
              parsedBody = parsedBody.logs;
            } else if (parsedBody.data && Array.isArray(parsedBody.data)) {
              parsedBody = parsedBody.data;
            } else {
              // If it's an object but not with expected structure, try to convert to array
              console.warn('Unexpected parsed body structure:', parsedBody);
              parsedBody = [];
            }
          }
        } catch (parseError) {
          console.error('Failed to parse body string:', parseError);
          console.error('Body content that failed to parse:', result.body);
          parsedBody = [];
        }
      } else {
        parsedBody = result.body;
      }
      
      // Ensure parsedBody is an array
      if (!Array.isArray(parsedBody)) {
        console.warn('Parsed body is not an array:', parsedBody);
        parsedBody = [];
      }
      
      const processedResult: LogData = {
        statusCode: result.statusCode,
        headers: result.headers,
        body: parsedBody
      };
      
      console.log('Final processed result:', processedResult); // Debug log
      setLogData(processedResult);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch logs');
      
      // Set mock data as fallback for development
      setLogData({
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: [
          {
            time: "10:30:45",
            user_name: "Client User",
            user_role: "User",
            log_level: "INFO",
            code: 200,
            message: "Successfully executed analysis task",
            service_name: "automation-service",
            date: "02-08-2025"
          },
          {
            time: "09:15:22",
            user_name: "Client User", 
            user_role: "User",
            log_level: "INFO",
            code: 200,
            message: "Task created successfully",
            service_name: "task-service",
            date: "02-08-2025"
          },
          {
            time: "08:45:10",
            user_name: "Client User",
            user_role: "User", 
            log_level: "ERROR",
            code: 500,
            message: "Failed to connect to database",
            service_name: "database-service",
            date: "02-08-2025"
          }
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchLogs();
    } else {
      setIsLoading(false);
      setError('User ID is required');
    }
  }, [userId]);

  const validLogs = logData && Array.isArray(logData.body) ? logData.body : [];
  console.log('Valid logs before filtering:', validLogs); // Debug log
  
  // Filter logs by user email if provided - with null safety
  const userFilteredLogs = (userEmail && !showAllLogs)
    ? validLogs.filter((log: LogEntry) => {
        const isMatch = log.user_name && userEmail && 
               log.user_name.toLowerCase() === userEmail.toLowerCase();
        console.log(`Filtering log for user ${log.user_name} vs ${userEmail}:`, isMatch); // Debug log
        return isMatch;
      })
    : validLogs;
  
  console.log('User filtered logs:', userFilteredLogs); // Debug log
  
  const getFilteredLogs = (tab: string) => {
    switch (tab) {
      case 'error':
        return userFilteredLogs.filter((log: LogEntry) => 
          log.log_level && log.log_level.toLowerCase() === 'error'
        );
      case 'info':
        return userFilteredLogs.filter((log: LogEntry) => 
          log.log_level && log.log_level.toLowerCase() === 'info'
        );
      default:
        return userFilteredLogs;
    }
  };

  const filteredLogs = getFilteredLogs(activeTab);
  console.log('Final filtered logs for tab', activeTab, ':', filteredLogs); // Debug log
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLogs = filteredLogs.slice(startIndex, endIndex);
  console.log('Current page logs:', currentLogs); // Debug log

  const allLogsCount = userFilteredLogs.length;
  const errorLogsCount = userFilteredLogs.filter((log: LogEntry) => 
    log.log_level && log.log_level.toLowerCase() === 'error'
  ).length;
  const infoLogsCount = userFilteredLogs.filter((log: LogEntry) => 
    log.log_level && log.log_level.toLowerCase() === 'info'
  ).length;

  const formatTimestamp = (date: string | null, time: string | null) => {
    if (!date || !time) return 'Invalid date';
    
    try {
      const [day, month, year] = date.split('-');
      const [hour, minute, second] = time.split(':');
      
      if (!day || !month || !year || !hour || !minute) return 'Invalid date';
      
      const dateObj = new Date(
        parseInt(year), 
        parseInt(month) - 1, 
        parseInt(day), 
        parseInt(hour), 
        parseInt(minute), 
        parseInt(second || '0')
      );
      
      if (isNaN(dateObj.getTime())) return 'Invalid date';
      
      return dateObj.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getLogIcon = (level: string | null) => {
    if (!level) return <Terminal className="h-4 w-4 text-gray-500" />;
    
    switch (level.toLowerCase()) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'info':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <Terminal className="h-4 w-4 text-gray-500" />;
    }
  };

  const getLogBadgeVariant = (level: string | null) => {
    if (!level) return 'secondary';
    
    switch (level.toLowerCase()) {
      case 'error':
        return 'destructive' as const;
      case 'info':
        return 'default' as const;
      default:
        return 'secondary' as const;
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            My Activity Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">Loading logs...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            My Activity Logs
          </CardTitle>
          <div className="flex gap-2">
            {process.env.NODE_ENV === 'development' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAllLogs(!showAllLogs)}
              >
                {showAllLogs ? 'Filter by User' : 'Show All'}
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={fetchLogs}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {!userEmail && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-600">
              Showing all system logs. User email not provided for filtering.
            </p>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" className="text-xs">
              All ({allLogsCount})
            </TabsTrigger>
            <TabsTrigger value="error" className="text-xs">
              Errors ({errorLogsCount})
            </TabsTrigger>
            <TabsTrigger value="info" className="text-xs">
              Info ({infoLogsCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            {/* Debug info */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-4 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                <p>Debug: Total logs: {validLogs.length}, User filtered: {userFilteredLogs.length}, Tab filtered: {filteredLogs.length}</p>
                <p>User email: {userEmail || 'Not provided'}</p>
              </div>
            )}
            
            {currentLogs.length === 0 ? (
              <div className="text-center py-8">
                <Terminal className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No logs found for this category</p>
                {userEmail && userFilteredLogs.length === 0 && validLogs.length > 0 && (
                  <p className="text-xs text-gray-400 mt-2">
                    No logs found for user: {userEmail}. Total logs available: {validLogs.length}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {currentLogs.map((log, index) => (
                  <div
                    key={`${log.date || 'unknown'}-${log.time || 'unknown'}-${index}`}
                    className="border rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {getLogIcon(log.log_level)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={getLogBadgeVariant(log.log_level)} className="text-xs">
                              {log.log_level || 'UNKNOWN'}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <Code className="h-3 w-3 mr-1" />
                              {log.code || 'N/A'}
                            </Badge>
                            <span className="text-xs text-gray-500">{log.service_name || 'unknown-service'}</span>
                          </div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                            {log.message || 'No message available'}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {log.user_name || 'Unknown User'} ({log.user_role || 'Unknown Role'})
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTimestamp(log.date, log.time)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-gray-500">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredLogs.length)} of {filteredLogs.length} logs
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SystemLogs;
