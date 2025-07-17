import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Edit, FileText, Trash2, Upload } from 'lucide-react'
import { useEffect, useState } from 'react'

interface KnowledgeBaseItem {
  knowledgebaseId: string
  title: string
  description: string
  fileName: string
  createdAt: string
  updatedAt: string
  metadata: {
    bucket: string
    key: string
    fileType?: string
  }
}

interface ApiResponse {
  message: string
  items: KnowledgeBaseItem[]
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const KnowledgeBase = () => {
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeBaseItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newKnowledgeText, setNewKnowledgeText] = useState('')
  const [newKnowledgeTitle, setNewKnowledgeTitle] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')

  useEffect(() => {
    fetchKnowledgeBase()
  }, [])

  const fetchKnowledgeBase = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${BASE_URL}/admin/knowledge-bases`)
      if (!response.ok) {
        throw new Error('Failed to fetch knowledge base')
      }
      const data: ApiResponse = await response.json()
      setKnowledgeItems(data.items)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleAddTextKnowledge = () => {
    if (newKnowledgeTitle && newKnowledgeText) {
      const newItem: KnowledgeBaseItem = {
        knowledgebaseId: Date.now().toString(),
        title: newKnowledgeTitle,
        description: newKnowledgeText,
        fileName: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {
          bucket: '',
          key: '',
          fileType: 'text'
        }
      }
      setKnowledgeItems([...knowledgeItems, newItem])
      setNewKnowledgeTitle('')
      setNewKnowledgeText('')
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file);
      console.log('File selected:', selectedFile?.name)
      const newItem: KnowledgeBaseItem = {
        knowledgebaseId: Date.now().toString(),
        title: file.name,
        description: `File: ${file.name} (${file.size} bytes)`,
        fileName: file.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {
          bucket: '',
          key: '',
          fileType: file.type
        }
      }
      setKnowledgeItems([...knowledgeItems, newItem])
      setSelectedFile(null)
      event.target.value = ''
    }
  }

  const handleDelete = (id: string) => {
    setKnowledgeItems(knowledgeItems.filter(item => item.knowledgebaseId !== id))
  }

  const handleEdit = (item: KnowledgeBaseItem) => {
    setEditingId(item.knowledgebaseId)
    setEditTitle(item.title)
    setEditContent(item.description)
  }

  const handleSaveEdit = () => {
    if (editingId) {
      setKnowledgeItems(knowledgeItems.map(item =>
        item.knowledgebaseId === editingId
          ? { ...item, title: editTitle, description: editContent }
          : item
      ))
      setEditingId(null)
      setEditTitle('')
      setEditContent('')
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditTitle('')
    setEditContent('')
  }

  const getFileTypeFromMetadata = (item: KnowledgeBaseItem) => {
    return item.metadata.fileType || 'file'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Knowledge Base</h1>
        <p className="text-gray-600 mt-2">Welcome to the VPBank Admin Knowledge Base</p>
      </div>

      <Tabs defaultValue="add" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="add">Add Knowledge</TabsTrigger>
          <TabsTrigger value="manage">Manage Knowledge</TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="space-y-6">
          {/* Text Knowledge Section */}
          <Card>
            <CardHeader>
              <CardTitle>Add Business Rule / Knowledge Base</CardTitle>
              <CardDescription>
                Enter business rules, policies, or knowledge that the system should understand
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="knowledge-title">Title</Label>
                <Input
                  id="knowledge-title"
                  placeholder="Enter knowledge title..."
                  value={newKnowledgeTitle}
                  onChange={(e) => setNewKnowledgeTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="knowledge-content">Description</Label>
                <Textarea
                  id="knowledge-content"
                  placeholder="Enter your business rules or knowledge description here..."
                  value={newKnowledgeText}
                  onChange={(e) => setNewKnowledgeText(e.target.value)}
                  rows={6}
                />
              </div>
              <div className="flex items-center justify-center w-full">

                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500" />``
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF, DOC, TXT files</p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
              <Button onClick={handleAddTextKnowledge} className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                Add Knowledge
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage">
          {/* Knowledge Items Display */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Existing Knowledge Base</h2>

            {loading ? (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <p className="text-gray-500">Loading knowledge base...</p>
                </CardContent>
              </Card>
            ) : error ? (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <p className="text-red-500">Error: {error}</p>
                </CardContent>
              </Card>
            ) : knowledgeItems.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <p className="text-gray-500">No knowledge items found. Add some knowledge to get started.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {knowledgeItems.map((item) => (
                  <Card key={item.knowledgebaseId}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2">
                            {item.title}
                            <Badge variant="secondary">
                              {getFileTypeFromMetadata(item).toUpperCase()}
                            </Badge>
                          </CardTitle>
                          <CardDescription>Description: {item.description}</CardDescription>
                          <CardDescription>
                            Created: {new Date(item.createdAt).toLocaleDateString()}
                          </CardDescription>
                          <CardDescription>
                            Updated: {new Date(item.updatedAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(item.knowledgebaseId)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(item.knowledgebaseId)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default KnowledgeBase
