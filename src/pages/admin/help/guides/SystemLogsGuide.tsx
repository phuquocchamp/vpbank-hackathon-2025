import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useHeader } from '@/contexts/HeaderContext';
import { 
  Terminal, 
  Search, 
  Filter, 
  AlertCircle, 
  Info,
  Calendar,
  User,
  Code,
  ArrowRight,
  CheckCircle,
  RefreshCw
} from 'lucide-react';

const SystemLogsGuide = () => {
  const { setHeaderInfo } = useHeader();

  useEffect(() => {
    setHeaderInfo({
      title: 'System Logs Guide',
      description: 'Learn how to monitor and analyze system logs effectively',
      badge: (
        <Badge variant="outline" className="text-xs">
          <Terminal className="size-3 mr-1" />
          Logs Guide
        </Badge>
      )
    });

    return () => setHeaderInfo(null);
  }, [setHeaderInfo]);

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      {/* Introduction */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-6 w-6 text-gray-700" />
            System Logs Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            System logs provide detailed insights into all system activities, errors, and user interactions. 
            This guide will help you effectively monitor, filter, and analyze system logs to maintain optimal performance.
          </p>
          
          <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-900 dark:text-blue-100">Access System Logs</span>
            </div>
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              Navigate to "System Reports" in the admin sidebar to access comprehensive system logs and analytics.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Log Levels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            Understanding Log Levels
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            System logs are categorized by severity levels to help you prioritize your attention:
          </p>

          <div className="grid gap-4">
            {/* Error Logs */}
            <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/50 rounded-lg border border-red-200 dark:border-red-800">
              <div className="bg-red-100 dark:bg-red-900 p-2 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h4 className="font-semibold text-red-900 dark:text-red-100">ERROR Level</h4>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  Critical issues that require immediate attention. These may indicate system failures, 
                  authentication problems, or service disruptions that affect user experience.
                </p>
                <div className="mt-2">
                  <Badge variant="destructive" className="text-xs">High Priority</Badge>
                </div>
              </div>
            </div>

            {/* Info Logs */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                <Info className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">INFO Level</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Normal operational messages that confirm successful operations, user actions, 
                  and system responses. These help track regular system activity.
                </p>
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">Normal Operation</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Log Structure */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5 text-purple-600" />
            Log Entry Structure
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Each log entry contains structured information to help you understand system events:
          </p>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border">
            <div className="grid gap-3 text-sm">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-purple-600" />
                <span className="font-medium">Time & Date:</span>
                <span className="text-muted-foreground">Exact timestamp when the event occurred</span>
              </div>
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-purple-600" />
                <span className="font-medium">User Information:</span>
                <span className="text-muted-foreground">User email and role (Admin/User)</span>
              </div>
              <div className="flex items-center gap-3">
                <AlertCircle className="h-4 w-4 text-purple-600" />
                <span className="font-medium">Log Level:</span>
                <span className="text-muted-foreground">ERROR or INFO severity level</span>
              </div>
              <div className="flex items-center gap-3">
                <Code className="h-4 w-4 text-purple-600" />
                <span className="font-medium">Status Code:</span>
                <span className="text-muted-foreground">HTTP response code (200, 404, 500, etc.)</span>
              </div>
              <div className="flex items-center gap-3">
                <Terminal className="h-4 w-4 text-purple-600" />
                <span className="font-medium">Service Name:</span>
                <span className="text-muted-foreground">System component that generated the log</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtering and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-indigo-600" />
            Filtering and Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Efficient log management requires effective filtering and search capabilities:
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <ArrowRight className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-medium">Tab-based Filtering</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Switch between "All Logs", "Error Logs", and "Info Logs" tabs to focus on specific log types.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ArrowRight className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-medium">Search Functionality</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Use the search bar to find specific messages, user emails, service names, or error codes.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ArrowRight className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-medium">Date Range Filtering</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Filter logs by specific date ranges to analyze system behavior during particular time periods.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-950/50 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
            <div className="flex items-center gap-2 mb-2">
              <Search className="h-5 w-5 text-indigo-600" />
              <span className="font-medium text-indigo-900 dark:text-indigo-100">Search Tips</span>
            </div>
            <ul className="text-indigo-800 dark:text-indigo-200 text-sm space-y-1">
              <li>• Search by user email to track specific user activities</li>
              <li>• Use service names like "bedrock_agent" or "lambda_function"</li>
              <li>• Search for status codes like "200", "404", or "500"</li>
              <li>• Look for specific error messages or keywords</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Pagination and Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5 text-green-600" />
            Pagination and Navigation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Navigate through large volumes of log data efficiently:
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Adjustable items per page (10, 25, 50, 100)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Page navigation with Previous/Next buttons</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Current page indicator and total entries count</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Jump to specific page numbers</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Common Log Analysis Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-orange-600" />
            Common Log Analysis Tasks
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Here are common scenarios and how to handle them:
          </p>

          <div className="space-y-4">
            <div className="p-4 bg-orange-50 dark:bg-orange-950/50 rounded-lg border border-orange-200 dark:border-orange-800">
              <h4 className="font-medium text-orange-900 dark:text-orange-100 mb-2">Troubleshooting System Issues</h4>
              <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
                <li>1. Switch to "Error Logs" tab to see only critical issues</li>
                <li>2. Sort by timestamp to see the most recent errors first</li>
                <li>3. Look for patterns in error messages or service names</li>
                <li>4. Check if errors correlate with specific users or time periods</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-950/50 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">Monitoring User Activity</h4>
              <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                <li>1. Search for specific user email addresses</li>
                <li>2. Review INFO level logs for successful operations</li>
                <li>3. Track user login patterns and system usage</li>
                <li>4. Monitor for unusual user behavior or access patterns</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Refresh and Real-time Updates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-blue-600" />
            Refresh and Updates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Keep your log data current and monitor system activity in real-time:
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-blue-600" />
              <span className="text-sm">Use the refresh button to get the latest log entries</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <span className="text-sm">Monitor error counts in dashboard overview charts</span>
            </div>
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-600" />
              <span className="text-sm">Check loading states and error messages for data availability</span>
            </div>
          </div>

          <Separator />

          <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Best Practices</h4>
            <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
              <li>• Regularly review error logs to identify recurring issues</li>
              <li>• Set up monitoring alerts for critical error thresholds</li>
              <li>• Use log analysis to optimize system performance</li>
              <li>• Document common issues and their resolutions</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <Terminal className="h-5 w-5 text-gray-600" />
              <span className="text-sm">Set up automated log monitoring and alerting</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <Filter className="h-5 w-5 text-indigo-600" />
              <span className="text-sm">Create custom log filtering and search queries</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-sm">Establish error response and resolution procedures</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemLogsGuide;
