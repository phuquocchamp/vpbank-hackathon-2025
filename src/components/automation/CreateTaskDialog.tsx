import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Plus, Zap } from 'lucide-react';
import type { CreateAutomationTaskRequest, CreateTaskEvent } from '@/types/automation';
import { useAuth } from '@/contexts/AuthContext';

interface CreateTaskDialogProps {
  onCreateTask: (request: CreateAutomationTaskRequest) => void;
  isLoading?: boolean;
}

const CreateTaskDialog: React.FC<CreateTaskDialogProps> = ({ onCreateTask, isLoading = false }) => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<CreateAutomationTaskRequest>({
    title: '',
    category: 'trading-analysis',
    instruction: '',
    event: {
      scheduleType: 'recurring',
      frequency: 'daily',
      time: '09:00'
    },
    coCodeLd: user?.co_code_ld || 'VN0010001',
    userId: user?.id || '',
    userRole: user?.role === 'ADMIN' ? 'Admin' : 'User'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.instruction.trim()) {
      return;
    }
    onCreateTask(formData);
    setOpen(false);
    // Reset form
    setFormData({
      title: '',
      category: 'trading-analysis',
      instruction: '',
      event: {
        scheduleType: 'recurring',
        frequency: 'daily',
        time: '09:00'
      },
      coCodeLd: user?.co_code_ld || 'VN0010001',
      userId: user?.id || '',
      userRole: user?.role === 'ADMIN' ? 'Admin' : 'User'
    });
  };

  const updateEventConfig = (updates: Partial<CreateTaskEvent>) => {
    setFormData(prev => ({
      ...prev,
      event: {
        ...prev.event,
        ...updates
      }
    }));
  };

  const categoryOptions = [
    { value: 'trading-analysis', label: 'Trading Analysis', description: 'Analyze trading data, market trends, and performance metrics' },
    { value: 'customer-analytics', label: 'Customer Analytics', description: 'Customer behavior, churn analysis, and segmentation' },
    { value: 'risk-analysis', label: 'Risk Analysis', description: 'Portfolio risk, market risk, and compliance monitoring' },
    { value: 'reporting', label: 'Financial Reporting', description: 'Generate financial reports and performance summaries' },
    { value: 'maintenance', label: 'System Maintenance', description: 'System health checks and automated maintenance tasks' },
    { value: 'notification', label: 'Market Intelligence', description: 'Market sentiment, news analysis, and opportunity identification' },
    { value: 'custom', label: 'Custom Analysis', description: 'Custom financial and banking analysis tasks' }
  ];

  const taskTemplates = [
    {
      title: 'Daily Trading Analysis',
      instruction: 'hãy cho tôi tổng quan giao dịch trong ngày 7/7/2025',
      category: 'trading-analysis' as const,
      event: { scheduleType: 'recurring' as const, frequency: 'daily' as const, time: '09:00' }
    },
    {
      title: 'Customer Churn Risk Analysis',
      instruction: 'Identify the top 20 customers most likely to churn today based on recent activity, transaction patterns, engagement metrics, and provide retention recommendations',
      category: 'customer-analytics' as const,
      event: { scheduleType: 'recurring' as const, frequency: 'daily' as const, time: '11:00' }
    },
    {
      title: 'Weekly Revenue Performance',
      instruction: 'Analyze weekly revenue performance by product lines, compare with previous periods, identify growth opportunities and underperforming areas',
      category: 'reporting' as const,
      event: { scheduleType: 'recurring' as const, frequency: 'weekly' as const, time: '18:00', dayOfWeek: 'MON' }
    },
    {
      title: 'Market Sentiment Analysis',
      instruction: 'Analyze current market sentiment, news impact, currency trends, and identify potential trading opportunities for the next 24 hours',
      category: 'trading-analysis' as const,
      event: { scheduleType: 'recurring' as const, frequency: 'daily' as const, time: '06:00' }
    },
    {
      title: 'Top Performing Products Today',
      instruction: 'Show the top 10 best-performing banking products today by revenue, transaction volume, and customer adoption. Include growth rates and trends.',
      category: 'reporting' as const,
      event: { scheduleType: 'recurring' as const, frequency: 'daily' as const, time: '17:00' }
    },
    {
      title: 'Monthly Risk Assessment',
      instruction: 'Perform comprehensive risk analysis of loan portfolio, trading positions, and market exposure. Provide risk mitigation recommendations.',
      category: 'risk-analysis' as const,
      event: { scheduleType: 'recurring' as const, frequency: 'monthly' as const, time: '08:00', dayOfMonth: '1' }
    }
  ];

  const useTemplate = (template: typeof taskTemplates[0]) => {
    setFormData(prev => ({
      ...prev,
      title: template.title,
      instruction: template.instruction,
      category: template.category,
      event: template.event
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Automation Task
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            Create New Automation Task
          </DialogTitle>
          <DialogDescription>
            Create a GenAI-powered automation task that will execute based on your specified schedule.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="schedule">Scheduling</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="title">Task Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter a descriptive title for your automation task"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs text-muted-foreground">{option.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="instruction">Task Instruction</Label>
                  <Textarea
                    id="instruction"
                    value={formData.instruction}
                    onChange={(e) => setFormData(prev => ({ ...prev, instruction: e.target.value }))}
                    placeholder="Describe what you want the GenAI to do when this task is triggered. Be specific about the expected output and any data sources to use."
                    rows={4}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    💡 Tip: Be specific about what data to analyze, what format you want the output in, and any specific requirements.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>Schedule Type</Label>
                  <Select 
                    value={formData.event.scheduleType} 
                    onValueChange={(value: 'one-time' | 'recurring') => {
                      updateEventConfig({ 
                        scheduleType: value,
                        ...(value === 'one-time' 
                          ? { time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), frequency: undefined }
                          : { frequency: 'daily', time: '09:00' }
                        )
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="one-time">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <div>
                            <div>One-time</div>
                            <div className="text-xs text-muted-foreground">Run once at specific time</div>
                          </div>
                        </div>
                      </SelectItem>
                      <SelectItem value="recurring">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <div>
                            <div>Recurring</div>
                            <div className="text-xs text-muted-foreground">Run on a schedule</div>
                          </div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.event.scheduleType === 'one-time' && (
                  <div>
                    <Label>Execution Time</Label>
                    <Input
                      type="datetime-local"
                      value={formData.event.time ? new Date(formData.event.time).toISOString().slice(0, 16) : ''}
                      onChange={(e) => updateEventConfig({ time: new Date(e.target.value).toISOString() })}
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>
                )}

                {formData.event.scheduleType === 'recurring' && (
                  <div className="space-y-4">
                    <div>
                      <Label>Frequency</Label>
                      <Select 
                        value={formData.event.frequency || 'daily'} 
                        onValueChange={(value: 'daily' | 'weekly' | 'monthly') => {
                          const updates: Partial<CreateTaskEvent> = { frequency: value };
                          // Set default values for new frequency
                          if (value === 'weekly') {
                            updates.dayOfWeek = 'MON';
                          } else if (value === 'monthly') {
                            updates.dayOfMonth = '1';
                          }
                          updateEventConfig(updates);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.event.frequency === 'weekly' && (
                      <div>
                        <Label>Day of Week</Label>
                        <Select 
                          value={formData.event.dayOfWeek || 'MON'} 
                          onValueChange={(value) => updateEventConfig({ dayOfWeek: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SUN">Sunday</SelectItem>
                            <SelectItem value="MON">Monday</SelectItem>
                            <SelectItem value="TUE">Tuesday</SelectItem>
                            <SelectItem value="WED">Wednesday</SelectItem>
                            <SelectItem value="THU">Thursday</SelectItem>
                            <SelectItem value="FRI">Friday</SelectItem>
                            <SelectItem value="SAT">Saturday</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {formData.event.frequency === 'monthly' && (
                      <div>
                        <Label>Day of Month</Label>
                        <Select 
                          value={formData.event.dayOfMonth || '1'} 
                          onValueChange={(value) => updateEventConfig({ dayOfMonth: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                              <SelectItem key={day} value={day.toString()}>{day}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div>
                      <Label>Time</Label>
                      <Input
                        type="time"
                        value={formData.event.time || '09:00'}
                        onChange={(e) => updateEventConfig({ time: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Schedule Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      {formData.event.scheduleType === 'one-time' ? (
                        formData.event.time ? (
                          `Will run once on ${new Date(formData.event.time).toLocaleString()}`
                        ) : (
                          'Select execution time'
                        )
                      ) : (
                        (() => {
                          const frequency = formData.event.frequency || 'daily';
                          const time = formData.event.time || '09:00';
                          
                          if (frequency === 'daily') {
                            return `Will run daily at ${time}`;
                          } else if (frequency === 'weekly') {
                            const dayOfWeek = formData.event.dayOfWeek || 'MON';
                            const dayNames = {
                              'SUN': 'Sunday', 'MON': 'Monday', 'TUE': 'Tuesday', 
                              'WED': 'Wednesday', 'THU': 'Thursday', 'FRI': 'Friday', 'SAT': 'Saturday'
                            };
                            return `Will run weekly on ${dayNames[dayOfWeek as keyof typeof dayNames]} at ${time}`;
                          } else if (frequency === 'monthly') {
                            const dayOfMonth = formData.event.dayOfMonth || '1';
                            return `Will run monthly on day ${dayOfMonth} at ${time}`;
                          }
                          return `Will run ${frequency} at ${time}`;
                        })()
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-3">Task Templates</h3>
                <div className="grid gap-4">
                  {taskTemplates.map((template, index) => (
                    <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => useTemplate(template)}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base">{template.title}</CardTitle>
                            <Badge variant="outline" className="mt-1 text-xs">
                              {template.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Badge>
                          </div>
                          <Button variant="ghost" size="sm">
                            Use Template
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-sm">
                          {template.instruction}
                        </CardDescription>
                        <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {(() => {
                              const { frequency, time, dayOfWeek, dayOfMonth } = template.event;
                              if (frequency === 'daily') {
                                return `${frequency} at ${time}`;
                              } else if (frequency === 'weekly') {
                                const dayNames = {
                                  'SUN': 'Sunday', 'MON': 'Monday', 'TUE': 'Tuesday', 
                                  'WED': 'Wednesday', 'THU': 'Thursday', 'FRI': 'Friday', 'SAT': 'Saturday'
                                };
                                const dayName = dayOfWeek ? dayNames[dayOfWeek as keyof typeof dayNames] : 'Monday';
                                return `${frequency} on ${dayName} at ${time}`;
                              } else if (frequency === 'monthly') {
                                return `${frequency} on day ${dayOfMonth || '1'} at ${time}`;
                              }
                              return `${frequency} at ${time}`;
                            })()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !formData.title.trim() || !formData.instruction.trim()}>
              {isLoading ? 'Creating...' : 'Create Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;
