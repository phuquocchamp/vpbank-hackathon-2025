import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Play, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { AutomationTask, ExecuteTaskResponse } from '@/types/automation';

interface ExecuteTaskDialogProps {
  task: AutomationTask | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExecute: (params: {
    taskId: string;
    instruction: string;
    userId: string;
    userRole: 'User' | 'Admin';
    coCodeLd?: string;
  }) => Promise<ExecuteTaskResponse>;
}

const ExecuteTaskDialog: React.FC<ExecuteTaskDialogProps> = ({
  task,
  open,
  onOpenChange,
  onExecute
}) => {
  const { user } = useAuth();
  const [instructionText, setInstructionText] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<ExecuteTaskResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!task?.id || !user?.id || !instructionText.trim()) return;

    setIsExecuting(true);
    setResult(null);

    try {
      const response = await onExecute({
        taskId: task.id,
        instruction: instructionText.trim(),
        userId: user.id,
        userRole: user.role === 'ADMIN' ? 'Admin' : 'User',
        coCodeLd: user.co_code_ld || ''
      });

      setResult(response);
      
      if (response.success) {
        // Clear the input on success
        setInstructionText('');
      }
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleClose = () => {
    setInstructionText('');
    setResult(null);
    onOpenChange(false);
  };

  const isFormValid = instructionText.trim().length > 0 && task?.id && user?.id;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Execute Task Immediately
          </DialogTitle>
          <DialogDescription>
            Execute "{task?.title || 'Unknown Task'}" with custom input text.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="instructionText">Instruction Text</Label>
            <Textarea
              id="instructionText"
              placeholder="Enter your analysis request (e.g., 'cho tôi dữ liệu tình hình các giao dịch vào 7/7/2025')"
              value={instructionText}
              onChange={(e) => setInstructionText(e.target.value)}
              rows={4}
              disabled={isExecuting}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Describe what analysis you want to perform with this task.
            </p>
          </div>

          {result && (
            <Alert variant={result.success ? "default" : "destructive"}>
              {result.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>
                {result.message || (result.success ? 'Task executed successfully!' : 'Execution failed')}
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isExecuting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || isExecuting}
              className="min-w-[100px]"
            >
              {isExecuting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Executing...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Execute
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ExecuteTaskDialog;
