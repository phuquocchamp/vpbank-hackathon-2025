import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Database } from 'lucide-react'
import { useEffect } from 'react'
import { useHeader } from '@/contexts/HeaderContext'
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase'
import KnowledgeForm from '@/components/admin/KnowledgeForm'
import KnowledgeList from '@/components/admin/KnowledgeList'
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
  } = useKnowledgeBase();

  // Set header info for knowledge base page
  useEffect(() => {
    setHeaderInfo({
      title: 'Knowledge Base',
      description: 'Manage and organize knowledge assets',
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

  return (
    <div className="space-y-6">
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
