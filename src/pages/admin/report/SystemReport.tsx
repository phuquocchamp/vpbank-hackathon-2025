import { useState, useEffect } from 'react';
import { useAdminData } from '@/hooks/useAdminData';
import { useHeader } from '@/contexts/HeaderContext';
import { Badge } from '@/components/ui/badge';
import { FileText, BarChart3, DollarSign, Target } from 'lucide-react';
import BillingChart from '@/components/admin/BillingChart';
import SystemLogsTable from '@/components/admin/SystemLogsTable';
import TaskTracking from '@/components/admin/TaskTracking';
import { useAuth } from '@/contexts/AuthContext';

const SystemReport = () => {
  const { setHeaderInfo } = useHeader();

  // Pagination states for logs
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('all');
  const itemsPerPage = 10;

  // Use the custom hook for data management
  const {
    logData,
    isLoadingLogs,
    logError,
    fetchLogs,
    billingData,
    isLoadingBilling,
    billingError,
    fetchBilling,
  } = useAdminData();

  const { user } = useAuth();

  // Ensure logs array is always valid - only if we have valid data from API
  const validLogs = logData && Array.isArray(logData.body) ? logData.body : [];

  // Set header information on component mount
  useEffect(() => {
    setHeaderInfo({
      title: 'System Reports',
      description: 'Comprehensive system analytics, billing trends, and task monitoring',
      badge: (
        <Badge variant="outline" className="text-xs">
          <FileText className="size-3 mr-1" />
          Advanced Reports
        </Badge>
      ),
      extra: validLogs.length > 0 ? (
        <Badge variant="secondary" className="text-xs">
          <BarChart3 className="size-3 mr-1" />
          {validLogs.length} System Events
        </Badge>
      ) : null
    });

    return () => setHeaderInfo(null);
  }, [setHeaderInfo, validLogs.length]);

  // Reset page when changing tabs
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 system-report-container">
      {/* Report Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300">System Logs</h3>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{validLogs.length}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400">Total events tracked</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 p-6 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-green-700 dark:text-green-300">Billing Trends</h3>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                {billingData && billingData.length > 0 ? `$${billingData[billingData.length - 1]?.cost || 0}` : '$0'}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400">Current month</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-purple-700 dark:text-purple-300">Task Tracking</h3>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">Active</p>
              <p className="text-xs text-purple-600 dark:text-purple-400">Monitoring enabled</p>
            </div>
            <Target className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>

      {/* Financial Reports Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Financial Reports</h2>
        </div>
        <BillingChart
          billingData={billingData}
          isLoadingBilling={isLoadingBilling}
          billingError={billingError}
          onRefresh={fetchBilling}
        />
      </div>

      {/* Task Management Reports Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Task Management Reports</h2>
        </div>
        <TaskTracking userId={user?.id} />
      </div>

      {/* System Logs Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">System Logs Report</h2>
        </div>
        <SystemLogsTable
          logData={logData}
          isLoadingLogs={isLoadingLogs}
          logError={logError}
          currentPage={currentPage}
          activeTab={activeTab}
          itemsPerPage={itemsPerPage}
          onRefresh={fetchLogs}
          onTabChange={handleTabChange}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default SystemReport;
