export interface AutomationTask {
  id?: string;
  title?: string;
  instruction?: string;
  triggerType?: 'time' | 'event';
  triggerConfig?: TimeConfig | EventConfig;
  status?: 'active' | 'inactive' | 'running' | 'completed' | 'error';
  createdAt?: string;
  updatedAt?: string;
  lastExecuted?: string;
  nextExecution?: string;
  results?: TaskResult[];
  createdBy?: string;
  category?: 'trading-analysis' | 'customer-analytics' | 'risk-analysis' | 'reporting' | 'maintenance' | 'notification' | 'custom';
}

export interface TimeConfig {
  type: 'once' | 'recurring';
  datetime?: string; // For 'once' type
  schedule?: ScheduleConfig; // For 'recurring' type
}

export interface ScheduleConfig {
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string; // HH:mm format
  days?: number[]; // For weekly (0=Sunday, 1=Monday, etc.)
  date?: number; // For monthly (1-31)
}

// New API event structure
export interface CreateTaskEvent {
  scheduleType: 'one-time' | 'recurring';
  time?: string; // For one-time: ISO string, for recurring: HH:mm format
  frequency?: 'daily' | 'weekly' | 'monthly'; // For recurring only
  dayOfWeek?: string; // For weekly: 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'
  dayOfMonth?: string; // For monthly: '1' to '31'
}

export interface EventConfig {
  eventType: 'data-threshold' | 'system-alert' | 'user-action';
  conditions: Record<string, any>;
}

export interface TaskResult {
  id: string;
  executedAt: string;
  status: 'success' | 'error' | 'partial';
  output?: string;
  errorMessage?: string;
  duration: number; // in milliseconds
  generatedContent?: string;
}

export interface CreateAutomationTaskRequest {
  title: string;
  category: 'trading-analysis' | 'customer-analytics' | 'risk-analysis' | 'reporting' | 'maintenance' | 'notification' | 'custom';
  instruction: string;
  event: CreateTaskEvent;
  coCodeLd: string;
  userId: string;
  userRole: 'User' | 'Admin';
}

export interface UpdateAutomationTaskRequest {
  title?: string;
  instruction?: string;
  triggerConfig?: TimeConfig | EventConfig;
  status?: 'active' | 'inactive';
  category?: 'trading-analysis' | 'customer-analytics' | 'risk-analysis' | 'reporting' | 'maintenance' | 'notification' | 'custom';
}
