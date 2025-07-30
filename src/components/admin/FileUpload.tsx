import { useCallback } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { FileUploadProgress } from '@/hooks/useKnowledgeBase';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isUploading: boolean;
  uploadProgress: FileUploadProgress | null;
  error?: string | null;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

const FileUpload = ({
  onFileUpload,
  isUploading,
  uploadProgress,
  error,
  accept = ".pdf,.doc,.docx,.txt,.csv,.xlsx",
  maxSize = 10,
  className = ""
}: FileUploadProps) => {

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
    // Reset input value to allow re-uploading the same file
    event.target.value = '';
  }, [onFileUpload]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="p-0">
          <div
            className={`
              relative flex flex-col items-center justify-center w-full h-32 
              border-2 border-dashed border-gray-300 rounded-lg 
              hover:bg-gray-50 transition-colors
              ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept={accept}
              onChange={handleFileChange}
              disabled={isUploading}
            />

            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {isUploading ? (
                <FileText className="w-8 h-8 mb-4 text-blue-500 animate-pulse" />
              ) : (
                <Upload className="w-8 h-8 mb-4 text-gray-500" />
              )}

              <p className="mb-2 text-sm text-gray-500">
                {isUploading ? (
                  <span className="font-semibold">Uploading...</span>
                ) : (
                  <>
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </>
                )}
              </p>

              <p className="text-xs text-gray-500">
                PDF, DOC, DOCX, TXT, CSV, XLSX (Max {maxSize}MB)
              </p>
            </div>
          </div>

          {uploadProgress && (
            <div className="p-4 border-t">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Uploading...</span>
                <span>{uploadProgress.percentage.toFixed(0)}%</span>
              </div>
              <Progress value={uploadProgress.percentage} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-xs text-gray-500 space-y-1">
        <p>• Supported formats: PDF, DOC, DOCX, TXT, CSV, XLSX</p>
        <p>• Maximum file size: {maxSize}MB</p>
        <p>• Files will be processed and indexed automatically</p>
      </div>
    </div>
  );
};

export default FileUpload;
