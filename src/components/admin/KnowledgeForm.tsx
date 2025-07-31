import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, AlertCircle, Plus } from 'lucide-react';
import MarkdownEditor from './MarkdownEditor';

interface KnowledgeFormProps {
  onSubmitText: (title: string, description: string) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
}

const KnowledgeForm = ({
  onSubmitText,
  isLoading,
  error
}: KnowledgeFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      setFormError('Title and description are required');
      return;
    }

    try {
      setFormError(null);
      await onSubmitText(title, description);

      // Reset form on success
      setTitle('');
      setDescription('');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save knowledge');
    }
  };

  const isFormValid = title.trim() && description.trim();
  const displayError = formError || error;

  return (
    <div className="space-y-6">
      {displayError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{displayError}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Add Knowledge Base
          </CardTitle>
          <CardDescription>
            Add business rules, policies, or knowledge using Markdown formatting for rich text content.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Enter a descriptive title for your knowledge..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-red-500">*</span>
              </Label>
              <MarkdownEditor
                value={description}
                onChange={setDescription}
                placeholder="Enter your business rules, policies, or knowledge description here... You can use Markdown formatting."
                disabled={isLoading}
                height={350}
              />
              <p className="text-xs text-gray-500">
                Supports Markdown formatting including headers, lists, links, code blocks, and more.
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <Button
              onClick={handleSubmit}
              className="w-full"
              disabled={isLoading || !isFormValid}
              size="lg"
            >
              <Plus className="mr-2 h-4 w-4" />
              {isLoading ? 'Adding Knowledge...' : 'Save Knowledge'}
            </Button>

            {!isFormValid && (
              <p className="text-xs text-gray-500 mt-2 text-center">
                Please fill in both title and description to save knowledge
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KnowledgeForm;
