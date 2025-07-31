// import KnowledgeContentViewer from '@/components/admin/KnowledgeContentViewer'
import KnowledgeForm from '@/components/admin/KnowledgeForm'
import KnowledgeList from '@/components/admin/KnowledgeList'
import KnowledgeViewDialog from '@/components/admin/KnowledgeViewDialog'
import KnowledgeEditDialog from '@/components/admin/KnowledgeEditDialog'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useHeader } from '@/contexts/HeaderContext'
import type { KnowledgeBaseItem } from '@/hooks/useKnowledgeBase'
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase'
import { Database, Info } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const KnowledgeBase = () => {
  const { setHeaderInfo } = useHeader();

  const {
    knowledgeItems,
    loading,
    error,
    isAdding,
    isDeleting,
    addTextKnowledge,
    updateKnowledgeItem,
    deleteKnowledgeItem,
    fetchKnowledgeBase,
    getFileTypeFromMetadata,
    formatFileSize,
    downloadKnowledgeFile,
    getPreviewUrl,
  } = useKnowledgeBase();

  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<KnowledgeBaseItem | null>(null);

  // Set header info for knowledge base page
  useEffect(() => {
    setHeaderInfo({
      title: 'Knowledge Base Management',
      description: 'Upload and manage your organization\'s knowledge assets',
      badge: (
        <Badge variant="outline" className="text-xs">
          <Database className="size-3 mr-1" />
          {knowledgeItems.length} Items
        </Badge>
      )
    });

    return () => setHeaderInfo(null);
  }, [setHeaderInfo, knowledgeItems.length]);

  // Handle text knowledge submission
  const handleSubmitText = async (title: string, description: string) => {
    try {
      await addTextKnowledge(title, description);
      toast.success('Knowledge added successfully!', {
        description: 'The text knowledge has been saved to your database.',
        duration: 4000,
      });
    } catch (error) {
      toast.error('Failed to add knowledge', {
        description: error instanceof Error ? error.message : 'Please try again later.',
        duration: 4000,
      });
      throw error; // Re-throw to let the form handle it
    }
  };

  // Handle knowledge deletion
  const handleDelete = async (id: string) => {
    try {
      await deleteKnowledgeItem(id);
      toast.success('Knowledge deleted successfully!', {
        description: 'The item has been removed from your knowledge base.',
        duration: 3000,
      });
    } catch (error) {
      toast.error('Failed to delete knowledge', {
        description: error instanceof Error ? error.message : 'Please try again later.',
        duration: 4000,
      });
    }
  };

  // Handle view content
  const handleViewContent = (item: KnowledgeBaseItem) => {
    setSelectedItem(item);
    setViewDialogOpen(true);
  };

  // Handle edit item
  const handleEdit = (item: KnowledgeBaseItem) => {
    setSelectedItem(item);
    setEditDialogOpen(true);
  };

  // Handle update knowledge item
  const handleUpdate = async (id: string, title: string, description: string) => {
    try {
      await updateKnowledgeItem(id, title, description);
      toast.success('Knowledge updated successfully!', {
        description: 'The knowledge base item has been updated.',
        duration: 4000,
      });
    } catch (error) {
      toast.error('Failed to update knowledge', {
        description: error instanceof Error ? error.message : 'Please try again later.',
        duration: 4000,
      });
      throw error; // Re-throw to let the dialog handle it
    }
  };

  // Handle download file
  const handleDownload = async (id: string) => {
    const item = knowledgeItems.find(item => item.knowledgebaseId === id);
    if (!item) return;

    try {
      await downloadKnowledgeFile(id, item.fileName || 'knowledge.txt');
      // No toast notification - silent download
    } catch (error) {
      toast.error('Download failed', {
        description: error instanceof Error ? error.message : 'Please try again later.',
        duration: 4000,
      });
    }
  };

  // Handle preview file
  const handlePreview = async (id: string) => {
    try {
      await getPreviewUrl(id);
      // URL is automatically opened in new tab by getPreviewUrl function
    } catch (error) {
      toast.error('Preview failed', {
        description: error instanceof Error ? error.message : 'Unable to open preview. Please try again later.',
        duration: 4000,
      });
    }
  };


  return (
    <div className="space-y-6">
      {/* Information Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Knowledge Base supports text-based knowledge management with <strong>Markdown formatting</strong>.
          Create rich content including headers, lists, links, code blocks, and more to organize your business rules and policies effectively.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="add" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="add">Add Knowledge</TabsTrigger>
          <TabsTrigger value="manage">Manage Knowledge</TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="space-y-6">
          <KnowledgeForm
            onSubmitText={handleSubmitText}
            isLoading={isAdding}
            error={error}
          />
        </TabsContent>

        <TabsContent value="manage">
          <KnowledgeList
            items={knowledgeItems}
            loading={loading}
            error={error}
            onDelete={handleDelete}
            onDownload={handleDownload}
            onViewContent={handleViewContent}
            onEdit={handleEdit}
            onPreview={handlePreview}
            onRefresh={fetchKnowledgeBase}
            isDeleting={isDeleting}
            formatFileSize={formatFileSize}
            getFileType={getFileTypeFromMetadata}
          />
        </TabsContent>
      </Tabs>

      {/* View Dialog */}
      <KnowledgeViewDialog
        item={selectedItem}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        getFileType={getFileTypeFromMetadata}
        formatFileSize={formatFileSize}
      />

      {/* Edit Dialog */}
      <KnowledgeEditDialog
        item={selectedItem}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleUpdate}
        isLoading={isAdding}
      />
    </div>
  )
}

export default KnowledgeBase
