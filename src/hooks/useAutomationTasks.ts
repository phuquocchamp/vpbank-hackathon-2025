import { useState, useEffect } from 'react';
import { automationService } from '@/services/automationService';
import type { AutomationTask, CreateAutomationTaskRequest, UpdateAutomationTaskRequest, TaskResult } from '@/types/automation';

export const useAutomationTasks = (userId: string) => {
  const [tasks, setTasks] = useState<AutomationTask[]>([]);
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

  const executeTask = async (id: string): Promise<TaskResult | null> => {
    try {
      setError(null);
      const result = await automationService.executeTask(id);
      
      // Update the task with the new result
      setTasks(prev => prev.map(task => {
        if (task.id === id) {
          return {
            ...task,
            lastExecuted: result.executedAt,
            results: [...(task.results || []), result]
          };
        }
        return task;
      }));
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute automation task');
      return null;
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

  useEffect(() => {
    fetchTasks();
  }, [userId]);

  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    executeTask,
    getTaskResults,
  };
};
