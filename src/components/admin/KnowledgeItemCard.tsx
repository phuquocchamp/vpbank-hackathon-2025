import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { KnowledgeBaseItem } from '@/hooks/useKnowledgeBase';
import { Download, FileText, Trash2 } from 'lucide-react';

interface KnowledgeItemCardProps {
  item: KnowledgeBaseItem;
  onDelete: (id: string) => void;
  onDownload?: (id: string) => void;
  onViewContent?: (item: KnowledgeBaseItem) => void;
  onPreview?: (id: string) => void;
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

  const getFileIconColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'application/pdf':
        return 'text-red-500';
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return 'text-blue-500';
      case 'text/plain':
        return 'text-gray-500';
      case 'text/csv':
      case 'application/vnd.ms-excel':
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        return 'text-green-500';
      default:
        return 'text-blue-500';
    }
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-md border border-gray-200 hover:border-blue-300 group">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-3">
          {/* File Icon & Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center border border-blue-200 flex-shrink-0">
              {isFile ? (
                <span className="text-lg">{getFileIcon(fileType)}</span>
              ) : (
                <FileText className={`h-4 w-4 ${getFileIconColor(fileType)}`} />
              )}
            </div>

            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-sm text-gray-900 truncate">
                  {item.title}
                </h3>
                <Badge
                  variant={isFile ? "default" : "secondary"}
                  className="text-xs h-5 px-2"
                >
                  {isFile ? fileType.split('/').pop()?.toUpperCase() || 'FILE' : 'TEXT'}
                </Badge>
              </div>

              <p className="text-xs text-gray-600 truncate">
                {item.description}
              </p>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                {fileSize && (
                  <span>{formatFileSize(fileSize)}</span>
                )}
                {fileSize && <span>•</span>}
                <span>{new Date(item.updatedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0">
            {/* Download Button - Only for files */}
            {onDownload && isFile && (
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload(item.knowledgebaseId);
                }}
                className="h-7 w-7 p-0 hover:bg-green-50 hover:text-green-600"
                title="Download file"
              >
                <Download className="h-3.5 w-3.5" />
              </Button>
            )}

            {/* Delete Button */}
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.knowledgebaseId);
              }}
              disabled={isDeleting}
              className="h-7 w-7 p-0 hover:bg-red-50 hover:text-red-600"
              title="Delete knowledge item"
            >
              {isDeleting ? (
                <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KnowledgeItemCard;
