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
  Clock, 
  CheckCircle, 
  XCircle,
  BarChart3,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { AutomationTaskCard, CreateTaskDialog, TaskResultsDialog, AnalysisResultsTable, ExecuteTaskDialog } from '@/components/automation';
import type { AutomationTask, CreateAutomationTaskRequest } from '@/types/automation';

const AdminAutomationTasks = () => {
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
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedTask, setSelectedTask] = useState<AutomationTask | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showExecuteDialog, setShowExecuteDialog] = useState(false);
  const [taskToExecute, setTaskToExecute] = useState<AutomationTask | null>(null);

  // Set header information
  useEffect(() => {
    setHeaderInfo({
      title: 'AI Analysis Tasks',
      description: 'Create and manage AI-powered analysis for trading, customers, and market intelligence',
      badge: (
        <Badge variant="outline" className="text-xs">
          <Zap className="size-3 mr-1" />
          AI-Powered Analysis
        </Badge>
      ),
      extra: (
        <Badge variant="secondary" className="text-xs">
          <Activity className="size-3 mr-1" />
          {tasks.filter(t => t.status === 'active').length} Active Analysis
        </Badge>
      )
    });

    return () => setHeaderInfo(null);
  }, [setHeaderInfo, tasks]);

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter(task => {
    const title = task.title || '';
    const instruction = task.instruction || '';
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         instruction.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (task.status || 'inactive') === statusFilter;
    const matchesCategory = categoryFilter === 'all' || (task.category || 'custom') === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Handle task creation
  const handleCreateTask = async (request: CreateAutomationTaskRequest) => {
    const newTask = await createTask(request);
    if (newTask) {
      // Show success feedback
      console.log('Task created successfully:', newTask);
    }
  };

  // Handle task editing
  const handleEditTask = (task: AutomationTask) => {
    // For now, just log - implement edit dialog later
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
      userRole: "Admin", // Since this is the admin page
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

  // Handle quick execute with custom input
  const handleQuickExecute = (task: AutomationTask) => {
    setTaskToExecute(task);
    setShowExecuteDialog(true);
  };

  // Wrapper for ExecuteTaskDialog to handle parameter mapping
  const handleDialogExecute = async (params: {
    taskId: string;
    instruction: string;
    userId: string;
    userRole: 'User' | 'Admin';
    coCodeLd?: string;
  }) => {
    return await executeTaskImmediately(params);
  };

  // Handle status toggle
  const handleToggleStatus = async (taskId: string, newStatus: 'active' | 'inactive') => {
    if (newStatus === 'active') {
      await activateTask(taskId);
    } else {
      await deactivateTask(taskId);
    }
  };

  // Show task results
  const handleShowResults = (task: AutomationTask) => {
    setSelectedTask(task);
    setShowResults(true);
  };

  // Calculate statistics
  const stats = {
    total: tasks.length,
    active: tasks.filter(t => t.status === 'active').length,
    completed: tasks.reduce((sum, t) => sum + (t.results?.filter(r => r.status === 'success').length || 0), 0),
    errors: tasks.reduce((sum, t) => sum + (t.results?.filter(r => r.status === 'error').length || 0), 0),
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading automation tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.active} active, {stats.total - stats.active} inactive
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              Currently running automation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful Runs</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">
              Total successful executions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Runs</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.errors}</div>
            <p className="text-xs text-muted-foreground">
              Total failed executions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actions and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-1 gap-2 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
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
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="running">Running</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="data-analysis">Trading Analysis</SelectItem>
              <SelectItem value="reporting">Customer Analytics</SelectItem>
              <SelectItem value="maintenance">Risk Analysis</SelectItem>
              <SelectItem value="notification">Market Intelligence</SelectItem>
              <SelectItem value="custom">Custom Analysis</SelectItem>
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

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
              <XCircle className="h-4 w-4" />
              <span>Error: {error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tasks Grid */}
      <Tabs defaultValue="grid" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="results">Analysis Results</TabsTrigger>
        </TabsList>

        <TabsContent value="grid">
          {filteredTasks.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Zap className="h-12 w-12 text-muted-foreground mb-4" />
                <CardTitle className="text-xl mb-2">No Automation Tasks</CardTitle>
                <CardDescription className="text-center mb-4">
                  {tasks.length === 0 
                    ? "Create your first automation task to get started with AI-powered automation."
                    : "No tasks match your current filters. Try adjusting your search criteria."
                  }
                </CardDescription>
                <CreateTaskDialog onCreateTask={handleCreateTask} />
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
                  onQuickExecute={handleQuickExecute}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="list">
          <div className="space-y-2">
            {filteredTasks.map((task) => (
              <Card key={task.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{task.title || 'Untitled Task'}</h3>
                        <Badge 
                          variant={(task.status || 'inactive') === 'active' ? 'default' : 'secondary'} 
                          className="text-xs"
                        >
                          {task.status || 'inactive'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {(task.category || 'custom').replace('-', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {task.instruction || 'No instruction provided'}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {(task.triggerType || 'time') === 'time' ? 'Scheduled' : 'Event-based'}
                        </span>
                        {task.lastExecuted && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Last: {new Date(task.lastExecuted).toLocaleDateString()}
                          </span>
                        )}
                        {task.results && task.results.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-xs"
                            onClick={() => handleShowResults(task)}
                          >
                            <BarChart3 className="h-3 w-3 mr-1" />
                            {task.results.length} results
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExecuteTask(task.id || '')}
                        disabled={(task.status || 'inactive') !== 'active'}
                      >
                        Run
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleQuickExecute(task)}
                        disabled={!task.id}
                        className="text-xs"
                      >
                        Quick Execute
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditTask(task)}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Recent Analysis Results
              </CardTitle>
              <CardDescription>
                View the latest results from your AI analysis tasks
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

      {/* Task Results Dialog */}
      {selectedTask && (
        <TaskResultsDialog
          open={showResults}
          onOpenChange={setShowResults}
          taskTitle={selectedTask?.title || 'Unknown Task'}
          results={selectedTask?.results || []}
        />
      )}

      {/* Execute Task Dialog */}
      <ExecuteTaskDialog
        task={taskToExecute}
        open={showExecuteDialog}
        onOpenChange={setShowExecuteDialog}
        onExecute={handleDialogExecute}
      />
    </div>
  );
};

export default AdminAutomationTasks;
