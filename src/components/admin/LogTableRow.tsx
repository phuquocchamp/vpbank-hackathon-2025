import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

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

interface LogTableRowProps {
  log: LogEntry;
  index: number;
  showLevel?: boolean;
}

const LogTableRow = ({ log, index, showLevel = true }: LogTableRowProps) => {
  const getLogLevelBadge = (level: string) => {
    switch (level.toLowerCase()) {
      case 'error':
        return <Badge variant="destructive" className="text-xs"><AlertCircle className="size-3 mr-1" />ERROR</Badge>;
      case 'info':
        return <Badge variant="outline" className="text-xs text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400"><CheckCircle className="size-3 mr-1" />INFO</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{level}</Badge>;
    }
  };

  const formatTimestamp = (date: string, time: string) => {
    // Parse the date string (DD-MM-YYYY) and time string (HH:MM:SS)
    const [day, month, year] = date.split('-');
    const [hour, minute, second] = time.split(':');
    
    const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute), parseInt(second || '0'));
    
    return dateObj.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div 
      key={index} 
      className={`grid ${showLevel ? 'grid-cols-12' : 'grid-cols-11'} gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors`}
    >
      <div className="col-span-2 font-mono text-xs text-gray-600 dark:text-gray-300 flex items-center">
        {formatTimestamp(log.date, log.time)}
      </div>
      <div className="col-span-2 font-mono text-sm font-bold text-blue-700 dark:text-blue-300 flex items-center bg-blue-50 dark:bg-blue-950/40 px-2 py-1 rounded border border-blue-200 dark:border-blue-800/50">
        <span className="truncate">
          {log.service_name || 'N/A'}
        </span>
      </div>
      {showLevel && (
        <div className="col-span-1 flex items-center">
          {getLogLevelBadge(log.log_level)}
        </div>
      )}
      <div className="col-span-1 text-xs flex items-center">
        <span className={`px-2 py-1 rounded text-xs font-mono border ${
          log.code >= 200 && log.code < 300 
            ? 'bg-green-50 dark:bg-green-950/40 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800/50' 
            : log.code >= 400 
            ? 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800/50' 
            : 'bg-gray-50 dark:bg-gray-800/40 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700/50'
        }`}>
          {log.code || 'N/A'}
        </span>
      </div>
      <div className="col-span-2 font-medium text-sm text-gray-900 dark:text-gray-100 flex items-center">
        <span className="truncate" title={log.user_name || 'Unknown'}>
          {log.user_name || 'Unknown'}
        </span>
      </div>
      <div className="col-span-1 text-sm font-bold text-purple-700 dark:text-purple-300 flex items-center bg-purple-50 dark:bg-purple-950/40 px-2 py-1 rounded border border-purple-200 dark:border-purple-800/50">
        <span className="truncate" title={log.user_role || 'N/A'}>
          {log.user_role || 'N/A'}
        </span>
      </div>
      <div className={`${showLevel ? 'col-span-3' : 'col-span-4'} text-sm ${
        log.log_level.toLowerCase() === 'error' ? 'text-red-700 dark:text-red-300' : 
        log.log_level.toLowerCase() === 'info' ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-gray-100'
      } flex items-center`}>
        <span className="break-words">
          {log.message || 'No message'}
        </span>
      </div>
    </div>
  );
};

interface LogTableHeaderProps {
  showLevel?: boolean;
  headerColor?: string;
  textColor?: string;
}

export const LogTableHeader = ({ showLevel = true, headerColor = 'bg-gray-50 dark:bg-gray-800/50', textColor = 'text-gray-700 dark:text-gray-200' }: LogTableHeaderProps) => {
  return (
    <div className={`grid ${showLevel ? 'grid-cols-12' : 'grid-cols-11'} gap-4 px-6 py-4 ${headerColor} border-b border-gray-200 dark:border-gray-700 text-sm font-medium ${textColor}`}>
      <div className="col-span-2 flex items-center gap-2">
        <Clock className="h-4 w-4" />
        Timestamp
      </div>
      <div className="col-span-2 font-bold text-blue-700 dark:text-blue-300">Service</div>
      {showLevel && <div className="col-span-1">Level</div>}
      <div className="col-span-1">Code</div>
      <div className="col-span-2">User</div>
      <div className="col-span-1 font-bold text-purple-700 dark:text-purple-300">Role</div>
      <div className={showLevel ? 'col-span-3' : 'col-span-4'}>Message</div>
    </div>
  );
};

export default LogTableRow;
