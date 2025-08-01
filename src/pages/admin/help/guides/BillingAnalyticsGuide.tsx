import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useHeader } from '@/contexts/HeaderContext';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar,
  BarChart3,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  FileText,
  Download
} from 'lucide-react';

const BillingAnalyticsGuide = () => {
  const { setHeaderInfo } = useHeader();

  useEffect(() => {
    setHeaderInfo({
      title: 'Billing Analytics Guide',
      description: 'Monitor usage costs and analyze financial trends',
      badge: (
        <Badge variant="outline" className="text-xs">
          <DollarSign className="size-3 mr-1" />
          Billing Guide
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
            <DollarSign className="h-6 w-6 text-green-600" />
            Billing Analytics Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The billing analytics system helps you monitor usage costs, track spending trends, 
            and optimize resource allocation. This guide covers how to interpret billing data, 
            analyze cost patterns, and manage your system's financial performance.
          </p>
          
          <div className="bg-green-50 dark:bg-green-950/50 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-900 dark:text-green-100">Access Billing Data</span>
            </div>
            <p className="text-green-800 dark:text-green-200 text-sm">
              View billing analytics in the Admin Dashboard or navigate to System Reports 
              for detailed financial analysis and cost breakdowns.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Billing Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Dashboard Billing Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The Admin Dashboard provides a quick overview of your current billing status:
          </p>

          <div className="grid gap-4">
            {/* Total Billing Card */}
            <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/50 rounded-lg border border-green-200 dark:border-green-800">
              <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-green-900 dark:text-green-100">Total Billing Card</h4>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Displays the cumulative usage cost in dollars with a clear dollar amount. 
                  Also shows the total number of billing entries tracked in the system.
                </p>
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs border-green-300 text-green-700">
                    Real-time Updates
                  </Badge>
                </div>
              </div>
            </div>

            {/* Billing Trends Chart */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Billing Trends Chart</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Interactive line chart showing cost trends over time, helping you identify 
                  spending patterns, peak usage periods, and cost optimization opportunities.
                </p>
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">
                    Financial Analytics
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-900 dark:text-blue-100">Chart Features</span>
            </div>
            <ul className="text-blue-800 dark:text-blue-200 text-sm space-y-1">
              <li>• Hover over data points to see exact cost amounts and dates</li>
              <li>• Identify trends with clear visual indicators</li>
              <li>• Zoom and pan to focus on specific time periods</li>
              <li>• Compare costs across different date ranges</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Understanding Billing Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-600" />
            Understanding Billing Data Structure
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Each billing entry contains specific information to help you understand your costs:
          </p>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border">
            <div className="grid gap-3 text-sm">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-purple-600" />
                <span className="font-medium">Date:</span>
                <span className="text-muted-foreground">Specific date when the cost was incurred</span>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="h-4 w-4 text-purple-600" />
                <span className="font-medium">Cost:</span>
                <span className="text-muted-foreground">Exact dollar amount for that date's usage</span>
              </div>
              <div className="flex items-center gap-3">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                <span className="font-medium">Cumulative Total:</span>
                <span className="text-muted-foreground">Running total of all costs up to that date</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <ArrowRight className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-medium">Daily Cost Tracking</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Costs are tracked on a daily basis, allowing you to see exactly when 
                  usage spikes occur and identify patterns in your system usage.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ArrowRight className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-medium">Cost Aggregation</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  The system automatically calculates totals and trends, making it easy 
                  to understand your overall spending without manual calculations.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cost Analysis and Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-600" />
            Cost Analysis and Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Use billing analytics to gain insights into your system's financial performance:
          </p>

          <div className="space-y-4">
            <div className="p-4 bg-orange-50 dark:bg-orange-950/50 rounded-lg border border-orange-200 dark:border-orange-800">
              <h4 className="font-medium text-orange-900 dark:text-orange-100 mb-2">Trend Analysis</h4>
              <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
                <li>• Identify increasing or decreasing cost patterns over time</li>
                <li>• Spot unusual cost spikes that may indicate issues or increased usage</li>
                <li>• Compare current costs with historical data for budgeting</li>
                <li>• Predict future costs based on current trends</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-950/50 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">Cost Optimization</h4>
              <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                <li>• Monitor for cost efficiency improvements over time</li>
                <li>• Identify peak usage periods for resource planning</li>
                <li>• Track the impact of system optimizations on costs</li>
                <li>• Set up alerts for unusual spending patterns</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Financial Planning</h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Use historical data for accurate budget forecasting</li>
                <li>• Monitor cost per transaction or user for efficiency metrics</li>
                <li>• Track ROI on system investments and improvements</li>
                <li>• Generate reports for financial stakeholders</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Refresh and Updates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-blue-600" />
            Data Refresh and Real-time Updates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Keep your billing data current and monitor costs in real-time:
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-blue-600" />
              <span className="text-sm">Use refresh buttons to get the latest billing data</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Charts automatically update when new data is available</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <span className="text-sm">Monitor loading states to ensure data accuracy</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-sm">Dashboard totals reflect the most recent billing entries</span>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <RefreshCw className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-900 dark:text-blue-100">Update Frequency</span>
            </div>
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              Billing data is typically updated daily, but you can manually refresh at any time 
              to ensure you have the most current information for decision-making.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Error Handling and Troubleshooting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            Error Handling and Troubleshooting
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Handle common issues with billing data access and display:
          </p>

          <div className="space-y-4">
            <div className="p-4 bg-red-50 dark:bg-red-950/50 rounded-lg border border-red-200 dark:border-red-800">
              <h4 className="font-medium text-red-900 dark:text-red-100 mb-2">Common Issues</h4>
              <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                <li>• No billing data available: Check if billing tracking is enabled</li>
                <li>• Loading errors: Verify network connection and authentication</li>
                <li>• Incomplete data: Refresh to ensure all entries are loaded</li>
                <li>• Chart display issues: Try clearing browser cache and refreshing</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-950/50 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">Fallback Data</h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                When live billing data is unavailable, the system may display sample data 
                for demonstration purposes. Always verify data freshness using refresh controls.
              </p>
            </div>
          </div>

          <Separator />

          <div className="bg-amber-50 dark:bg-amber-950/50 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
            <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-2">Data Accuracy Tips</h4>
            <ul className="space-y-1 text-sm text-amber-700 dark:text-amber-300">
              <li>• Always refresh data before making financial decisions</li>
              <li>• Verify totals manually if you notice discrepancies</li>
              <li>• Check for authentication expiration if data fails to load</li>
              <li>• Contact support if persistent issues occur with billing data</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Export and Reporting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-indigo-600" />
            Export and Reporting
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Generate reports and export billing data for external analysis:
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4 text-indigo-600" />
              <span className="text-sm">Export chart data as images for presentations</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-purple-600" />
              <span className="text-sm">Generate summary reports for stakeholders</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-600" />
              <span className="text-sm">Create custom date range analyses</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm">Extract trend data for forecasting models</span>
            </div>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-950/50 p-4 rounded-lg border border-indigo-200 dark:border-indigo-800">
            <h4 className="font-medium text-indigo-900 dark:text-indigo-100 mb-2">Reporting Best Practices</h4>
            <ul className="space-y-1 text-sm text-indigo-700 dark:text-indigo-300">
              <li>• Include data refresh timestamps in reports</li>
              <li>• Provide context for unusual cost patterns</li>
              <li>• Compare periods consistently for accurate analysis</li>
              <li>• Document methodology for cost calculations</li>
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
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="text-sm">Set up cost monitoring alerts and thresholds</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <span className="text-sm">Create regular billing analysis and reporting schedule</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span className="text-sm">Integrate billing data into overall system monitoring</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingAnalyticsGuide;
