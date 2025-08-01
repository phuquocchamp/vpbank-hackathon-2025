import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useHeader } from '@/contexts/HeaderContext';
import { 
  BarChart3, 
  Home, 
  Target,
  Bell,
  CheckCircle,
  Calendar,
  Clock,
  TrendingUp,
  Activity,
  ArrowRight,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

const DashboardOverviewGuide = () => {
  const { setHeaderInfo } = useHeader();

  useEffect(() => {
    setHeaderInfo({
      title: 'Client Dashboard Guide',
      description: 'Navigate your personal banking dashboard effectively',
      badge: (
        <Badge variant="outline" className="text-xs">
          <Home className="size-3 mr-1" />
          Dashboard Guide
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
            <Home className="h-6 w-6 text-blue-600" />
            Your Personal Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Your client dashboard is your central hub for managing tasks, tracking progress, 
            and staying updated with your banking activities. This guide will help you understand 
            each section and make the most of your dashboard experience.
          </p>
          
          <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-900 dark:text-blue-100">Dashboard Access</span>
            </div>
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              Your dashboard is the first page you see after logging in, or you can access it 
              anytime by clicking "Dashboard" in the sidebar navigation.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Daily Tasks Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Daily Tasks Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The Daily Tasks section helps you stay on top of important activities and goals:
          </p>

          <div className="grid gap-4">
            {/* Progress Tracking */}
            <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/50 rounded-lg border border-green-200 dark:border-green-800">
              <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
                <Target className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-green-900 dark:text-green-100">Task Progress Tracking</h4>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Visual progress bars show your completion status for daily goals and objectives. 
                  Green indicates completed tasks, while orange shows tasks in progress.
                </p>
              </div>
            </div>

            {/* Smart Monitoring */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Smart Monitoring</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Real-time task progress tracking keeps you informed about your daily activities 
                  and helps you maintain productivity throughout the day.
                </p>
              </div>
            </div>

            {/* Notifications */}
            <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-950/50 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
                <Bell className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-purple-900 dark:text-purple-100">Smart Notifications</h4>
                <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                  Personalized alerts and reminders help you stay on track with important tasks 
                  and deadlines throughout your banking activities.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-950/50 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-900 dark:text-green-100">Daily Goals</span>
            </div>
            <ul className="text-green-800 dark:text-green-200 text-sm space-y-1">
              <li>• Complete pending financial tasks and reviews</li>
              <li>• Check account updates and notifications</li>
              <li>• Review recent transactions and activities</li>
              <li>• Update personal preferences and settings</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Task Tracking System */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-indigo-600" />
            Advanced Task Tracking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The task tracking system provides detailed insights into your activity patterns and performance:
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <ArrowRight className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-medium">Database Activity Monitoring</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Track your data queries and analysis activities with detailed step-by-step breakdowns, 
                  including execution times and success rates.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ArrowRight className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-medium">Memory Usage Tracking</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Monitor system resource usage for your activities, helping you understand 
                  the performance impact of different operations.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ArrowRight className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-medium">Step-by-Step Process Tracking</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Each task is broken down into individual steps with status indicators 
                  (SUCCESS, PENDING, WAITING, ERROR) for clear progress visibility.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-950/50 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
            <h4 className="font-medium text-indigo-900 dark:text-indigo-100 mb-2">Status Indicators</h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-indigo-700 dark:text-indigo-300">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>SUCCESS - Completed successfully</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>PENDING - Currently processing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>WAITING - Queued for execution</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>ERROR - Failed or requires attention</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation and Organization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-orange-600" />
            Task Organization and Pagination
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Keep your tasks organized and easily navigate through your activity history:
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Adjustable items per page (5, 10, 25, 50 tasks)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Easy navigation with Previous/Next page buttons</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Current page indicator and total task count</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Chronological sorting with newest tasks first</span>
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-950/50 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              <span className="font-medium text-orange-900 dark:text-orange-100">Time Management</span>
            </div>
            <p className="text-orange-800 dark:text-orange-200 text-sm">
              Tasks are timestamped with precise creation times, helping you track when activities 
              occurred and understand your work patterns throughout the day.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            Performance Insights and Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Your dashboard provides valuable insights into your activity patterns and performance:
          </p>

          <div className="grid gap-4">
            <div className="p-4 bg-purple-50 dark:bg-purple-950/50 rounded-lg border border-purple-200 dark:border-purple-800">
              <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">Activity Duration Analysis</h4>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Track how long different types of tasks take to complete, helping you plan 
                your time more effectively and identify optimization opportunities.
              </p>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">SQL Query Performance</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Monitor the performance of your database queries, including execution time 
                and resource usage, to understand data access patterns.
              </p>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-950/50 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">Success Rate Tracking</h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                View completion rates and identify areas where tasks frequently encounter issues, 
                helping you improve your workflow efficiency.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Refresh and Updates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-blue-600" />
            Keeping Your Dashboard Current
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Ensure your dashboard displays the most current information:
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-blue-600" />
              <span className="text-sm">Automatic updates when new tasks are created</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-600" />
              <span className="text-sm">Real-time status updates for in-progress tasks</span>
            </div>
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-purple-600" />
              <span className="text-sm">Notification badges for new activities</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              <span className="text-sm">Progress indicators update as tasks complete</span>
            </div>
          </div>

          <Separator />

          <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Dashboard Best Practices</h4>
            <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
              <li>• Check your dashboard daily for updates and new tasks</li>
              <li>• Use task tracking to identify patterns in your work</li>
              <li>• Monitor completion rates to optimize your workflow</li>
              <li>• Review performance metrics for continuous improvement</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            Troubleshooting Dashboard Issues
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Common solutions for dashboard-related issues:
          </p>

          <div className="space-y-4">
            <div className="p-4 bg-red-50 dark:bg-red-950/50 rounded-lg border border-red-200 dark:border-red-800">
              <h4 className="font-medium text-red-900 dark:text-red-100 mb-2">Loading Issues</h4>
              <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                <li>• Refresh the page if tasks don't appear to load</li>
                <li>• Check your internet connection for real-time updates</li>
                <li>• Clear browser cache if data appears outdated</li>
              </ul>
            </div>

            <div className="p-4 bg-orange-50 dark:bg-orange-950/50 rounded-lg border border-orange-200 dark:border-orange-800">
              <h4 className="font-medium text-orange-900 dark:text-orange-100 mb-2">Performance Issues</h4>
              <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
                <li>• Reduce items per page if the dashboard loads slowly</li>
                <li>• Check if browser extensions are affecting performance</li>
                <li>• Use pagination to navigate through large task lists</li>
              </ul>
            </div>
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
              <Target className="h-5 w-5 text-green-600" />
              <span className="text-sm">Set up your daily task goals and preferences</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <BarChart3 className="h-5 w-5 text-indigo-600" />
              <span className="text-sm">Explore task tracking to understand your work patterns</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <Bell className="h-5 w-5 text-purple-600" />
              <span className="text-sm">Configure notification preferences for important updates</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverviewGuide;
