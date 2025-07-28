import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { PieChart, Pie, Cell } from 'recharts';
import { BarChart3 } from 'lucide-react';

interface LogDistributionChartProps {
  errorLogsCount: number;
  infoLogsCount: number;
  validLogsLength: number;
}

const LogDistributionChart = ({ errorLogsCount, infoLogsCount, validLogsLength }: LogDistributionChartProps) => {
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

  return (
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
                        {validLogsLength > 0 ? ((data.value / validLogsLength) * 100).toFixed(1) : 0}%
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
  );
};

export default LogDistributionChart;
