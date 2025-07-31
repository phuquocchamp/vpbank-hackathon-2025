import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import MarkdownEditor from './MarkdownEditor';
import type { KnowledgeBaseItem } from '@/hooks/useKnowledgeBase';
import { AlertCircle, Save, X } from 'lucide-react';
import './MarkdownEditor.css';

interface KnowledgeEditDialogProps {
  item: KnowledgeBaseItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, title: string, description: string) => Promise<void>;
  isLoading?: boolean;
}

const KnowledgeEditDialog: React.FC<KnowledgeEditDialogProps> = ({
  item,
  open,
  onOpenChange,
  onSave,
  isLoading = false
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Reset form when item changes or dialog opens
  useEffect(() => {
    if (item && open) {
      setTitle(item.title);
      setDescription(item.description);
      setError(null);
    }
  }, [item, open]);

  const handleSave = async () => {
    if (!item) return;

    if (!title.trim() || !description.trim()) {
      setError('Title and description are required');
      return;
    }

    try {
      setError(null);
      await onSave(item.knowledgebaseId, title.trim(), description.trim());
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update knowledge');
    }
  };

  const handleCancel = () => {
    if (item) {
      setTitle(item.title);
      setDescription(item.description);
    }
    setError(null);
    onOpenChange(false);
  };

  const isFormValid = title.trim() && description.trim();
  const hasChanges = item && (title !== item.title || description !== item.description);

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="knowledge-edit-dialog !max-w-[80vw] max-h-[85vh] flex flex-col !w-[60vw] mx-2">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Edit Knowledge Base
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Update the title and description for this knowledge base item.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 space-y-4 py-2 overflow-hidden">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="edit-title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter knowledge base title..."
              disabled={isLoading}
              className="w-full"
            />
          </div>

          <div className="space-y-2 flex-1 min-h-0">
            <Label htmlFor="edit-description">
              Description <span className="text-red-500">*</span>
            </Label>
            <div className="flex-1 min-h-0">
              <MarkdownEditor
                value={description}
                onChange={setDescription}
                placeholder="Enter your knowledge base description here... You can use Markdown formatting."
                disabled={isLoading}
                height="100%"
              />
            </div>
            <p className="text-xs text-gray-500">
              Supports Markdown formatting including headers, lists, links, code blocks, and more.
            </p>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isLoading || !isFormValid || !hasChanges}
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default KnowledgeEditDialog;
