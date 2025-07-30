// Knowledge Base API Service
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Get authentication token from storage
const getAuthToken = (): string | null => {
  return localStorage.getItem('vpbank_id_token') || sessionStorage.getItem('vpbank_id_token');
};

// Create headers with authentication
const createHeaders = (includeContentType = false): HeadersInit => {
  const headers: HeadersInit = {};
  
  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }
  
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

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

export const knowledgeBaseService = {
  // Get all knowledge base items
  async fetchAll(): Promise<KnowledgeBaseItem[]> {
    const response = await fetch(`${BASE_URL}/admin/knowledge-bases`, {
      method: 'GET',
      headers: createHeaders(true),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication failed. Please login again.');
      }
      throw new Error(`Failed to fetch knowledge base: ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    return data.items || [];
  },

  // Add text-only knowledge
  async addText(title: string, description: string): Promise<void> {
    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('description', description.trim());

    const response = await fetch(`${BASE_URL}/admin/knowledge-bases`, {
      method: 'POST',
      headers: createHeaders(),
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication failed. Please login again.');
      }
      const errorText = await response.text();
      throw new Error(`Failed to add knowledge: ${response.status} - ${errorText}`);
    }
  },

  // Upload file with metadata
  async uploadFile(file: File, title?: string, description?: string): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title?.trim() || file.name);
    formData.append('description', description?.trim() || `Uploaded file: ${file.name}`);

    const response = await fetch(`${BASE_URL}/admin/knowledge-bases`, {
      method: 'POST',
      headers: createHeaders(),
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication failed. Please login again.');
      }
      const errorText = await response.text();
      throw new Error(`Failed to upload file: ${response.status} - ${errorText}`);
    }
  },

  // Delete knowledge base item
  async delete(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/admin/knowledge-bases/${id}`, {
      method: 'DELETE',
      headers: createHeaders(true),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication failed. Please login again.');
      }
      const errorText = await response.text();
      throw new Error(`Failed to delete knowledge: ${response.status} - ${errorText}`);
    }
  },

  // Validate file before upload
  validateFile(file: File): { isValid: boolean; error?: string } {
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
  },

  // Format file size utility
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Get file type from metadata
  getFileType(item: KnowledgeBaseItem): string {
    return item.metadata.fileType || 'file';
  }
};
