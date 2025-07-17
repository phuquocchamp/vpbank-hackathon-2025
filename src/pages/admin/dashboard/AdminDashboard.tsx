import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Users, FileText, Shield, Terminal, AlertCircle, CheckCircle, Info, Clock, RefreshCw, ChevronLeft, ChevronRight, TrendingUp, BarChart3 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';

// Interface for log data based on API response structure
interface LogEntry {
  timestamp: string;
  logLevel: string;
  component: string;
  traceId: string;
  message: string;
}

interface LogData {
  status: number;
  num_log: number;
  num_error: number;
  logs: LogEntry[];
}

const AdminDashboard = () => {
  const [logData, setLogData] = useState<LogData | null>(null);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);
  const [logError, setLogError] = useState<string | null>(null);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('all');
  const itemsPerPage = 10;

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch logs from API
  const fetchLogs = async () => {
    setIsLoadingLogs(true);
    setLogError(null);
    
    try {
      const response = await fetch(`${BASE_URL}/chatbot/get-log`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // API response có cấu trúc { body: { status, num_log, num_error, logs } }
      if (result.body) {
        setLogData(result.body);
      } else {
        // Fallback nếu response không có body wrapper
        setLogData(result);
      }
    } catch (error) {
      console.error('Failed to fetch logs:', error);
      setLogError(error instanceof Error ? error.message : 'Failed to fetch logs');
    } finally {
      setIsLoadingLogs(false);
    }
  };

  // Load logs on component mount
  useEffect(() => {
    fetchLogs();
  }, []);

  // Mock data dựa trên response từ BE (JSON từ ảnh) - fallback khi không có API
  const mockLogData: LogData = {
    status: 200,
    num_log: 154,
    num_error: 4,
    logs: [
      {
        timestamp: "2025-07-17T10:19:52.7072",
        logLevel: "SYSTEM",
        component: "LambdaRuntime",
        traceId: "0f1fb249-1463-455c-a901-0736b573c808",
        message: "END RequestId: 0f1fb249-1463-455c-a901-0736b573c808"
      },
      {
        timestamp: "2025-07-17T10:19:52.7072",
        logLevel: "SYSTEM",
        component: "LambdaRuntime",
        traceId: "0f1fb249-1463-455c-a901-0736b573c808",
        message: "REPORT RequestId: 0f1fb249-1463-455c-a901-0736b573c808\\tDuration: 7959.91 ms\\tBi"
      },
      {
        timestamp: "2025-07-17T10:19:52.7052",
        logLevel: "ERROR",
        component: "Application",
        traceId: "0f1fb249-1463-455c-a901-0736b573c808",
        message: "Database connection failed - timeout after 30 seconds"
      },
      {
        timestamp: "2025-07-17T10:19:51.2341",
        logLevel: "INFO",
        component: "UserService",
        traceId: "0f1fb249-1463-455c-a901-0736b573c809",
        message: "User authentication successful for user ID: 12345"
      },
      {
        timestamp: "2025-07-17T10:19:50.1234",
        logLevel: "WARN",
        component: "ApiGateway",
        traceId: "0f1fb249-1463-455c-a901-0736b573c810",
        message: "Rate limit approaching - 90% of threshold reached"
      }
    ]
  };

  const getLogLevelBadge = (level: string) => {
    switch (level.toLowerCase()) {
      case 'error':
        return <Badge variant="destructive" className="text-xs"><AlertCircle className="size-3 mr-1" />ERROR</Badge>;
      case 'warn':
        return <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-600"><Info className="size-3 mr-1" />WARN</Badge>;
      case 'info':
        return <Badge variant="outline" className="text-xs text-blue-600 border-blue-600"><CheckCircle className="size-3 mr-1" />INFO</Badge>;
      case 'system':
        return <Badge variant="secondary" className="text-xs"><Terminal className="size-3 mr-1" />SYSTEM</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{level}</Badge>;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // Only use data if we have successfully loaded it or if we're showing mock data
  const currentLogData = logData || (logError ? null : mockLogData);
  
  // Ensure logs array is always valid - only if we have valid data
  const validLogs = currentLogData && Array.isArray(currentLogData.logs) ? currentLogData.logs : [];
  
  // Calculate counts for each tab - only if we have valid data
  const allLogsCount = validLogs.length;
  const errorLogsCount = validLogs.filter(log => log.logLevel.toLowerCase() === 'error').length;
  const warnLogsCount = validLogs.filter(log => log.logLevel.toLowerCase() === 'warn').length;
  const infoLogsCount = validLogs.filter(log => log.logLevel.toLowerCase() === 'info').length;
  const systemLogsCount = validLogs.filter(log => log.logLevel.toLowerCase() === 'system').length;

  // Get filtered logs based on active tab
  const getFilteredLogs = (tab: string) => {
    switch (tab) {
      case 'error':
        return validLogs.filter(log => log.logLevel.toLowerCase() === 'error');
      case 'warn':
        return validLogs.filter(log => log.logLevel.toLowerCase() === 'warn');
      case 'info':
        return validLogs.filter(log => log.logLevel.toLowerCase() === 'info');
      case 'system':
        return validLogs.filter(log => log.logLevel.toLowerCase() === 'system');
      default:
        return validLogs;
    }
  };

  // Get current filtered logs
  const filteredLogs = getFilteredLogs(activeTab);
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLogs = filteredLogs.slice(startIndex, endIndex);

  // Reset page when changing tabs
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Helper functions for chart data processing
  const getLogLevelChartData = () => {
    const data = [
      { name: 'Error', value: errorLogsCount, color: '#ef4444' },
      { name: 'Warning', value: warnLogsCount, color: '#f59e0b' },
      { name: 'Info', value: infoLogsCount, color: '#3b82f6' },
      { name: 'System', value: systemLogsCount, color: '#6b7280' },
    ].filter(item => item.value > 0);
    
    return data;
  };

  const getTimelineChartData = () => {
    // Group logs by hour for the timeline
    const timeMap = new Map();
    
    validLogs.forEach(log => {
      const date = new Date(log.timestamp);
      const hourKey = `${date.getDate()}/${date.getMonth() + 1} ${date.getHours()}h`;
      
      if (!timeMap.has(hourKey)) {
        timeMap.set(hourKey, {
          time: hourKey,
          timestamp: date.getTime(),
          total: 0,
          error: 0,
          warn: 0,
          info: 0,
          system: 0
        });
      }
      
      const entry = timeMap.get(hourKey);
      entry.total++;
      entry[log.logLevel.toLowerCase()]++;
    });
    
    return Array.from(timeMap.values())
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(-12); // Last 12 hours
  };

  // Chart configs
  const chartConfig = {
    error: { label: "Error", color: "#ef4444" },
    warn: { label: "Warning", color: "#f59e0b" },
    info: { label: "Info", color: "#3b82f6" },
    system: { label: "System", color: "#6b7280" },
    total: { label: "Total", color: "#8b5cf6" },
  };

  // Pagination component
  const PaginationControls = ({ filteredCount }: { filteredCount: number }) => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex items-center justify-between px-2 py-4">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredCount)} of {filteredCount} entries
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                className="min-w-[2.5rem]"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to the VPBank Admin Portal</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">+12.5% from last hour</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">+5 new reports</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">2 resolved today</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Log Level Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Log Distribution
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              System log breakdown
            </p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <PieChart>
                <Pie
                  data={getLogLevelChartData()}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="white"
                  strokeWidth={2}
                >
                  {getLogLevelChartData().map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      className="hover:opacity-80 transition-opacity duration-200"
                    />
                  ))}
                </Pie>
                <ChartTooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                          <p className="font-semibold text-gray-900">{data.name}</p>
                          <p className="text-sm text-gray-600">Count: {data.value}</p>
                          <p className="text-sm text-gray-600">
                            {((data.value / validLogs.length) * 100).toFixed(1)}%
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ChartContainer>
            
            {/* Log Level Summary */}
            <div className="mt-4 space-y-2">
              {getLogLevelChartData().map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Log Stats Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Log Statistics
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Real-time system metrics
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Critical Errors</span>
                </div>
                <span className="text-2xl font-bold text-red-600">{errorLogsCount}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Warnings</span>
                </div>
                <span className="text-2xl font-bold text-yellow-600">{warnLogsCount}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Info Messages</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">{infoLogsCount}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span className="text-sm">System Logs</span>
                </div>
                <span className="text-2xl font-bold text-gray-600">{systemLogsCount}</span>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Logs</span>
                <span className="text-3xl font-bold text-purple-600">{validLogs.length}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">Error Rate</span>
                <span className="text-sm font-medium text-red-500">
                  {validLogs.length > 0 ? ((errorLogsCount / validLogs.length) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logs Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Activity Timeline
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Last 12 hours trend
            </p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <AreaChart data={getTimelineChartData()}>
                <defs>
                  <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="errorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="time" 
                  className="text-xs"
                  tick={{ fill: '#6b7280', fontSize: 10 }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fill: '#6b7280', fontSize: 10 }}
                />
                <ChartTooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                          <p className="font-semibold text-gray-900 mb-2">{label}</p>
                          {payload.map((entry, index) => (
                            <p key={index} className="text-sm" style={{ color: entry.color }}>
                              {entry.name}: {entry.value}
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stackId="1"
                  stroke="#8b5cf6"
                  fill="url(#totalGradient)"
                  strokeWidth={2}
                  name="Total"
                />
                <Area
                  type="monotone"
                  dataKey="error"
                  stackId="2"
                  stroke="#ef4444"
                  fill="url(#errorGradient)"
                  strokeWidth={2}
                  name="Errors"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
                <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">API Server</span>
                <span className="text-green-600 text-sm">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Database</span>
                <span className="text-green-600 text-sm">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Cache</span>
                <span className="text-green-600 text-sm">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Storage</span>
                <span className="text-yellow-600 text-sm">80% Full</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">User login: john.doe@vpbank.com</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">System backup completed</p>
                  <p className="text-xs text-gray-500">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New user registration</p>
                  <p className="text-xs text-gray-500">1 hour ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>


      </div>

      {/* System Logs Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            System Logs
            <Badge variant="outline" className="ml-2">
              {currentLogData?.num_log || allLogsCount} total
            </Badge>
            {(currentLogData?.num_error || errorLogsCount) > 0 && (
              <Badge variant="destructive" className="ml-2">
                {currentLogData?.num_error || errorLogsCount} errors
              </Badge>
            )}
            <Button
              onClick={fetchLogs}
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
          {logError ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
                <p className="text-red-600 font-medium">Error loading logs</p>
                <p className="text-gray-500 text-sm">{logError}</p>
                <Button onClick={fetchLogs} variant="outline" size="sm" className="mt-2">
                  Try Again
                </Button>
              </div>
            </div>
          ) : isLoadingLogs ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-500">Loading logs...</p>
              </div>
            </div>
          ) : !currentLogData ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 font-medium">No log data available</p>
                <p className="text-gray-500 text-sm">Unable to load system logs</p>
                <Button onClick={fetchLogs} variant="outline" size="sm" className="mt-2">
                  Try Loading Again
                </Button>
              </div>
            </div>
          ) : (
          <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All Logs ({allLogsCount})</TabsTrigger>
              <TabsTrigger value="error">Errors ({errorLogsCount})</TabsTrigger>
              <TabsTrigger value="warn">Warnings ({warnLogsCount})</TabsTrigger>
              <TabsTrigger value="info">Info ({infoLogsCount})</TabsTrigger>
              <TabsTrigger value="system">System ({systemLogsCount})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">
                        <Clock className="size-4 inline mr-2" />
                        Timestamp
                      </TableHead>
                      <TableHead className="w-[100px]">Level</TableHead>
                      <TableHead className="w-[120px]">Component</TableHead>
                      <TableHead className="w-[200px]">Trace ID</TableHead>
                      <TableHead>Message</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentLogs.map((log: LogEntry, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono text-xs">
                          {formatTimestamp(log.timestamp)}
                        </TableCell>
                        <TableCell>
                          {getLogLevelBadge(log.logLevel)}
                        </TableCell>
                        <TableCell className="font-medium text-sm">
                          {log.component || 'Unknown'}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">
                          {log.traceId?.slice(0, 8) || 'N/A'}...
                        </TableCell>
                        <TableCell className="text-sm">
                          {log.message || 'No message'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <PaginationControls filteredCount={filteredLogs.length} />
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Total: {currentLogData?.num_log || allLogsCount} logs</span>
                <span>Last updated: {formatTimestamp(validLogs[0]?.timestamp || new Date().toISOString())}</span>
              </div>
            </TabsContent>

            <TabsContent value="error">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Timestamp</TableHead>
                      <TableHead className="w-[120px]">Component</TableHead>
                      <TableHead className="w-[200px]">Trace ID</TableHead>
                      <TableHead>Error Message</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentLogs.map((log: LogEntry, index: number) => (
                        <TableRow key={index}>
                          <TableCell className="font-mono text-xs">
                            {formatTimestamp(log.timestamp)}
                          </TableCell>
                          <TableCell className="font-medium">
                            {log.component || 'Unknown'}
                          </TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            {log.traceId || 'N/A'}
                          </TableCell>
                          <TableCell className="text-sm text-red-600">
                            {log.message || 'No message'}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
              
              <PaginationControls filteredCount={filteredLogs.length} />
            </TabsContent>

            <TabsContent value="warn">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Timestamp</TableHead>
                      <TableHead className="w-[120px]">Component</TableHead>
                      <TableHead>Warning Message</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentLogs.map((log: LogEntry, index: number) => (
                        <TableRow key={index}>
                          <TableCell className="font-mono text-xs">
                            {formatTimestamp(log.timestamp)}
                          </TableCell>
                          <TableCell className="font-medium">
                            {log.component || 'Unknown'}
                          </TableCell>
                          <TableCell className="text-sm text-yellow-600">
                            {log.message || 'No message'}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
              
              <PaginationControls filteredCount={filteredLogs.length} />
            </TabsContent>

            <TabsContent value="info">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Timestamp</TableHead>
                      <TableHead className="w-[120px]">Component</TableHead>
                      <TableHead>Info Message</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentLogs.map((log: LogEntry, index: number) => (
                        <TableRow key={index}>
                          <TableCell className="font-mono text-xs">
                            {formatTimestamp(log.timestamp)}
                          </TableCell>
                          <TableCell className="font-medium">
                            {log.component || 'Unknown'}
                          </TableCell>
                          <TableCell className="text-sm text-blue-600">
                            {log.message || 'No message'}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
              
              <PaginationControls filteredCount={filteredLogs.length} />
            </TabsContent>

            <TabsContent value="system">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Timestamp</TableHead>
                      <TableHead className="w-[120px]">Component</TableHead>
                      <TableHead className="w-[200px]">Trace ID</TableHead>
                      <TableHead>System Message</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentLogs.map((log: LogEntry, index: number) => (
                        <TableRow key={index}>
                          <TableCell className="font-mono text-xs">
                            {formatTimestamp(log.timestamp)}
                          </TableCell>
                          <TableCell className="font-medium">
                            {log.component || 'Unknown'}
                          </TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            {log.traceId?.slice(0, 8) || 'N/A'}...
                          </TableCell>
                          <TableCell className="text-sm">
                            {log.message || 'No message'}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
              
              <PaginationControls filteredCount={filteredLogs.length} />
            </TabsContent>
          </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
