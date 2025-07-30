import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, AlertCircle } from 'lucide-react';
import FileUpload from './FileUpload';
import type { FileUploadProgress } from '@/hooks/useKnowledgeBase';

interface KnowledgeFormProps {
  onSubmitText: (title: string, description: string) => Promise<void>;
  onSubmitFile: (file: File, title?: string, description?: string) => Promise<void>;
  isLoading: boolean;
  uploadProgress: FileUploadProgress | null;
  error?: string | null;
}

const KnowledgeForm = ({
  onSubmitText,
  onSubmitFile,
  isLoading,
  uploadProgress,
  error
}: KnowledgeFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleTextSubmit = async () => {
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
      setFormError(err instanceof Error ? err.message : 'Failed to add knowledge');
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setFormError(null);
      await onSubmitFile(file, title, description);
      // Reset form on success
      setTitle('');
      setDescription('');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to upload file');
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
            Add Business Rule or Knowledge Base
          </CardTitle>
          <CardDescription>
            Enter business rules, policies, or knowledge that the system should understand.
            You can either add text-based knowledge or upload documents.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Form Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="knowledge-title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="knowledge-title"
                placeholder="Enter a descriptive title for your knowledge..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="knowledge-description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="knowledge-description"
                placeholder="Enter your business rules, policies, or knowledge base description here..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                disabled={isLoading}
                className="w-full resize-none"
              />
              <p className="text-xs text-gray-500">
                Provide clear and detailed information to improve AI understanding.
              </p>
            </div>
          </div>

          {/* File Upload Section */}
          <div className="space-y-3">
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-3">Or Upload a Document</h4>
              <FileUpload
                onFileUpload={handleFileUpload}
                isUploading={isLoading}
                uploadProgress={uploadProgress}
                error={null} // We handle errors at the form level
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="border-t pt-4">
            <Button
              onClick={handleTextSubmit}
              className="w-full"
              disabled={isLoading || !isFormValid}
              size="lg"
            >
              <FileText className="mr-2 h-4 w-4" />
              {isLoading ? 'Adding Knowledge...' : 'Add Text Knowledge'}
            </Button>

            <p className="text-xs text-gray-500 mt-2 text-center">
              {!isFormValid && 'Please fill in both title and description to add text knowledge'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KnowledgeForm;
