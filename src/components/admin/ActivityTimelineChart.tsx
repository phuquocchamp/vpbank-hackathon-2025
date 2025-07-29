import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface LogEntry {
  time: string;
  date: string;
  log_level: string;
}

interface ActivityTimelineChartProps {
  validLogs: LogEntry[];
}

const ActivityTimelineChart = ({ validLogs }: ActivityTimelineChartProps) => {
  const chartConfig = {
    error: { label: "Error", color: "#ef4444" },
    info: { label: "Info", color: "#3b82f6" },
    total: { label: "Total", color: "#8b5cf6" },
  };

  const getTimelineChartData = () => {
    // Group logs by hour for the timeline
    const timeMap = new Map();
    
    validLogs.forEach((log: LogEntry) => {
      // Parse the date and time from the new format
      const [day, month, year] = log.date.split('-');
      const [hour] = log.time.split(':');
      const hourKey = `${day}/${month} ${hour}h`;
      
      const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour));
      
      if (!timeMap.has(hourKey)) {
        timeMap.set(hourKey, {
          time: hourKey,
          timestamp: dateObj.getTime(),
          total: 0,
          error: 0,
          info: 0
        });
      }
      
      const entry = timeMap.get(hourKey);
      entry.total++;
      const logLevel = log.log_level.toLowerCase();
      if (logLevel === 'error' || logLevel === 'info') {
        entry[logLevel]++;
      }
    });
    
    return Array.from(timeMap.values())
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(-12); // Last 12 hours
  };

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Activity Timeline
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Last 12 hours trend
        </p>
      </CardHeader>
      <CardContent className="min-h-[280px]">
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
              <linearGradient id="infoGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
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
            <Area
              type="monotone"
              dataKey="info"
              stackId="3"
              stroke="#3b82f6"
              fill="url(#infoGradient)"
              strokeWidth={2}
              name="Info"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ActivityTimelineChart;
