import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Filter,
  RefreshCw,
  Database,
  FileText,
  Archive,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { useState, useMemo } from 'react';
import KnowledgeItemCard from './KnowledgeItemCard';
import type { KnowledgeBaseItem } from '@/hooks/useKnowledgeBase';

interface KnowledgeListProps {
  items: KnowledgeBaseItem[];
  loading: boolean;
  error: string | null;
  onDelete: (id: string) => void;
  onDownload?: (id: string) => void;
  onViewContent?: (item: KnowledgeBaseItem) => void;
  onEdit?: (item: KnowledgeBaseItem) => void;
  onPreview?: (id: string) => void;
  onRefresh: () => void;
  isDeleting: string | null;
  formatFileSize: (bytes: number) => string;
  getFileType: (item: KnowledgeBaseItem) => string;
}

type SortField = 'title' | 'createdAt' | 'updatedAt' | 'fileType';
type SortOrder = 'asc' | 'desc';

const KnowledgeList = ({
  items,
  loading,
  error,
  onDelete,
  onDownload,
  onViewContent,
  onEdit,
  onPreview,
  onRefresh,
  isDeleting,
  formatFileSize,
  getFileType
}: KnowledgeListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'text' | 'file'>('all');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let filtered = items.filter(item => {
      // Search filter
      const matchesSearch = searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.fileName && item.fileName.toLowerCase().includes(searchQuery.toLowerCase()));

      // Type filter
      const isFileItem = item.fileName && item.fileName !== 'null';
      const matchesType = filterType === 'all' ||
        (filterType === 'file' && isFileItem) ||
        (filterType === 'text' && !isFileItem);

      return matchesSearch && matchesType;
    });

    // Sort items
    filtered.sort((a, b) => {
      let aValue: string | Date;
      let bValue: string | Date;

      switch (sortField) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'updatedAt':
          aValue = new Date(a.updatedAt);
          bValue = new Date(b.updatedAt);
          break;
        case 'fileType':
          aValue = getFileType(a);
          bValue = getFileType(b);
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [items, searchQuery, filterType, sortField, sortOrder, getFileType]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const fileCount = items.filter(item => item.fileName && item.fileName !== 'null').length;
  const textCount = items.length - fileCount;

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <div className="flex items-center gap-2 text-gray-500">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
            <span>Loading knowledge base...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-center">
            <p className="text-red-600 font-medium">Error loading knowledge base</p>
            <p className="text-red-500 text-sm mt-1">{error}</p>
            <Button
              size="sm"
              variant="outline"
              onClick={onRefresh}
              className="mt-3"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Database className="h-5 w-5" />
            Knowledge Base
          </h2>

          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs">
              <Archive className="size-3 mr-1" />
              {items.length} Total
            </Badge>
            <Badge variant="secondary" className="text-xs">
              <FileText className="size-3 mr-1" />
              {textCount} Text
            </Badge>
            <Badge variant="secondary" className="text-xs">
              📄 {fileCount} Files
            </Badge>
          </div>
        </div>

        <Button size="sm" variant="outline" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Search and Filter Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search knowledge items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter by Type */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={filterType === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterType('all')}
              >
                <Filter className="h-4 w-4 mr-1" />
                All
              </Button>
              <Button
                size="sm"
                variant={filterType === 'text' ? 'default' : 'outline'}
                onClick={() => setFilterType('text')}
              >
                <FileText className="h-4 w-4 mr-1" />
                Text
              </Button>
              <Button
                size="sm"
                variant={filterType === 'file' ? 'default' : 'outline'}
                onClick={() => setFilterType('file')}
              >
                📄 Files
              </Button>
            </div>

            {/* Sort Controls */}
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSort('title')}
                className="text-xs"
              >
                Title {sortField === 'title' && (sortOrder === 'asc' ? <SortAsc className="h-3 w-3 ml-1" /> : <SortDesc className="h-3 w-3 ml-1" />)}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSort('createdAt')}
                className="text-xs"
              >
                Date {sortField === 'createdAt' && (sortOrder === 'asc' ? <SortAsc className="h-3 w-3 ml-1" /> : <SortDesc className="h-3 w-3 ml-1" />)}
              </Button>
            </div>
          </div>

          {/* Results count */}
          {searchQuery && (
            <div className="mt-3 text-sm text-gray-600">
              Found {filteredAndSortedItems.length} of {items.length} items
            </div>
          )}
        </CardContent>
      </Card>

      {/* Knowledge Items */}
      {filteredAndSortedItems.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <div className="text-center">
              <Archive className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">
                {items.length === 0
                  ? 'No knowledge items found. Add some knowledge to get started.'
                  : 'No items match your search criteria.'
                }
              </p>
              {searchQuery && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSearchQuery('')}
                  className="mt-2"
                >
                  Clear Search
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredAndSortedItems.map((item) => (
            <KnowledgeItemCard
              key={item.knowledgebaseId}
              item={item}
              onDelete={onDelete}
              onDownload={onDownload}
              onViewContent={onViewContent}
              onEdit={onEdit}
              onPreview={onPreview}
              isDeleting={isDeleting === item.knowledgebaseId}
              formatFileSize={formatFileSize}
              getFileType={getFileType}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default KnowledgeList;
