import { createContext, useCallback, useContext, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
interface Message {
  id: string;
  content: string | {
    sql?: string;
    database?: string;
    message: string;
  };
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface Conversation {
  conversationId: string;
  userId: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

interface ConversationState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  loading: boolean;
  error: string | null;
}

type ConversationAction =
  | { type: 'SET_CONVERSATIONS'; payload: Conversation[] }
  | { type: 'SET_CURRENT_CONVERSATION'; payload: Conversation }
  | { type: 'CREATE_CONVERSATION'; payload: Conversation }
  | { type: 'UPDATE_CONVERSATION'; payload: Conversation }
  | { type: 'DELETE_CONVERSATION'; payload: string }
  | { type: 'ADD_MESSAGE'; payload: { conversationId: string; message: Message } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_CURRENT_CONVERSATION' };

const initialState: ConversationState = {
  conversations: [],
  currentConversation: null,
  loading: false,
  error: null,
};

const conversationReducer = (state: ConversationState, action: ConversationAction): ConversationState => {
  switch (action.type) {
    case 'SET_CONVERSATIONS':
      return { ...state, conversations: Array.isArray(action.payload) ? action.payload : [] };
    case 'SET_CURRENT_CONVERSATION':
      return { ...state, currentConversation: action.payload };
    case 'CREATE_CONVERSATION':
      return {
        ...state,
        conversations: [action.payload, ...(state.conversations || [])],
        currentConversation: action.payload,
      };
    case 'UPDATE_CONVERSATION':
      return {
        ...state,
        conversations: state.conversations.map(conv =>
          conv.conversationId === action.payload.conversationId ? action.payload : conv
        ),
        currentConversation: state.currentConversation?.conversationId === action.payload.conversationId
          ? action.payload
          : state.currentConversation,
      };
    case 'DELETE_CONVERSATION':
      return {
        ...state,
        conversations: state.conversations.filter(conv => conv.conversationId !== action.payload),
        currentConversation: state.currentConversation?.conversationId === action.payload
          ? null
          : state.currentConversation,
      };
    case 'ADD_MESSAGE':
      return {
        ...state,
        conversations: state.conversations.map(conv =>
          conv.conversationId === action.payload.conversationId
            ? { ...conv, messages: [...conv.messages, action.payload.message], updatedAt: new Date() }
            : conv
        ),
        currentConversation: state.currentConversation?.conversationId === action.payload.conversationId
          ? {
            ...state.currentConversation,
            messages: [...state.currentConversation.messages, action.payload.message],
            updatedAt: new Date(),
          }
          : state.currentConversation,
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_CURRENT_CONVERSATION':
      return { ...state, currentConversation: null };
    default:
      return state;
  }
};

interface ConversationContextType {
  state: ConversationState;
  createNewConversation: () => Promise<Conversation>;
  loadConversation: (id: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
  loadConversations: () => Promise<void>;
  updateConversationTitle: (id: string, title: string) => Promise<void>;
  setCurrentConversation: (conversation: Conversation | null) => void;
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export const ConversationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(conversationReducer, initialState);
  const { user, isLoading: authLoading } = useAuth();

  const userId = user?.id;
  const co_code_ld = user?.co_code_ld;

  console.log('ConversationProvider user:', userId, co_code_ld);


  const createNewConversation = useCallback(async (): Promise<Conversation> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Wait for auth to finish loading
      if (authLoading) {
        throw new Error('Authentication still loading');
      }

      if (!user || !user.id) {
        throw new Error('User not authenticated');
      }
      const newConversation = {
        conversationId: uuidv4(),
        title: 'New Chat',
        userId: user.id,
        co_code_ld: user.co_code_ld
      };

      const response = await fetch(`${API_BASE_URL}/admin/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConversation),
      });

      if (!response.ok) throw new Error('Failed to create conversation');

      const createdConversation = await response.json();
      dispatch({ type: 'CREATE_CONVERSATION', payload: createdConversation });

      return createdConversation;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [user, authLoading]);

  const setCurrentConversation = useCallback((conversation: Conversation | null) => {
    if (conversation) {
      dispatch({ type: 'SET_CURRENT_CONVERSATION', payload: conversation });
    } else {
      dispatch({ type: 'CLEAR_CURRENT_CONVERSATION' });
    }
  }, []);

  const loadConversation = useCallback(async (id: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // First check if conversation exists in current state
      const existingConversation = state.conversations.find(conv => conv.conversationId === id);
      if (existingConversation) {
        dispatch({ type: 'SET_CURRENT_CONVERSATION', payload: existingConversation });
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      // If not found, fetch from API
      const response = await fetch(`${API_BASE_URL}/admin/conversations?id=${id}`);
      if (!response.ok) throw new Error('Failed to load conversation');

      const data = await response.json();
      const rawConversation = data.conversations && data.conversations.length > 0 ? data.conversations[0] : null;

      if (rawConversation) {
        const conversation: Conversation = {
          ...rawConversation,
          createdAt: new Date(rawConversation.createdAt),
          updatedAt: new Date(rawConversation.updatedAt),
          messages: rawConversation.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        };

        dispatch({ type: 'SET_CURRENT_CONVERSATION', payload: conversation });
      } else {
        throw new Error('Conversation not found');
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.conversations]);

  const sendMessage = useCallback(async (conversationId: string, content: string): Promise<void> => {
    const userMessage: Message = {
      id: uuidv4(),
      content: content,
      role: 'user',
      timestamp: new Date(),
    };

    dispatch({ type: 'ADD_MESSAGE', payload: { conversationId, message: userMessage } });

    try {
      // Get the vpbank_id_token from localStorage
      const vpbankIdToken = localStorage.getItem('vpbank_id_token');
      
      const response = await fetch(`${API_BASE_URL}/admin/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${vpbankIdToken}` // Include the token in the request headers
        },
        body: JSON.stringify({ content: content, idToken: vpbankIdToken }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const data = await response.json();

      // Process the response structure
      if (data.assistant) {
        const assistantMessage: Message = {
          id: data.assistant.id,
          content: data.assistant.content, // This can be string or object
          role: data.assistant.role,
          timestamp: new Date(data.assistant.timestamp),
        };

        dispatch({ type: 'ADD_MESSAGE', payload: { conversationId, message: assistantMessage } });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
    }
  }, []);

  const deleteConversation = useCallback(async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/conversations/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete conversation');

      dispatch({ type: 'DELETE_CONVERSATION', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
    }
  }, []);

  const updateConversationTitle = useCallback(async (id: string, title: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/conversations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) throw new Error('Failed to update conversation title');

      const updatedConversation = await response.json();
      dispatch({ type: 'UPDATE_CONVERSATION', payload: updatedConversation });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  }, []);

  const loadConversations = useCallback(async (): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await fetch(`${API_BASE_URL}/admin/conversations`);
      if (!response.ok) throw new Error('Failed to load conversations');

      const data = await response.json();
      // Extract conversations array from API response and parse dates
      const rawConversations = data.conversations || [];
      const conversations = rawConversations.map((conv: any) => ({
        ...conv,
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt),
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));

      dispatch({ type: 'SET_CONVERSATIONS', payload: conversations });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  return (
    <ConversationContext.Provider
      value={{
        state,
        createNewConversation,
        loadConversation,
        sendMessage,
        deleteConversation,
        loadConversations,
        updateConversationTitle,
        setCurrentConversation,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

export const useConversation = () => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error('useConversation must be used within a ConversationProvider');
  }
  return context;
};

// Add new hook for handling navigation
export const useConversationWithNavigation = () => {
  const conversation = useConversation();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();

  const createNewConversationAndNavigate = useCallback(async () => {
    try {
      if (authLoading) {
        console.log('Still loading authentication...');
        return;
      }

      if (!user) {
        console.error('User not authenticated');
        throw new Error('User not authenticated');
      }

      const newConversation = await conversation.createNewConversation();
      // Navigate using the ID from API response
      navigate(`/admin/conversations/${newConversation.conversationId}`);
      return newConversation;
    } catch (error) {
      console.error('Failed to create and navigate to new conversation:', error);
      throw error;
    }
  }, [conversation.createNewConversation, navigate, user, authLoading]);

  return {
    ...conversation,
    createNewConversationAndNavigate,
  };
};