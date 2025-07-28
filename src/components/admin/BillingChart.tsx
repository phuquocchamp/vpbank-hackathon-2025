import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TrendingUp, RefreshCw, AlertCircle } from 'lucide-react';

interface BillingEntry {
  date: string;
  cost: number;
}

interface BillingChartProps {
  billingData: BillingEntry[] | null;
  isLoadingBilling: boolean;
  billingError: string | null;
  onRefresh: () => void;
}

const BillingChart = ({ billingData, isLoadingBilling, billingError, onRefresh }: BillingChartProps) => {
  const chartConfig = {
    cost: { label: "Cost", color: "#3b82f6" },
  };

  const getBillingChartData = () => {
    if (!billingData) return [];
    return billingData.map(entry => ({
      ...entry,
      formattedDate: new Date(entry.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      formattedCost: `$${entry.cost.toFixed(2)}`
    }));
  };

  const getTotalBillingCost = () => {
    if (!billingData) return 0;
    return billingData.reduce((total, entry) => total + entry.cost, 0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Billing Trends
          <Badge variant="secondary" className="ml-2">
            Total: ${getTotalBillingCost().toFixed(2)}
          </Badge>
          <Button
            onClick={onRefresh}
            disabled={isLoadingBilling}
            variant="outline"
            size="sm"
            className="ml-auto"
          >
            {isLoadingBilling ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Daily billing costs over time • Total: ${getTotalBillingCost().toFixed(2)}
        </p>
      </CardHeader>
      <CardContent>
        {billingError ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
              <p className="text-red-600 font-medium">Error loading billing data</p>
              <p className="text-gray-500 text-sm">{billingError}</p>
              <Button onClick={onRefresh} variant="outline" size="sm" className="mt-2">
                Try Again
              </Button>
            </div>
          </div>
        ) : isLoadingBilling ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-500">Loading billing data...</p>
            </div>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-[16/6] w-full max-h-[400px]">
            <BarChart data={getBillingChartData()}>
              <defs>
                <linearGradient id="billingGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.4}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="formattedDate" 
                className="text-xs"
                tick={{ fill: '#6b7280', fontSize: 11 }}
                interval="preserveStartEnd"
                minTickGap={10}
              />
              <YAxis 
                className="text-xs"
                tick={{ fill: '#6b7280', fontSize: 11 }}
                width={40}
                tickFormatter={(value) => `$${value}`}
              />
              <ChartTooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                        <p className="font-semibold text-gray-900 mb-2">{label}</p>
                        <p className="text-sm text-blue-600">
                          Cost: {data.formattedCost}
                        </p>
                        <p className="text-xs text-gray-500">
                          Date: {data.date}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="cost"
                fill="url(#billingGradient)"
                stroke="#3b82f6"
                strokeWidth={1}
                radius={[4, 4, 0, 0]}
                name="Daily Cost"
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default BillingChart;
