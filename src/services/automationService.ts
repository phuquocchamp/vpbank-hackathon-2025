import type { AutomationTask, CreateAutomationTaskRequest, UpdateAutomationTaskRequest, TaskResult } from '@/types/automation';

export class AutomationService {
  private baseUrl: string;
  
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || '';
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('vpbank_id_token') || sessionStorage.getItem('vpbank_id_token');
  }

  private getHeaders(): HeadersInit {
    const token = this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  // Get all automation tasks for a specific user
  async getAutomationTasks(userId: string): Promise<AutomationTask[]> {
    try {
      const response = await fetch(`${this.baseUrl}/analysis-task/${userId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Transform the API response to match our AutomationTask interface
      const tasks = Array.isArray(result) ? result : (result.data || []);
      
      return tasks.map((task: any) => ({
        id: task.taskId || task.id,
        title: task.title,
        instruction: task.instruction,
        triggerType: 'time', // Based on the API response structure
        triggerConfig: {
          type: task.event?.scheduleType === 'one-time' ? 'once' : 'recurring',
          datetime: task.event?.scheduleType === 'one-time' ? task.event.time : undefined,
          schedule: task.event?.scheduleType === 'recurring' ? {
            frequency: task.event.frequency || 'daily',
            time: task.event.time || '09:00',
            days: task.event.dayOfWeek ? [this.convertDayOfWeekToNumber(task.event.dayOfWeek)] : undefined,
            date: task.event.dayOfMonth ? parseInt(task.event.dayOfMonth) : undefined
          } : undefined
        },
        status: task.status || 'inactive',
        createdAt: task.createdAt,
        updatedAt: task.createdAt, // Use createdAt if updatedAt is not available
        lastExecuted: task.result && task.result.length > 0 ? task.result[task.result.length - 1].executeTime : undefined,
        nextExecution: undefined, // Not provided by API
        results: task.result ? task.result.map((r: any) => ({
          id: r.executeTime || Math.random().toString(),
          executedAt: r.executeTime,
          status: r.status === 'success' ? 'success' : 'error',
          output: r.status === 'success' ? 'Analysis completed successfully' : 'Analysis failed',
          errorMessage: r.status !== 'success' ? 'Task execution failed' : undefined,
          duration: 0, // Not provided by API
          generatedContent: r.filePath ? `Analysis result available at: ${r.filePath}` : undefined
        })) : [],
        createdBy: task.userId,
        category: task.category || 'custom'
      }));
    } catch (error) {
      console.error('Error fetching automation tasks:', error);
      throw error;
    }
  }

  private convertDayOfWeekToNumber(dayOfWeek: string): number {
    const dayMap: { [key: string]: number } = {
      'SUN': 0, 'MON': 1, 'TUE': 2, 'WED': 3, 'THU': 4, 'FRI': 5, 'SAT': 6
    };
    return dayMap[dayOfWeek] || 0;
  }

  // Create a new automation task
  async createAutomationTask(request: CreateAutomationTaskRequest): Promise<AutomationTask> {
    try {
      const response = await fetch(`${this.baseUrl}/analysis-task/create`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Transform the response to match our AutomationTask interface
      const task = result.data || result;
      return {
        id: task.taskId || task.id,
        title: request.title,
        instruction: request.instruction,
        triggerType: 'time',
        triggerConfig: {
          type: request.event.scheduleType === 'one-time' ? 'once' : 'recurring',
          datetime: request.event.scheduleType === 'one-time' ? request.event.time : undefined,
          schedule: request.event.scheduleType === 'recurring' ? {
            frequency: request.event.frequency || 'daily',
            time: request.event.time || '09:00',
            days: request.event.dayOfWeek ? [this.convertDayOfWeekToNumber(request.event.dayOfWeek)] : undefined,
            date: request.event.dayOfMonth ? parseInt(request.event.dayOfMonth) : undefined
          } : undefined
        },
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        results: [],
        createdBy: request.userId,
        category: request.category
      };
    } catch (error) {
      console.error('Error creating automation task:', error);
      throw error;
    }
  }

  // Update an automation task
  async updateAutomationTask(id: string, request: UpdateAutomationTaskRequest): Promise<AutomationTask> {
    try {
      const response = await fetch(`${this.baseUrl}/automation/tasks/${id}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error updating automation task:', error);
      throw error;
    }
  }

  // Delete an automation task
  async deleteAutomationTask(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/automation/tasks/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting automation task:', error);
      throw error;
    }
  }

  // Execute a task manually
  async executeTask(id: string): Promise<TaskResult> {
    try {
      const response = await fetch(`${this.baseUrl}/automation/tasks/${id}/execute`, {
        method: 'POST',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error executing automation task:', error);
      throw error;
    }
  }

  // Get task execution history
  async getTaskResults(taskId: string): Promise<TaskResult[]> {
    try {
      const response = await fetch(`${this.baseUrl}/automation/tasks/${taskId}/results`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching task results:', error);
      return [];
    }
  }
}

export const automationService = new AutomationService();
