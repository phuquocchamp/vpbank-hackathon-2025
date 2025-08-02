import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Clock, 
  MoreHorizontal, 
  Play, 
  Edit, 
  Trash2, 
  Calendar, 
  Zap,
  CheckCircle,
  XCircle,
  AlertCircle,
  Pause
} from 'lucide-react';
import type { AutomationTask } from '@/types/automation';

interface AutomationTaskCardProps {
  task: AutomationTask;
  onEdit: (task: AutomationTask) => void;
  onDelete: (taskId: string) => void;
  onExecute: (taskId: string) => void;
  onQuickExecute?: (task: AutomationTask) => void;
  onToggleStatus: (taskId: string, status: 'active' | 'inactive') => void;
}

const AutomationTaskCard: React.FC<AutomationTaskCardProps> = ({ 
  task, 
  onEdit, 
  onDelete, 
  onExecute,
  onQuickExecute, 
  onToggleStatus 
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inactive': return <Pause className="h-4 w-4 text-gray-500" />;
      case 'running': return <Zap className="h-4 w-4 text-blue-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300';
      case 'inactive': return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300';
      case 'running': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300';
      case 'error': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300';
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300';
      default: return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'data-analysis': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300';
      case 'reporting': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300';
      case 'maintenance': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300';
      case 'notification': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300';
      case 'custom': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'data-analysis': return 'Trading Analysis';
      case 'reporting': return 'Customer Analytics';
      case 'maintenance': return 'Risk Analysis';
      case 'notification': return 'Market Intelligence';
      case 'custom': return 'Custom Analysis';
      default: return (category || 'custom').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const getTriggerDisplay = () => {
    if (!task.triggerConfig) return 'No trigger configured';
    if (task.triggerType === 'time' && 'schedule' in task.triggerConfig) {
      const schedule = task.triggerConfig.schedule;
      if (schedule) {
        return `${schedule.frequency} at ${schedule.time}`;
      }
    }
    if (task.triggerType === 'time' && 'datetime' in task.triggerConfig) {
      return `Once at ${new Date(task.triggerConfig.datetime!).toLocaleString()}`;
    }
    if (task.triggerType === 'event') {
      return 'Event-based trigger';
    }
    return 'Unknown trigger';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getLastResult = () => {
    if (!task.results || task.results.length === 0) return null;
    return task.results[task.results.length - 1];
  };

  const lastResult = getLastResult();

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg font-semibold">{task.title || 'Untitled Task'}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground line-clamp-2">
              {task.instruction || 'No description provided'}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onExecute(task.id || '')}>
                <Play className="mr-2 h-4 w-4" />
                Execute Now
              </DropdownMenuItem>
              {onQuickExecute && (
                <DropdownMenuItem onClick={() => onQuickExecute(task)}>
                  <Zap className="mr-2 h-4 w-4" />
                  Quick Execute
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onToggleStatus(task.id || '', (task.status || 'inactive') === 'active' ? 'inactive' : 'active')}
              >
                {(task.status || 'inactive') === 'active' ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Activate
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(task.id || '')}
                className="text-red-600 dark:text-red-400"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Status and Category Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={`flex items-center gap-1 ${getStatusColor(task.status || 'inactive')}`}>
            {getStatusIcon(task.status || 'inactive')}
            {(task.status || 'inactive').charAt(0).toUpperCase() + (task.status || 'inactive').slice(1)}
          </Badge>
          <Badge variant="outline" className={getCategoryColor(task.category || 'custom')}>
            {getCategoryLabel(task.category || 'custom')}
          </Badge>
        </div>

        {/* Trigger Information */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{getTriggerDisplay()}</span>
        </div>

        {/* Execution Information */}
        {task.nextExecution && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Next: {formatDate(task.nextExecution)}</span>
          </div>
        )}

        {/* Last Execution Result */}
        {lastResult && (
          <div className="border-t pt-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Last Execution:</span>
              <Badge 
                variant={lastResult.status === 'success' ? 'default' : 'destructive'}
                className="text-xs"
              >
                {lastResult.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatDate(lastResult.executedAt)} • {(lastResult.duration / 1000).toFixed(1)}s
            </p>
            {lastResult.output && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {lastResult.output}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onExecute(task.id || '')}
            disabled={task.status !== 'active'}
          >
            <Play className="h-4 w-4 mr-1" />
            Run Now
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => onEdit(task)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AutomationTaskCard;
