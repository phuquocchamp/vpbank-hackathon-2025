import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';

interface LogStatisticsCardProps {
  errorLogsCount: number;
  infoLogsCount: number;
  totalLogsCount: number;
}

const LogStatisticsCard = ({ errorLogsCount, infoLogsCount, totalLogsCount }: LogStatisticsCardProps) => {
  const errorRate = totalLogsCount > 0 ? ((errorLogsCount / totalLogsCount) * 100).toFixed(1) : 0;

  return (
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
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
              <span className="text-xs sm:text-sm">Info Messages</span>
            </div>
            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">{infoLogsCount}</span>
          </div>
        </div>
        
        <div className="pt-3 sm:pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium">Total Logs</span>
            <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600">{totalLogsCount}</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">Error Rate</span>
            <span className="text-xs sm:text-sm font-medium text-red-500">
              {errorRate}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LogStatisticsCard;
