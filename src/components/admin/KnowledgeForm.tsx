import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, AlertCircle, Upload, Plus } from 'lucide-react';
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setFormError(null);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      setFormError('Title and description are required');
      return;
    }

    try {
      setFormError(null);

      if (selectedFile) {
        // Upload with file
        await onSubmitFile(selectedFile, title, description);
      } else {
        // Text-only knowledge
        await onSubmitText(title, description);
      }

      // Reset form on success
      setTitle('');
      setDescription('');
      setSelectedFile(null);
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
            Add business rules, policies, or knowledge. You can optionally attach a document file.
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
              <Textarea
                id="description"
                placeholder="Enter your business rules, policies, or knowledge description here..."
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

            <div className="space-y-2">
              <Label>
                Document File <span className="text-gray-500">(Optional)</span>
              </Label>
              <FileUpload
                onFileUpload={handleFileSelect}
                isUploading={isLoading}
                uploadProgress={uploadProgress}
                error={null}
                mode="select"
              />
              {selectedFile && (
                <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-md">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-blue-900">{selectedFile.name}</span>
                        <p className="text-xs text-blue-600">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedFile(null)}
                      disabled={isLoading}
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              )}
              <p className="text-xs text-gray-500">
                Supported formats: PDF, DOC, DOCX, TXT, CSV, XLSX (Max 10MB)
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
              {selectedFile ? (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  {isLoading ? 'Uploading Knowledge with File...' : 'Save Knowledge with File'}
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  {isLoading ? 'Adding Knowledge...' : 'Save Knowledge'}
                </>
              )}
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
