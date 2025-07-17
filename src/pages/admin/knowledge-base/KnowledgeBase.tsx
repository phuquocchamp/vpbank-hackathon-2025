import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FileText, Trash2, Edit, Save, X } from 'lucide-react'

interface KnowledgeBaseItem {
  id: string
  title: string
  content: string
  type: 'text' | 'file'
  fileName?: string
  uploadedAt: Date
}

const KnowledgeBase = () => {
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeBaseItem[]>([
    {
      id: '1',
      title: 'Banking Regulations',
      content: 'Basic banking regulations and compliance requirements...',
      type: 'text',
      uploadedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      title: 'Customer Service Guidelines',
      content: 'Customer service best practices and procedures...',
      type: 'file',
      fileName: 'customer-service-guide.pdf',
      uploadedAt: new Date('2024-01-10')
    }
  ])

  const [newKnowledgeText, setNewKnowledgeText] = useState('')
  const [newKnowledgeTitle, setNewKnowledgeTitle] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')

  const handleAddTextKnowledge = () => {
    if (newKnowledgeTitle && newKnowledgeText) {
      const newItem: KnowledgeBaseItem = {
        id: Date.now().toString(),
        title: newKnowledgeTitle,
        content: newKnowledgeText,
        type: 'text',
        uploadedAt: new Date()
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
        id: Date.now().toString(),
        title: file.name,
        content: `File: ${file.name} (${file.size} bytes)`,
        type: 'file',
        fileName: file.name,
        uploadedAt: new Date()
      }
      setKnowledgeItems([...knowledgeItems, newItem])
      setSelectedFile(null)
      event.target.value = ''
    }
  }

  const handleDelete = (id: string) => {
    setKnowledgeItems(knowledgeItems.filter(item => item.id !== id))
  }

  const handleEdit = (item: KnowledgeBaseItem) => {
    setEditingId(item.id)
    setEditTitle(item.title)
    setEditContent(item.content)
  }

  const handleSaveEdit = () => {
    if (editingId) {
      setKnowledgeItems(knowledgeItems.map(item =>
        item.id === editingId
          ? { ...item, title: editTitle, content: editContent }
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

            {knowledgeItems.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <p className="text-gray-500">No knowledge items found. Add some knowledge to get started.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {knowledgeItems.map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {editingId === item.id ? (
                            <Input
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="mb-2"
                            />
                          ) : (
                            <CardTitle className="flex items-center gap-2">
                              {item.title}
                              <Badge variant={item.type === 'text' ? 'default' : 'secondary'}>
                                {item.type === 'text' ? 'Text' : 'File'}
                              </Badge>
                            </CardTitle>
                          )}
                          {item.fileName && (
                            <CardDescription>File: {item.fileName}</CardDescription>
                          )}
                          <CardDescription>
                            Uploaded: {item.uploadedAt.toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          {editingId === item.id ? (
                            <>
                              <Button size="sm" onClick={handleSaveEdit}>
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {editingId === item.id ? (
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={4}
                        />
                      ) : (
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {item.content.length > 200
                            ? `${item.content.substring(0, 200)}...`
                            : item.content
                          }
                        </p>
                      )}
                    </CardContent>
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
