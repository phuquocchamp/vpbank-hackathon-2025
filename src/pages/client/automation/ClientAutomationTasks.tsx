import { useState, useEffect } from 'react';
import { useHeader } from '@/contexts/HeaderContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAutomationTasks } from '@/hooks/useAutomationTasks';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  Search, 
  Filter, 
  Activity, 
  CheckCircle, 
  RefreshCw,
  Lightbulb,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { AutomationTaskCard, CreateTaskDialog, AnalysisResultsTable } from '@/components/automation';
import type { AutomationTask, CreateAutomationTaskRequest } from '@/types/automation';

const ClientAutomationTasks = () => {
  const { setHeaderInfo } = useHeader();
  const { user } = useAuth();
  const { 
    tasks, 
    analysisTasks,
    isLoading, 
    error, 
    createTask, 
    // updateTask, 
    deleteTask,
    activateTask,
    deactivateTask,
    executeTaskImmediately, 
    fetchTasks,
    getS3FileContent
  } = useAutomationTasks(user?.id || '');

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Set header information
  useEffect(() => {
    setHeaderInfo({
      title: 'AI Analysis Tasks',
      description: 'Create personal AI analysis for trading insights and market intelligence',
      badge: (
        <Badge variant="outline" className="text-xs">
          <Zap className="size-3 mr-1" />
          AI Assistant
        </Badge>
      ),
      extra: (
        <Badge variant="secondary" className="text-xs">
          <Activity className="size-3 mr-1" />
          {tasks.filter(t => t.status === 'active').length} Active
        </Badge>
      )
    });

    return () => setHeaderInfo(null);
  }, [setHeaderInfo, tasks]);

  // Filter tasks based on search and status
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = (task.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (task.instruction || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Handle task creation
  const handleCreateTask = async (request: CreateAutomationTaskRequest) => {
    const newTask = await createTask(request);
    if (newTask) {
      console.log('Task created successfully:', newTask);
    }
  };

  // Handle task editing
  const handleEditTask = (task: AutomationTask) => {
    console.log('Edit task:', task);
  };

  // Handle task deletion
  const handleDeleteTask = async (taskId: string) => {
    if (confirm('Are you sure you want to delete this automation task?')) {
      await deleteTask(taskId);
    }
  };

  // Handle task execution
  const handleExecuteTask = async (taskId: string) => {
    if (!user?.id) {
      console.error('User not authenticated');
      return;
    }

    // Find the task to get its instruction
    const task = tasks.find(t => t.id === taskId);
    const instruction = task?.instruction || "Execute scheduled task immediately";

    const result = await executeTaskImmediately({
      taskId,
      instruction, // Use the task's instruction instead of generic text
      userId: user.id,
      userRole: "User", // Since this is the client page
      coCodeLd: "" // Empty as specified in requirements
    });

    if (result?.success) {
      console.log('Task executed successfully:', result);
      // Optionally show results or refresh tasks
      await fetchTasks();
    } else {
      console.error('Task execution failed:', result?.message);
    }
  };

  // Handle status toggle
  const handleToggleStatus = async (taskId: string, newStatus: 'active' | 'inactive') => {
    if (newStatus === 'active') {
      await activateTask(taskId);
    } else {
      await deactivateTask(taskId);
    }
  };

  // Calculate user statistics
  const stats = {
    total: tasks.length,
    active: tasks.filter(t => t.status === 'active').length,
    completed: tasks.reduce((sum, t) => sum + (t.results?.filter(r => r.status === 'success').length || 0), 0),
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading your automation tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section for New Users */}
      {tasks.length === 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <Lightbulb className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Welcome to AI Analysis!
                </h3>
                <p className="text-blue-700 dark:text-blue-300 mb-4">
                  Create intelligent analysis tasks powered by AI to get insights about your trading performance, 
                  customer behavior, and market opportunities. Ask questions like "show me today's top trades" 
                  or "identify customers at risk of churning".
                </p>
                <div className="flex gap-2">
                  <CreateTaskDialog onCreateTask={handleCreateTask} />
                  <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overview Cards */}
      {tasks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Tasks</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.active} currently active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Now</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <p className="text-xs text-muted-foreground">
                Running automatically
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
              <p className="text-xs text-muted-foreground">
                Successful executions
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Actions and Filters */}
      {tasks.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-1 gap-2 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search your tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchTasks}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <CreateTaskDialog onCreateTask={handleCreateTask} />
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
              <span>Error: {error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tasks Grid */}
      {tasks.length > 0 && (
        <Tabs defaultValue="tasks" className="space-y-4">
          <TabsList>
            <TabsTrigger value="tasks">My Tasks</TabsTrigger>
            <TabsTrigger value="results">Analysis Results</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks">
            {filteredTasks.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mb-4" />
                  <CardTitle className="text-xl mb-2">No Tasks Found</CardTitle>
                  <CardDescription className="text-center mb-4">
                    No tasks match your current search criteria. Try adjusting your filters.
                  </CardDescription>
                  <Button variant="outline" onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}>
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTasks.map((task) => (
                  <AutomationTaskCard
                    key={task.id}
                    task={task}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    onExecute={handleExecuteTask}
                    onToggleStatus={handleToggleStatus}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="results">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  My Analysis Results
                </CardTitle>
                <CardDescription>
                  View results from your personal AI analysis tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnalysisResultsTable 
                  analysisTasks={analysisTasks} 
                  onGetS3Content={getS3FileContent}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Quick Tips for Users */}
      {tasks.length > 0 && tasks.length < 3 && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <h4 className="font-medium text-green-900 dark:text-green-100">
                  💡 Tip: Maximize Your Automation
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Try creating tasks for different categories like daily reports, weekly summaries, 
                  or data analysis to get the most out of your AI assistant.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClientAutomationTasks;
