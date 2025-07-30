// import KnowledgeContentViewer from '@/components/admin/KnowledgeContentViewer'
import KnowledgeForm from '@/components/admin/KnowledgeForm'
import KnowledgeList from '@/components/admin/KnowledgeList'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useHeader } from '@/contexts/HeaderContext'
import type { KnowledgeBaseItem } from '@/hooks/useKnowledgeBase'
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase'
import { Database, Info } from 'lucide-react'
import { useEffect } from 'react'
import { toast } from 'sonner'

const KnowledgeBase = () => {
  const { setHeaderInfo } = useHeader();

  const {
    knowledgeItems,
    loading,
    error,
    isAdding,
    isDeleting,
    uploadProgress,
    addTextKnowledge,
    uploadFileKnowledge,
    deleteKnowledgeItem,
    fetchKnowledgeBase,
    getFileTypeFromMetadata,
    formatFileSize,
    downloadKnowledgeFile,
    getPreviewUrl,
  } = useKnowledgeBase();

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

  // Handle file upload
  const handleSubmitFile = async (file: File, title?: string, description?: string) => {
    try {
      await uploadFileKnowledge(file, title, description);
      toast.success('File uploaded successfully!', {
        description: `${file.name} has been processed and added to your knowledge base.`,
        duration: 4000,
      });
    } catch (error) {
      toast.error('Failed to upload file', {
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
    // For now, just show a toast with the content
    toast.info('View Content', {
      description: `Title: ${item.title}`,
      duration: 3000,
    });
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
          Knowledge Base supports two upload methods: <strong>Text Knowledge</strong> for direct input of business rules,
          and <strong>File Upload</strong> for documents (PDF, DOC, DOCX, TXT, CSV, XLSX).
          All uploads are processed using form-data format as specified in the API.
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
            onSubmitFile={handleSubmitFile}
            isLoading={isAdding}
            uploadProgress={uploadProgress}
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
            onPreview={handlePreview}
            onRefresh={fetchKnowledgeBase}
            isDeleting={isDeleting}
            formatFileSize={formatFileSize}
            getFileType={getFileTypeFromMetadata}
          />
        </TabsContent>
      </Tabs>

    </div>
  )
}

export default KnowledgeBase
