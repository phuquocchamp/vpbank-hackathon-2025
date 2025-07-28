import { useState, useMemo } from 'react';

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

export interface LogFilters {
  dateFrom: string;
  dateTo: string;
  service: string;
  user: string;
  message: string;
}

// Helper function to parse date string in DD-MM-YYYY format
const parseDateString = (dateStr: string): Date => {
  const [day, month, year] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const useLogFilters = (logs: LogEntry[]) => {
  const [filters, setFilters] = useState<LogFilters>({
    dateFrom: '',
    dateTo: '',
    service: '',
    user: '',
    message: ''
  });

  const filteredLogs = useMemo(() => {
    if (!logs || logs.length === 0) return [];

    return logs.filter((log) => {
      // Date filter (from)
      if (filters.dateFrom) {
        const logDate = parseDateString(log.date);
        const filterDate = parseDateString(filters.dateFrom);
        if (logDate < filterDate) return false;
      }

      // Date filter (to)
      if (filters.dateTo) {
        const logDate = parseDateString(log.date);
        const filterDate = parseDateString(filters.dateTo);
        if (logDate > filterDate) return false;
      }

      // Service filter
      if (filters.service) {
        if (!log.service_name?.toLowerCase().includes(filters.service.toLowerCase())) {
          return false;
        }
      }

      // User filter
      if (filters.user) {
        if (!log.user_name?.toLowerCase().includes(filters.user.toLowerCase())) {
          return false;
        }
      }

      // Message filter
      if (filters.message) {
        if (!log.message?.toLowerCase().includes(filters.message.toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }, [logs, filters]);

  const clearFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      service: '',
      user: '',
      message: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value.trim() !== '');

  return {
    filters,
    setFilters,
    filteredLogs,
    clearFilters,
    hasActiveFilters
  };
};
