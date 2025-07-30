import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { PieChart, Pie, Cell } from 'recharts';
import { BarChart3, Activity } from 'lucide-react';

interface LogOverviewChartProps {
  errorLogsCount: number;
  infoLogsCount: number;
  validLogsLength: number;
}

const LogOverviewChart = ({ errorLogsCount, infoLogsCount, validLogsLength }: LogOverviewChartProps) => {
  const chartConfig = {
    error: { label: "Error", color: "#ef4444" },
    info: { label: "Info", color: "#3b82f6" },
  };

  const getLogLevelChartData = () => {
    const data = [
      { name: 'Error', value: errorLogsCount, color: '#ef4444' },
      { name: 'Info', value: infoLogsCount, color: '#3b82f6' },
    ].filter(item => item.value > 0);
    
    return data;
  };

  const errorRate = validLogsLength > 0 ? ((errorLogsCount / validLogsLength) * 100).toFixed(1) : 0;

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Log Analytics Overview
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Distribution and real-time metrics
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[280px]">
          {/* Chart Section */}
          <div className="flex flex-col items-center justify-center">
            <ChartContainer config={chartConfig} className="aspect-square w-full max-h-[180px]">
              <PieChart>
                <Pie
                  data={getLogLevelChartData()}
                  cx="50%"
                  cy="50%"
                  innerRadius="35%"
                  outerRadius="70%"
                  paddingAngle={3}
                  dataKey="value"
                  stroke="white"
                  strokeWidth={2}
                >
                  {getLogLevelChartData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip />
              </PieChart>
            </ChartContainer>
            
            {/* Legend */}
            <div className="flex gap-4 mt-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm">Error</span>
                <span className="text-sm font-semibold">{errorLogsCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Info</span>
                <span className="text-sm font-semibold">{infoLogsCount}</span>
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="space-y-4 flex flex-col justify-center">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm">Critical Errors</span>
                </div>
                <span className="text-2xl font-bold text-red-600">{errorLogsCount}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm">Info Messages</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">{infoLogsCount}</span>
              </div>
            </div>
            
            <div className="pt-3 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Logs</span>
                <span className="text-3xl font-bold text-purple-600">{validLogsLength}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">Error Rate</span>
                <span className="text-sm font-medium text-red-500">
                  {errorRate}%
                </span>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="pt-2">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                errorLogsCount === 0 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                  : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
              }`}>
                <Activity className="h-3 w-3" />
                {errorLogsCount === 0 ? 'System Healthy' : 'Issues Detected'}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LogOverviewChart;
