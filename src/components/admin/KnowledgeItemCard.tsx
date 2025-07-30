import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, FileText, Download, Clock, User } from 'lucide-react';
import type { KnowledgeBaseItem } from '@/hooks/useKnowledgeBase';

interface KnowledgeItemCardProps {
  item: KnowledgeBaseItem;
  onDelete: (id: string) => void;
  onDownload?: (id: string) => void;
  isDeleting: boolean;
  formatFileSize: (bytes: number) => string;
  getFileType: (item: KnowledgeBaseItem) => string;
}

const KnowledgeItemCard = ({
  item,
  onDelete,
  onDownload,
  isDeleting,
  formatFileSize,
  getFileType
}: KnowledgeItemCardProps) => {

  const fileType = getFileType(item);
  const isFile = item.fileName && item.fileName !== 'null';
  const fileSize = item.metadata.fileSize;

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'application/pdf':
        return '📄';
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return '📝';
      case 'text/plain':
        return '📃';
      case 'text/csv':
      case 'application/vnd.ms-excel':
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        return '📊';
      default:
        return '📋';
    }
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-md border-l-4 border-l-blue-500">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            {/* Title and Type Badge */}
            <div className="flex items-center gap-3 flex-wrap">
              <CardTitle className="flex items-center gap-2 text-lg">
                {isFile ? (
                  <span className="text-lg">{getFileIcon(fileType)}</span>
                ) : (
                  <FileText className="h-5 w-5 text-blue-600" />
                )}
                {item.title}
              </CardTitle>

              <div className="flex gap-2">
                <Badge variant="secondary" className="text-xs">
                  {isFile ? fileType.split('/').pop()?.toUpperCase() || 'FILE' : 'TEXT'}
                </Badge>

                {fileSize && (
                  <Badge variant="outline" className="text-xs">
                    {formatFileSize(fileSize)}
                  </Badge>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-blue-50 border-l-4 border-blue-400 rounded-r-md p-3">
              <p className="text-blue-800 font-medium text-sm leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* File Information */}
            {isFile && (
              <div className="bg-gray-50 rounded-md p-3">
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="font-medium">File:</span> {item.fileName}
                </p>
              </div>
            )}

            {/* Metadata */}
            <div className="flex flex-wrap gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Created: {new Date(item.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>

              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>Updated: {new Date(item.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            {onDownload && isFile && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDownload(item.knowledgebaseId)}
                className="h-8 w-8 p-0"
                title="Download file"
              >
                <Download className="h-4 w-4" />
              </Button>
            )}

            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDelete(item.knowledgebaseId)}
              disabled={isDeleting}
              className="h-8 w-8 p-0"
              title="Delete knowledge item"
            >
              {isDeleting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default KnowledgeItemCard;
