import { useEffect } from 'react';
import { useAdminData, type LogEntry } from '@/hooks/useAdminData';
import { useHeader } from '@/contexts/HeaderContext';
import { Badge } from '@/components/ui/badge';
import { Activity, Shield, FileText, BarChart3 } from 'lucide-react';
import LogOverviewChart from '@/components/admin/LogOverviewChart';
import ActivityTimelineChart from '@/components/admin/ActivityTimelineChart';

const AdminDashboard = () => {
  const { setHeaderInfo } = useHeader();

  // Use the custom hook for data management
  const {
    logData,
  } = useAdminData();

  // Ensure logs array is always valid - only if we have valid data from API
  const validLogs = logData && Array.isArray(logData.body) ? logData.body : [];

  // Calculate counts for each tab - only if we have valid data
  const errorLogsCount = validLogs.filter((log: LogEntry) => log.log_level.toLowerCase() === 'error').length;
  const infoLogsCount = validLogs.filter((log: LogEntry) => log.log_level.toLowerCase() === 'info').length;

  // Set header information on component mount
  useEffect(() => {
    setHeaderInfo({
      title: 'Admin Dashboard',
      description: 'Real-time system monitoring and log analytics overview',
      badge: (
        <Badge variant="outline" className="text-xs">
          <Activity className="size-3 mr-1" />
          Live Dashboard
        </Badge>
      ),
      extra: errorLogsCount > 0 ? (
        <Badge variant="destructive" className="text-xs">
          <Shield className="size-3 mr-1" />
          {errorLogsCount} Critical Errors
        </Badge>
      ) : (
        <Badge variant="secondary" className="text-xs">
          <Shield className="size-3 mr-1" />
          System Healthy
        </Badge>
      )
    });

    return () => setHeaderInfo(null);
  }, [setHeaderInfo, errorLogsCount]);

  return (
    <div className="space-y-6 admin-dashboard-container">
      {/* Quick Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300">System Status</h3>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">
                {errorLogsCount === 0 ? 'Healthy' : 'Issues Detected'}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                {validLogs.length} total events monitored
              </p>
              {errorLogsCount > 0 && (
                <div className="mt-2">
                  <Badge variant="destructive" className="text-xs">
                    {errorLogsCount} errors need attention
                  </Badge>
                </div>
              )}
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-green-700 dark:text-green-300">Reports Available</h3>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">3</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                Billing, Tasks & Logs in System Reports
              </p>
              <div className="mt-2">
                <Badge variant="outline" className="text-xs border-green-300 text-green-700">
                  All systems operational
                </Badge>
              </div>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
              <div className="flex gap-1">
                <FileText className="h-4 w-4 text-green-600" />
                <BarChart3 className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">System Analytics</h2>
          <Badge variant="outline" className="text-xs">Real-time</Badge>
        </div>
        
        {/* Analytics Row - Log Overview and Activity Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Merged Log Distribution and Statistics */}
          <div className="w-full">
            <LogOverviewChart
              errorLogsCount={errorLogsCount}
              infoLogsCount={infoLogsCount}
              validLogsLength={validLogs.length}
            />
          </div>

          {/* Activity Timeline */}
          <div className="w-full">
            <ActivityTimelineChart validLogs={validLogs} />
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;