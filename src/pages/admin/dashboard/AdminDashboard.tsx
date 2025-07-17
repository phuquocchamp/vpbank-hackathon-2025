import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Terminal, AlertCircle, CheckCircle, Info, Clock, RefreshCw, ChevronLeft, ChevronRight, TrendingUp, BarChart3 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts';

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

interface BillingEntry {
  date: string;
  cost: number;
}

const AdminDashboard = () => {
  const [logData, setLogData] = useState<LogData | null>(null);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);
  const [logError, setLogError] = useState<string | null>(null);
  
  // Billing states
  const [billingData, setBillingData] = useState<BillingEntry[] | null>(null);
  const [isLoadingBilling, setIsLoadingBilling] = useState(true);
  const [billingError, setBillingError] = useState<string | null>(null);
  
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

  // Fetch billing data from API
  const fetchBilling = async () => {
    setIsLoadingBilling(true);
    setBillingError(null);
    
    try {
      const response = await fetch(`${BASE_URL}/billing`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // API response có cấu trúc { body: [{ date, cost }, ...] }
      if (result.body && Array.isArray(result.body)) {
        setBillingData(result.body);
      } else if (Array.isArray(result)) {
        setBillingData(result);
      } else {
        throw new Error('Invalid billing data format');
      }
    } catch (error) {
      console.error('Failed to fetch billing data:', error);
      setBillingError(error instanceof Error ? error.message : 'Failed to fetch billing data');
      // Set mock data as fallback
      setBillingData([
        { date: "2025-07-01", cost: 6.2 },
        { date: "2025-07-02", cost: 0 },
        { date: "2025-07-03", cost: 8.5 },
        { date: "2025-07-04", cost: 12.3 },
        { date: "2025-07-05", cost: 15.7 },
        { date: "2025-07-06", cost: 9.1 },
        { date: "2025-07-07", cost: 11.4 },
        { date: "2025-07-08", cost: 7.8 },
        { date: "2025-07-09", cost: 13.2 },
        { date: "2025-07-10", cost: 10.6 },
        { date: "2025-07-11", cost: 14.9 },
        { date: "2025-07-12", cost: 8.3 },
        { date: "2025-07-13", cost: 16.1 },
        { date: "2025-07-14", cost: 12.7 },
        { date: "2025-07-15", cost: 9.5 },
        { date: "2025-07-16", cost: 11.8 },
        { date: "2025-07-17", cost: 13.6 }
      ]);
    } finally {
      setIsLoadingBilling(false);
    }
  };

  // Load logs and billing data on component mount
  useEffect(() => {
    fetchLogs();
    fetchBilling();
  }, []);

  // Mock billing data - fallback khi không có API
  const mockBillingData: BillingEntry[] = [
    { date: "2025-07-01", cost: 6.2 },
    { date: "2025-07-02", cost: 0 },
    { date: "2025-07-03", cost: 8.5 },
    { date: "2025-07-04", cost: 12.3 },
    { date: "2025-07-05", cost: 15.7 },
    { date: "2025-07-06", cost: 9.1 },
    { date: "2025-07-07", cost: 11.4 },
    { date: "2025-07-08", cost: 7.8 },
    { date: "2025-07-09", cost: 13.2 },
    { date: "2025-07-10", cost: 10.6 },
    { date: "2025-07-11", cost: 14.9 },
    { date: "2025-07-12", cost: 8.3 },
    { date: "2025-07-13", cost: 16.1 },
    { date: "2025-07-14", cost: 12.7 },
    { date: "2025-07-15", cost: 9.5 },
    { date: "2025-07-16", cost: 11.8 },
    { date: "2025-07-17", cost: 13.6 }
  ];

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

  const getBillingChartData = () => {
    const currentBillingData = billingData || mockBillingData;
    return currentBillingData.map(entry => ({
      ...entry,
      formattedDate: new Date(entry.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      formattedCost: `$${entry.cost.toFixed(2)}`
    }));
  };

  const getTotalBillingCost = () => {
    const currentBillingData = billingData || mockBillingData;
    return currentBillingData.reduce((total, entry) => total + entry.cost, 0);
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        {/* Log Level Distribution */}
        <Card className="md:col-span-1">
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
            <ChartContainer config={chartConfig} className="aspect-square w-full max-h-[280px]">
              <PieChart>
                <Pie
                  data={getLogLevelChartData()}
                  cx="50%"
                  cy="50%"
                  innerRadius="40%"
                  outerRadius="75%"
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
            <div className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2">
              {getLogLevelChartData().map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="truncate">{item.name}</span>
                  </div>
                  <span className="font-medium text-xs sm:text-sm">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Log Stats Summary */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Log Statistics
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Real-time system metrics
            </p>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 lg:space-y-6">
            <div className="space-y-2 sm:space-y-3 lg:space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                  <span className="text-xs sm:text-sm">Critical Errors</span>
                </div>
                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600">{errorLogsCount}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></div>
                  <span className="text-xs sm:text-sm">Warnings</span>
                </div>
                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-600">{warnLogsCount}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <span className="text-xs sm:text-sm">Info Messages</span>
                </div>
                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">{infoLogsCount}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full flex-shrink-0"></div>
                  <span className="text-xs sm:text-sm">System Logs</span>
                </div>
                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-600">{systemLogsCount}</span>
              </div>
            </div>
            
            <div className="pt-3 sm:pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium">Total Logs</span>
                <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600">{validLogs.length}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">Error Rate</span>
                <span className="text-xs sm:text-sm font-medium text-red-500">
                  {validLogs.length > 0 ? ((errorLogsCount / validLogs.length) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logs Timeline */}
        <Card className="md:col-span-2 xl:col-span-2">
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
            <ChartContainer config={chartConfig} className="aspect-[4/3] w-full max-h-[280px]">
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
                  tick={{ fill: '#6b7280', fontSize: 9 }}
                  interval="preserveStartEnd"
                  minTickGap={5}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fill: '#6b7280', fontSize: 9 }}
                  width={25}
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
      </div>

      {/* Billing Chart Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Billing Trends
            <Badge variant="secondary" className="ml-2">
              Total: ${getTotalBillingCost().toFixed(2)}
            </Badge>
            <Button
              onClick={fetchBilling}
              disabled={isLoadingBilling}
              variant="outline"
              size="sm"
              className="ml-auto"
            >
              {isLoadingBilling ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Daily billing costs over time • Total: ${getTotalBillingCost().toFixed(2)}
          </p>
        </CardHeader>
        <CardContent>
          {billingError ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
                <p className="text-red-600 font-medium">Error loading billing data</p>
                <p className="text-gray-500 text-sm">{billingError}</p>
                <Button onClick={fetchBilling} variant="outline" size="sm" className="mt-2">
                  Try Again
                </Button>
              </div>
            </div>
          ) : isLoadingBilling ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-500">Loading billing data...</p>
              </div>
            </div>
          ) : (
            <ChartContainer config={chartConfig} className="aspect-[16/6] w-full max-h-[400px]">
              <BarChart data={getBillingChartData()}>
                <defs>
                  <linearGradient id="billingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="formattedDate" 
                  className="text-xs"
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  interval="preserveStartEnd"
                  minTickGap={10}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  width={40}
                  tickFormatter={(value) => `$${value}`}
                />
                <ChartTooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                          <p className="font-semibold text-gray-900 mb-2">{label}</p>
                          <p className="text-sm text-blue-600">
                            Cost: {data.formattedCost}
                          </p>
                          <p className="text-xs text-gray-500">
                            Date: {data.date}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="cost"
                  fill="url(#billingGradient)"
                  stroke="#3b82f6"
                  strokeWidth={1}
                  radius={[4, 4, 0, 0]}
                  name="Daily Cost"
                />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

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
