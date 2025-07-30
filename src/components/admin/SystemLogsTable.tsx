import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Terminal, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import LogTableRow, { LogTableHeader } from './LogTableRow';
import PaginationControls from './PaginationControls';
import LogFilterBar from './LogFilterBar';
import { useLogFilters } from '@/hooks/useLogFilters';

interface LogEntry {
  time: string;
  user_name: string;
  user_role: string;
  log_level: string;
  code: number;
  message: string;
  service_name: string;
  date: string;
}

interface LogData {
  statusCode: number;
  headers: {
    "Content-Type": string;
    "Access-Control-Allow-Origin": string;
  };
  body: LogEntry[];
}

interface SystemLogsTableProps {
  logData: LogData | null;
  isLoadingLogs: boolean;
  logError: string | null;
  currentPage: number;
  activeTab: string;
  itemsPerPage: number;
  onRefresh: () => void;
  onTabChange: (tab: string) => void;
  onPageChange: (page: number) => void;
}

const SystemLogsTable = ({
  logData,
  isLoadingLogs,
  logError,
  currentPage,
  activeTab,
  itemsPerPage,
  onRefresh,
  onTabChange,
  onPageChange
}: SystemLogsTableProps) => {
  // Ensure logs array is always valid - only if we have valid data from API
  const validLogs = logData && Array.isArray(logData.body) ? logData.body : [];
  
  // Use the filtering hook
  const { filters, setFilters, filteredLogs: allFilteredLogs, clearFilters, hasActiveFilters } = useLogFilters(validLogs);
  
  // Get filtered logs based on active tab
  const getFilteredLogs = (tab: string) => {
    switch (tab) {
      case 'error':
        return allFilteredLogs.filter((log: LogEntry) => log.log_level.toLowerCase() === 'error');
      case 'info':
        return allFilteredLogs.filter((log: LogEntry) => log.log_level.toLowerCase() === 'info');
      default:
        return allFilteredLogs;
    }
  };

  // Get current filtered logs for the active tab
  const filteredLogs = getFilteredLogs(activeTab);
  
  // Calculate counts for each tab - based on filtered data
  const allLogsCount = allFilteredLogs.length;
  const errorLogsCount = allFilteredLogs.filter((log: LogEntry) => log.log_level.toLowerCase() === 'error').length;
  const infoLogsCount = allFilteredLogs.filter((log: LogEntry) => log.log_level.toLowerCase() === 'info').length;
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLogs = filteredLogs.slice(startIndex, endIndex);

  const formatTimestamp = (date: string, time: string) => {
    // Parse the date string (DD-MM-YYYY) and time string (HH:MM:SS)
    const [day, month, year] = date.split('-');
    const [hour, minute, second] = time.split(':');
    
    const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute), parseInt(second || '0'));
    
    return dateObj.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const EmptyState = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
    <div className="flex items-center justify-center py-16">
      <div className="text-center">
        <Icon className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">{title}</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm">{description}</p>
      </div>
    </div>
  );

  if (logError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            System Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 text-red-400 dark:text-red-500 mx-auto mb-2" />
              <p className="text-red-600 dark:text-red-400 font-medium">Error loading logs</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{logError}</p>
              <Button onClick={onRefresh} variant="outline" size="sm" className="mt-2">
                Try Again
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoadingLogs) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            System Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-2"></div>
              <p className="text-gray-500 dark:text-gray-400">Loading logs...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!logData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            System Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
              <p className="text-gray-600 dark:text-gray-300 font-medium">No log data available</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Unable to load system logs</p>
              <Button onClick={onRefresh} variant="outline" size="sm" className="mt-2">
                Try Loading Again
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Terminal className="h-5 w-5" />
          System Logs
          <Badge variant="outline" className="ml-2">
            {allLogsCount} total
            {hasActiveFilters && (
              <span className="text-blue-600 dark:text-blue-400"> (filtered from {validLogs.length})</span>
            )}
          </Badge>
          {errorLogsCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {errorLogsCount} errors
            </Badge>
          )}
          <Button
            onClick={onRefresh}
            disabled={isLoadingLogs}
            variant="outline"
            size="sm"
            className="ml-auto"
          >
            {isLoadingLogs ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filter Bar */}
        <LogFilterBar
          logs={validLogs}
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={clearFilters}
        />

        <Tabs defaultValue="all" value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Logs ({allLogsCount})</TabsTrigger>
            <TabsTrigger value="error">Errors ({errorLogsCount})</TabsTrigger>
            <TabsTrigger value="info">Info ({infoLogsCount})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
              <LogTableHeader />
              
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {currentLogs.length === 0 ? (
                  <EmptyState 
                    icon={Terminal}
                    title="No logs found"
                    description="There are no logs to display for this filter"
                  />
                ) : (
                  currentLogs.map((log: LogEntry, index: number) => (
                    <LogTableRow key={index} log={log} index={index} />
                  ))
                )}
              </div>
            </div>
            
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              filteredCount={filteredLogs.length}
              itemsPerPage={itemsPerPage}
              onPageChange={onPageChange}
            />
            
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Total: {allLogsCount} logs</span>
              <span>Last updated: {validLogs[0] ? formatTimestamp(validLogs[0].date, validLogs[0].time) : formatTimestamp(new Date().toLocaleDateString('en-GB'), new Date().toLocaleTimeString('en-GB'))}</span>
            </div>
          </TabsContent>

          <TabsContent value="error">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
              <div className="grid grid-cols-11 gap-4 px-6 py-4 bg-red-50 dark:bg-red-950/30 border-b border-red-200 dark:border-red-800/50 text-sm font-medium text-red-800 dark:text-red-200">
                <div className="col-span-2">Timestamp</div>
                <div className="col-span-2 font-bold text-blue-800 dark:text-blue-300">Service</div>
                <div className="col-span-1">Code</div>
                <div className="col-span-2">User</div>
                <div className="col-span-1 font-bold text-purple-800 dark:text-purple-300">Role</div>
                <div className="col-span-3">Error Message</div>
              </div>
              
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {currentLogs.length === 0 ? (
                  <EmptyState 
                    icon={CheckCircle}
                    title="No errors found"
                    description="System is running smoothly with no error logs"
                  />
                ) : (
                  currentLogs.map((log: LogEntry, index: number) => (
                    <div key={index} className="hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
                      <LogTableRow log={log} index={index} showLevel={false} />
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              filteredCount={filteredLogs.length}
              itemsPerPage={itemsPerPage}
              onPageChange={onPageChange}
            />
          </TabsContent>

          <TabsContent value="info">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
              <div className="grid grid-cols-11 gap-4 px-6 py-4 bg-blue-50 dark:bg-blue-950/30 border-b border-blue-200 dark:border-blue-800/50 text-sm font-medium text-blue-800 dark:text-blue-200">
                <div className="col-span-2">Timestamp</div>
                <div className="col-span-2 font-bold text-blue-900 dark:text-blue-300">Service</div>
                <div className="col-span-1">Code</div>
                <div className="col-span-2">User</div>
                <div className="col-span-1 font-bold text-purple-900 dark:text-purple-300">Role</div>
                <div className="col-span-3">Info Message</div>
              </div>
              
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {currentLogs.length === 0 ? (
                  <EmptyState 
                    icon={CheckCircle}
                    title="No info logs found"
                    description="No informational messages to display"
                  />
                ) : (
                  currentLogs.map((log: LogEntry, index: number) => (
                    <div key={index} className="hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors">
                      <LogTableRow log={log} index={index} showLevel={false} />
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              filteredCount={filteredLogs.length}
              itemsPerPage={itemsPerPage}
              onPageChange={onPageChange}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SystemLogsTable;
