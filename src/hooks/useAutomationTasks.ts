import { useState, useEffect } from 'react';
import { automationService } from '@/services/automationService';
import type { AutomationTask, CreateAutomationTaskRequest, UpdateAutomationTaskRequest, TaskResult, AnalysisTask } from '@/types/automation';

export const useAutomationTasks = (userId: string) => {
  const [tasks, setTasks] = useState<AutomationTask[]>([]);
  const [analysisTasks, setAnalysisTasks] = useState<AnalysisTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const data = await automationService.getAutomationTasks(userId);
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch automation tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnalysisTasks = async () => {
    if (!userId) return;
    
    setError(null);
    try {
      const data = await automationService.getAnalysisTasks(userId);
      setAnalysisTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analysis tasks');
    }
  };

  const getS3FileContent = async (filePath: string): Promise<string> => {
    try {
      setError(null);
      return await automationService.getS3FileContent(filePath);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch S3 file content');
      return '';
    }
  };

  const createTask = async (request: CreateAutomationTaskRequest): Promise<AutomationTask | null> => {
    try {
      setError(null);
      const newTask = await automationService.createAutomationTask(request);
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create automation task');
      return null;
    }
  };

  const updateTask = async (id: string, request: UpdateAutomationTaskRequest): Promise<boolean> => {
    try {
      setError(null);
      const updatedTask = await automationService.updateAutomationTask(id, request);
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update automation task');
      return false;
    }
  };

  const deleteTask = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      await automationService.deleteAutomationTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete automation task');
      return false;
    }
  };

  // Deprecated: Use executeTaskImmediately instead
  const executeTask = async (id: string): Promise<TaskResult | null> => {
    console.warn('executeTask is deprecated. Use executeTaskImmediately instead.');
    try {
      setError(null);
      
      // Use executeTaskImmediately with default values for backwards compatibility
      const result = await executeTaskImmediately({
        taskId: id,
        instruction: "Execute task",
        userId: userId,
        userRole: "User",
        coCodeLd: ""
      });
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to execute task');
      }
      
      // Convert ExecuteTaskResponse to TaskResult format
      const taskResult: TaskResult = {
        id: result.executionId || Math.random().toString(),
        executedAt: new Date().toISOString(),
        status: result.success ? 'success' : 'error',
        output: result.message || 'Task executed successfully',
        errorMessage: result.success ? undefined : result.message,
        duration: 0,
        generatedContent: result.data ? JSON.stringify(result.data) : undefined
      };
      
      // Update the task with the new result
      setTasks(prev => prev.map(task => {
        if (task.id === id) {
          return {
            ...task,
            lastExecuted: taskResult.executedAt,
            results: [...(task.results || []), taskResult]
          };
        }
        return task;
      }));
      
      return taskResult;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute automation task');
      return null;
    }
  };

  const executeTaskImmediately = async (params: {
    taskId: string;
    instruction: string;
    userId: string;
    userRole: 'User' | 'Admin';
    coCodeLd?: string;
  }) => {
    try {
      setError(null);
      const result = await automationService.executeTaskImmediately(params);
      
      if (result.success) {
        // Optionally refresh tasks or update UI
        await fetchTasks();
      }
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute task immediately');
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Failed to execute task immediately'
      };
    }
  };

  const getTaskResults = async (taskId: string): Promise<TaskResult[]> => {
    try {
      setError(null);
      return await automationService.getTaskResults(taskId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch task results');
      return [];
    }
  };

  const activateTask = async (taskId: string): Promise<boolean> => {
    try {
      setError(null);
      await automationService.activateAutomationTask(taskId);
      // Update local state
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, status: 'active' } : task
      ));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to activate automation task');
      return false;
    }
  };

  const deactivateTask = async (taskId: string): Promise<boolean> => {
    try {
      setError(null);
      await automationService.deactivateAutomationTask(taskId);
      // Update local state
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, status: 'inactive' } : task
      ));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to deactivate automation task');
      return false;
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchAnalysisTasks();
  }, [userId]);

  return {
    tasks,
    analysisTasks,
    isLoading,
    error,
    fetchTasks,
    fetchAnalysisTasks,
    createTask,
    updateTask,
    deleteTask,
    activateTask,
    deactivateTask,
    executeTask,
    executeTaskImmediately,
    getTaskResults,
    getS3FileContent,
  };
};
