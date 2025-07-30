
import { useHeader } from '@/contexts/HeaderContext';
import { Badge } from '@/components/ui/badge';
import { Home } from 'lucide-react';
import { useEffect } from 'react';
import DailyTask from '@/components/common/DailyTask';
import TaskTracking from '@/components/common/TaskTracking';
import { useAuth } from '@/contexts/AuthContext';

const ClientDashboard = () => {
  const { setHeaderInfo } = useHeader();
  const { user } = useAuth();

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
      
      {/* Task Tracking Section - Bottom */}
      <TaskTracking userId={user?.id} className="mt-6" />
    </div>
  );
};

export default ClientDashboard;