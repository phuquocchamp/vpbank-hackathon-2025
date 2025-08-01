import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useHeader } from '@/contexts/HeaderContext';
import { 
  BarChart3, 
  Activity, 
  DollarSign, 
  FileText, 
  Shield, 
  ArrowRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const DashboardNavigationGuide = () => {
  const { setHeaderInfo } = useHeader();

  useEffect(() => {
    setHeaderInfo({
      title: 'Admin Dashboard Guide',
      description: 'Learn how to navigate and interpret your admin dashboard',
      badge: (
        <Badge variant="outline" className="text-xs">
          <BarChart3 className="size-3 mr-1" />
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
            <BarChart3 className="h-6 w-6 text-blue-600" />
            Admin Dashboard Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The Admin Dashboard provides a comprehensive overview of your system's health, performance metrics, 
            and key operational insights. This guide will help you understand each section and how to interpret the data.
          </p>
          
          <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-900 dark:text-blue-100">Quick Access Tip</span>
            </div>
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              Navigate to the dashboard by clicking on "Dashboard" in the main navigation sidebar, 
              or use the VPBank Admin logo to return to the dashboard from any page.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Overview Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-600" />
            Quick Overview Cards
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The top section displays three key metric cards that provide instant system health insights:
          </p>

          <div className="grid gap-4">
            {/* System Status Card */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg border">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">System Status</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Shows "Healthy" when no errors are detected, or "Issues Detected" when errors exist. 
                  Displays total monitored events and critical error count with badges.
                </p>
              </div>
            </div>

            {/* Total Billing Card */}
            <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/50 rounded-lg border">
              <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-green-900 dark:text-green-100">Total Billing</h4>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Displays cumulative usage cost in dollars and shows the number of billing entries tracked.
                </p>
              </div>
            </div>

            {/* Reports Available Card */}
            <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-950/50 rounded-lg border">
              <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-purple-900 dark:text-purple-100">Reports Available</h4>
                <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                  Shows available report types: Billing, Tasks & Logs. Links to the System Reports section.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Analytics Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-indigo-600" />
            System Analytics Charts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The analytics section provides real-time visual insights into your system's performance:
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <ArrowRight className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-medium">Log Overview Chart</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Pie chart displaying error vs info log distribution, with statistics showing critical errors, 
                  info messages, total logs, error rate percentage, and system health status indicator.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ArrowRight className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-medium">Activity Timeline Chart</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Line chart showing system activity over time, helping you identify patterns, 
                  peak usage periods, and potential issues.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/50 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <span className="font-medium text-amber-900 dark:text-amber-100">Chart Interpretation</span>
            </div>
            <p className="text-amber-800 dark:text-amber-200 text-sm">
              Red indicators typically show errors or issues requiring attention, while blue/green 
              indicators represent normal operations and successful activities.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Billing Trends Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Billing Trends Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The billing section helps you monitor usage costs and financial trends:
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Track daily, weekly, and monthly usage costs</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Identify cost trends and usage patterns</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Monitor billing entries and financial analytics</span>
            </div>
          </div>

          <Separator />

          <div className="bg-green-50 dark:bg-green-950/50 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">Cost Management Tips</h4>
            <ul className="space-y-1 text-sm text-green-700 dark:text-green-300">
              <li>• Use the refresh function to get the latest billing data</li>
              <li>• Monitor for unusual spikes in usage costs</li>
              <li>• Review billing trends to optimize resource allocation</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Header Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Header Information & Badges
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The dashboard header provides contextual information and system status:
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5">Live Dashboard</Badge>
              <div>
                <p className="text-sm font-medium">Real-time Updates Badge</p>
                <p className="text-xs text-muted-foreground">Indicates that the dashboard shows live, real-time data</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="destructive" className="mt-0.5">X Critical Errors</Badge>
              <div>
                <p className="text-sm font-medium">Alert Badge (when errors exist)</p>
                <p className="text-xs text-muted-foreground">Shows the number of critical errors requiring immediate attention</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Badge variant="secondary" className="mt-0.5">System Healthy</Badge>
              <div>
                <p className="text-sm font-medium">Health Badge (when no errors)</p>
                <p className="text-xs text-muted-foreground">Confirms that all systems are operating normally</p>
              </div>
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
              <FileText className="h-5 w-5 text-purple-600" />
              <span className="text-sm">Explore System Reports for detailed logs and analytics</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <Activity className="h-5 w-5 text-blue-600" />
              <span className="text-sm">Set up monitoring alerts for critical system events</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="text-sm">Configure billing thresholds and cost monitoring</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardNavigationGuide;
