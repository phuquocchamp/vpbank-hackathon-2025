import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Calendar, Search, Filter, X, User, Server, MessageSquare } from 'lucide-react';
import type { LogFilters } from '../../hooks/useLogFilters';

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

interface LogFilterBarProps {
  logs: LogEntry[];
  filters: LogFilters;
  onFiltersChange: (filters: LogFilters) => void;
  onClearFilters: () => void;
}

const LogFilterBar = ({ logs, filters, onFiltersChange, onClearFilters }: LogFilterBarProps) => {
  // Get unique values for filter suggestions
  const uniqueServices = Array.from(new Set(logs.map(log => log.service_name).filter(Boolean)));
  const uniqueUsers = Array.from(new Set(logs.map(log => log.user_name).filter(Boolean)));

  const handleFilterChange = (key: keyof LogFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(value => value.trim() !== '');
  const activeFiltersCount = Object.values(filters).filter(value => value.trim() !== '').length;

  // Format date for input (convert DD-MM-YYYY to YYYY-MM-DD)
  const formatDateForInput = (dateStr: string) => {
    if (!dateStr) return '';
    const [day, month, year] = dateStr.split('-');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  // Format date for filter (convert YYYY-MM-DD to DD-MM-YYYY)
  const formatDateForFilter = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year}`;
  };

  return (
    <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                Filter System Logs
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    {activeFiltersCount} active
                  </Badge>
                )}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Refine your search to find specific logs</p>
            </div>
          </div>
          
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              <X className="h-4 w-4 mr-2" />
              Clear All Filters
            </Button>
          )}
        </div>

        {/* Filter Controls - Always Visible */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Date From Filter */}
          <div className="space-y-3">
            <Label htmlFor="dateFrom" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              From Date
            </Label>
            <Input
              id="dateFrom"
              type="date"
              value={formatDateForInput(filters.dateFrom)}
              onChange={(e) => handleFilterChange('dateFrom', formatDateForFilter(e.target.value))}
              className="text-sm bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Date To Filter */}
          <div className="space-y-3">
            <Label htmlFor="dateTo" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              To Date
            </Label>
            <Input
              id="dateTo"
              type="date"
              value={formatDateForInput(filters.dateTo)}
              onChange={(e) => handleFilterChange('dateTo', formatDateForFilter(e.target.value))}
              className="text-sm bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Service Filter */}
          <div className="space-y-3">
            <Label htmlFor="service" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Server className="h-4 w-4 text-green-600 dark:text-green-400" />
              Service
            </Label>
            <div className="relative">
              <Input
                id="service"
                list="services"
                placeholder="e.g., bedrock_agent"
                value={filters.service}
                onChange={(e) => handleFilterChange('service', e.target.value)}
                className="text-sm bg-white border-gray-300 focus:border-green-500 focus:ring-green-500 placeholder-gray-400"
              />
              <datalist id="services">
                {uniqueServices.map((service) => (
                  <option key={service} value={service} />
                ))}
              </datalist>
            </div>
          </div>

          {/* User Filter */}
          <div className="space-y-3">
            <Label htmlFor="user" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              User
            </Label>
            <div className="relative">
              <Input
                id="user"
                list="users"
                placeholder="e.g., admin@example.com"
                value={filters.user}
                onChange={(e) => handleFilterChange('user', e.target.value)}
                className="text-sm bg-white border-gray-300 focus:border-purple-500 focus:ring-purple-500 placeholder-gray-400"
              />
              <datalist id="users">
                {uniqueUsers.map((user) => (
                  <option key={user} value={user} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Message Search Filter */}
          <div className="space-y-3">
            <Label htmlFor="message" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-orange-600" />
              Find Message
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="message"
                placeholder="Search message content..."
                value={filters.message}
                onChange={(e) => handleFilterChange('message', e.target.value)}
                className="pl-10 text-sm bg-white border-gray-300 focus:border-orange-500 focus:ring-orange-500 placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Quick Filter Buttons */}
        <div className="mt-6 pt-4 border-t border-blue-200">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-gray-600 font-semibold">Quick filters:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterChange('dateFrom', '28-07-2025')}
              className="text-xs bg-white hover:bg-blue-50 border-blue-300"
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const yesterday = '27-07-2025';
                handleFilterChange('dateFrom', yesterday);
                handleFilterChange('dateTo', yesterday);
              }}
              className="text-xs bg-white hover:bg-blue-50 border-blue-300"
            >
              Yesterday
            </Button>
            {uniqueServices.slice(0, 3).map((service) => (
              <Button
                key={service}
                variant="outline"
                size="sm"
                onClick={() => handleFilterChange('service', service)}
                className="text-xs bg-white hover:bg-green-50 border-green-300"
              >
                {service}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterChange('message', 'ERROR')}
              className="text-xs bg-white hover:bg-red-50 border-red-300 text-red-600"
            >
              Show Errors
            </Button>
          </div>
        </div>

        {/* Active Filters Tags */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-blue-200">
            <div className="flex flex-wrap gap-2">
              {filters.dateFrom && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  From: {filters.dateFrom}
                  <button 
                    onClick={() => handleFilterChange('dateFrom', '')}
                    className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.dateTo && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  To: {filters.dateTo}
                  <button 
                    onClick={() => handleFilterChange('dateTo', '')}
                    className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.service && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Service: {filters.service}
                  <button 
                    onClick={() => handleFilterChange('service', '')}
                    className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.user && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                  User: {filters.user.length > 20 ? filters.user.substring(0, 20) + '...' : filters.user}
                  <button 
                    onClick={() => handleFilterChange('user', '')}
                    className="ml-1 hover:bg-purple-200 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.message && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                  Message: "{filters.message.length > 15 ? filters.message.substring(0, 15) + '...' : filters.message}"
                  <button 
                    onClick={() => handleFilterChange('message', '')}
                    className="ml-1 hover:bg-orange-200 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LogFilterBar;
