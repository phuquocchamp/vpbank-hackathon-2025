import { useState } from 'react';
import { useAdminData, type LogEntry } from '@/hooks/useAdminData';
import LogDistributionChart from '@/components/admin/LogDistributionChart';
import LogStatisticsCard from '@/components/admin/LogStatisticsCard';
import ActivityTimelineChart from '@/components/admin/ActivityTimelineChart';
import BillingChart from '@/components/admin/BillingChart';
import SystemLogsTable from '@/components/admin/SystemLogsTable';

const AdminDashboard = () => {
  // Pagination states
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

  // Ensure logs array is always valid - only if we have valid data from API
  const validLogs = logData && Array.isArray(logData.body) ? logData.body : [];
  
  // Calculate counts for each tab - only if we have valid data
  const errorLogsCount = validLogs.filter((log: LogEntry) => log.log_level.toLowerCase() === 'error').length;
  const infoLogsCount = validLogs.filter((log: LogEntry) => log.log_level.toLowerCase() === 'info').length;

  // Reset page when changing tabs
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
    // Note: Filters are maintained when switching tabs for better UX
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
        <LogDistributionChart
          errorLogsCount={errorLogsCount}
          infoLogsCount={infoLogsCount}
          validLogsLength={validLogs.length}
        />

        {/* Log Stats Summary */}
        <LogStatisticsCard
          errorLogsCount={errorLogsCount}
          infoLogsCount={infoLogsCount}
          totalLogsCount={validLogs.length}
        />

        {/* Logs Timeline */}
        <ActivityTimelineChart validLogs={validLogs} />
      </div>

      {/* Billing Chart Section */}
      <BillingChart
        billingData={billingData}
        isLoadingBilling={isLoadingBilling}
        billingError={billingError}
        onRefresh={fetchBilling}
      />

      {/* System Logs Section */}
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
  );
};

export default AdminDashboard;