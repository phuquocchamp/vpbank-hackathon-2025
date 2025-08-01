import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TrendingUp, RefreshCw, AlertCircle, Calendar, Filter } from 'lucide-react';
import { useState } from 'react';

interface BillingEntry {
  date: string;
  cost: number;
}

interface BillingChartProps {
  billingData: BillingEntry[] | null;
  isLoadingBilling: boolean;
  billingError: string | null;
  onRefresh: (startDate?: string, endDate?: string) => void;
}

const BillingChart = ({ billingData, isLoadingBilling, billingError, onRefresh }: BillingChartProps) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

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

  const handleRefresh = () => {
    onRefresh(startDate || undefined, endDate || undefined);
  };

  const handleFilterApply = () => {
    if (startDate && endDate && startDate > endDate) {
      alert('Start date must be before end date');
      return;
    }
    onRefresh(startDate || undefined, endDate || undefined);
  };

  const handleClearFilters = () => {
    setStartDate('');
    setEndDate('');
    onRefresh();
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
            onClick={handleRefresh}
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
        
        {/* Date Filter Controls */}
        <div className="flex items-end gap-4 mt-4 p-4 bg-muted/30 rounded-lg border-l-4 border-l-blue-500">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by Date Range:</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Label htmlFor="start-date" className="text-xs text-gray-600 dark:text-gray-400">From:</Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-36 text-xs"
              placeholder="Start date"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Label htmlFor="end-date" className="text-xs text-gray-600 dark:text-gray-400">To:</Label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-36 text-xs"
              placeholder="End date"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleFilterApply}
              disabled={isLoadingBilling}
              variant="default"
              size="sm"
              className="text-xs"
            >
              <Filter className="h-3 w-3 mr-1" />
              Apply Filter
            </Button>
            
            <Button
              onClick={handleClearFilters}
              disabled={isLoadingBilling}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {billingError ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
              <p className="text-red-600 font-medium">Error loading billing data</p>
              <p className="text-gray-500 text-sm">{billingError}</p>
              <Button onClick={handleRefresh} variant="outline" size="sm" className="mt-2">
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
