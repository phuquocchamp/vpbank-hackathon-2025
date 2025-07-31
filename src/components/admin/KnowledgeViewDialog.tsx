import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import MarkdownViewer from './MarkdownViewer';
import type { KnowledgeBaseItem } from '@/hooks/useKnowledgeBase';
import { FileText, Calendar, Clock } from 'lucide-react';

interface KnowledgeViewDialogProps {
  item: KnowledgeBaseItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  getFileType: (item: KnowledgeBaseItem) => string;
  formatFileSize: (bytes: number) => string;
}

const KnowledgeViewDialog: React.FC<KnowledgeViewDialogProps> = ({
  item,
  open,
  onOpenChange,
  getFileType,
  formatFileSize
}) => {
  if (!item) return null;

  const fileType = getFileType(item);
  const isFile = item.fileName && item.fileName !== 'null';
  const fileSize = item.metadata.fileSize;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col w-[90vw]">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-200 flex-shrink-0">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg font-semibold text-gray-900 mb-2">
                {item.title}
              </DialogTitle>
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <Badge variant={isFile ? "default" : "secondary"} className="text-xs">
                  {isFile ? fileType.split('/').pop()?.toUpperCase() || 'FILE' : 'TEXT'}
                </Badge>
                {fileSize && (
                  <Badge variant="outline" className="text-xs">
                    {formatFileSize(fileSize)}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Created: {new Date(item.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Updated: {new Date(item.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}</span>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 min-h-0">
          <DialogDescription asChild>
            <ScrollArea className="h-full pr-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <MarkdownViewer content={item.description} />
                  </div>
                </div>

                {isFile && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">File Information</h4>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">Filename:</span>
                        <span>{item.fileName}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </DialogDescription>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KnowledgeViewDialog;
