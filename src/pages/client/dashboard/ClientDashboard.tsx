
import { useHeader } from '@/contexts/HeaderContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAutomationTasks } from '@/hooks/useAutomationTasks';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, BarChart3 } from 'lucide-react';
import { useEffect } from 'react';
import DailyTask from '@/components/common/DailyTask';
import { AnalysisDataTable } from '@/components/automation';

const ClientDashboard = () => {
  const { setHeaderInfo } = useHeader();
  const { user } = useAuth();
  const { tasks: automationTasks } = useAutomationTasks(user?.id || '');

  useEffect(() => {
    setHeaderInfo({
      title: 'Dashboard',
      description: 'Your personal financial overview and task management',
      badge: (
        <Badge variant="outline" className="text-xs">
          <Home className="size-3 mr-1" />
          Client Dashboard
        </Badge>
      )
    });

    return () => setHeaderInfo(null);
  }, [setHeaderInfo]);

  return (
    <div className="space-y-6 p-6">
      {/* Daily Task Section - Top */}
      <DailyTask />

      {/* AI Analysis Results Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            My Analysis Results
          </CardTitle>
          <CardDescription>
            Recent results from your personal AI analysis tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnalysisDataTable tasks={automationTasks} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDashboard;