
import { useHeader } from '@/contexts/HeaderContext';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Home } from 'lucide-react';
import { useEffect } from 'react';
import TaskTracking from '@/components/common/TaskTracking';
import SystemLogs from '@/components/client/SystemLogs';

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
      {/* Task Tracking Section */}
      <TaskTracking userId={user?.id} />

      {/* System Logs Section */}
      <SystemLogs userId={user?.id || ''} />
    </div>
  );
};

export default ClientDashboard;