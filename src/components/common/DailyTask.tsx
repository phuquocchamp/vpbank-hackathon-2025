import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar,
  Clock,
  Sparkles,
  Zap,
  Target,
  Timer,
  Settings,
  Bell
} from 'lucide-react';

interface DailyTaskProps {
  className?: string;
}

const DailyTask = ({ className = '' }: DailyTaskProps) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Daily Tasks
            <Badge variant="outline" className="ml-2 text-orange-600 border-orange-600">
              <Sparkles className="size-3 mr-1" />
              Coming Soon
            </Badge>
          </div>
          <Button disabled variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Automated task scheduling and execution system
        </p>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          {/* Main Icon */}
          <div className="relative mb-6">
            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 h-6 w-6 bg-orange-500 rounded-full flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
          </div>

          {/* Title and Description */}
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Daily Task Automation
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            We're building an intelligent task scheduling system that will automate your daily banking operations and financial tasks.
          </p>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Timer className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-left">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">Scheduled Execution</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Set tasks to run automatically</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="h-10 w-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-left">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">Smart Monitoring</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Real-time task progress tracking</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <Bell className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-left">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">Smart Notifications</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Get alerts on task completion</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="h-10 w-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="text-left">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">Time Management</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Optimize your daily workflow</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyTask;