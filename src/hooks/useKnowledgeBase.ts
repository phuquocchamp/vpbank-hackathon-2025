import { useState, useEffect } from 'react';

export interface KnowledgeBaseItem {
  knowledgebaseId: string;
  title: string;
  description: string;
  fileName: string;
  createdAt: string;
  updatedAt: string;
  metadata: {
    bucket: string;
    key: string;
    fileType?: string;
    fileSize?: number;
  };
}

export interface ApiResponse {
  message: string;
  items: KnowledgeBaseItem[];
}

export interface FileUploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useKnowledgeBase = () => {
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeBaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<FileUploadProgress | null>(null);

  // Get authentication token
  const getAuthToken = () => {
    return localStorage.getItem('vpbank_id_token') || sessionStorage.getItem('vpbank_id_token');
  };

  // Fetch all knowledge base items
  const fetchKnowledgeBase = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getAuthToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${BASE_URL}/admin/knowledge-bases`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        }
        throw new Error(`Failed to fetch knowledge base: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      setKnowledgeItems(data.items || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching knowledge base';
      setError(errorMessage);
      console.error('Fetch knowledge base error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Convert file to base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        // Remove data:type;base64, prefix
        const base64 = base64String.split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Validate file before upload
  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/json',
      'text/json',
      'application/xml',
      'text/xml',
      'text/markdown',
      'application/rtf',
      'text/rtf'
    ];

    if (file.size > maxSize) {
      return { isValid: false, error: 'File size must be less than 10MB' };
    }

    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'File type not supported. Please upload PDF, DOC, DOCX, TXT, CSV, or XLSX files.' };
    }

    return { isValid: true };
  };

  // Add text knowledge
  const addTextKnowledge = async (title: string, description: string) => {
    if (!title.trim() || !description.trim()) {
      throw new Error('Title and description are required');
    }

    setIsAdding(true);
    setError(null);

    try {
      const token = getAuthToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const payload = {
        title: title.trim(),
        description: description.trim(),
        file: "",
        fileName: null
      };

      const response = await fetch(`${BASE_URL}/admin/knowledge-bases`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        }
        throw new Error(`Failed to add knowledge base: ${response.status}`);
      }

      await fetchKnowledgeBase();
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add knowledge base';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsAdding(false);
    }
  };

  // Upload file knowledge
  const uploadFileKnowledge = async (file: File, title?: string, description?: string) => {
    const validation = validateFile(file);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    setIsAdding(true);
    setError(null);
    setUploadProgress({ loaded: 0, total: file.size, percentage: 0 });

    try {
      const base64File = await convertFileToBase64(file);
      
      const token = getAuthToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const payload = {
        title: title?.trim() || file.name,
        description: description?.trim() || `Uploaded file: ${file.name}`,
        file: base64File,
        fileName: file.name,
        metadata: {
          fileSize: file.size,
          fileType: file.type,
          lastModified: file.lastModified
        }
      };

      const response = await fetch(`${BASE_URL}/admin/knowledge-bases`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        }
        throw new Error(`Failed to upload file: ${response.status}`);
      }

      setUploadProgress({ loaded: file.size, total: file.size, percentage: 100 });
      await fetchKnowledgeBase();
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload file';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsAdding(false);
      setTimeout(() => setUploadProgress(null), 1000);
    }
  };

  // Delete knowledge base item
  const deleteKnowledgeItem = async (id: string) => {
    setIsDeleting(id);
    setError(null);

    try {
      const token = getAuthToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${BASE_URL}/admin/knowledge-bases/${id}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        }
        throw new Error(`Failed to delete knowledge base: ${response.status}`);
      }

      // Remove item from local state
      setKnowledgeItems(prev => prev.filter(item => item.knowledgebaseId !== id));
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete knowledge base';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsDeleting(null);
    }
  };

  // Get file type from metadata
  const getFileTypeFromMetadata = (item: KnowledgeBaseItem) => {
    return item.metadata.fileType || 'file';
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Initialize data on mount
  useEffect(() => {
    fetchKnowledgeBase();
  }, []);

  return {
    // State
    knowledgeItems,
    loading,
    error,
    isAdding,
    isDeleting,
    uploadProgress,
    
    // Actions
    fetchKnowledgeBase,
    addTextKnowledge,
    uploadFileKnowledge,
    deleteKnowledgeItem,
    
    // Utilities
    getFileTypeFromMetadata,
    formatFileSize,
    validateFile,
  };
};
