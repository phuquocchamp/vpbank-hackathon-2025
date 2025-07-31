import { createContext, useCallback, useContext, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export interface Message {
  id: string;
  content: string | {
    sql?: string;
    database?: string;
    message: string;
  };
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface Conversation {
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
  | { type: 'UPDATE_MESSAGE'; payload: { conversationId: string; messageId: string; message: Message } }
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
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        conversations: state.conversations.map(conv =>
          conv.conversationId === action.payload.conversationId
            ? {
              ...conv,
              messages: conv.messages.map(msg =>
                msg.id === action.payload.messageId ? action.payload.message : msg
              ),
              updatedAt: new Date()
            }
            : conv
        ),
        currentConversation: state.currentConversation?.conversationId === action.payload.conversationId
          ? {
            ...state.currentConversation,
            messages: state.currentConversation.messages.map(msg =>
              msg.id === action.payload.messageId ? action.payload.message : msg
            ),
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
  updateMessage: (conversationId: string, messageId: string, sql: string, database: string) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
  loadConversations: () => Promise<void>;
  updateConversationTitle: (id: string, title: string) => Promise<void>;
  setCurrentConversation: (conversation: Conversation | null) => void;
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export const ConversationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(conversationReducer, initialState);
  const { user, isLoading: authLoading } = useAuth();

  // const userId = user?.id;
  // const co_code_ld = user?.co_code_ld;
  const isAdmin = user?.role === 'ADMIN';

  // Determine API endpoint based on user role
  const getConversationEndpoint = useCallback(() => {
    return isAdmin ? '/admin/conversations' : '/client/conversations';
  }, [isAdmin]);

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

      const newConversation: any = {
        conversationId: uuidv4(),
        title: 'New Chat',
        userId: user.id,
      };

      // Add co_code_ld only for CLIENT users
      if (!isAdmin && user.co_code_ld) {
        newConversation.co_code_ld = user.co_code_ld;
      }

      const response = await fetch(`${API_BASE_URL}${getConversationEndpoint()}`, {
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
  }, [user, authLoading, isAdmin, getConversationEndpoint]);

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

      // If not found, fetch from API - use dynamic endpoint
      const response = await fetch(`${API_BASE_URL}${getConversationEndpoint()}?id=${id}`);
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
  }, [state.conversations, getConversationEndpoint]);

  const sendMessage = useCallback(async (conversationId: string, content: string): Promise<void> => {
    const userMessage: Message = {
      id: uuidv4(),
      content: content,
      role: 'user',
      timestamp: new Date(),
    };

    dispatch({ type: 'ADD_MESSAGE', payload: { conversationId, message: userMessage } });

    try {
      const vpbankIdToken = localStorage.getItem('vpbank_id_token');

      const endpoint = `${API_BASE_URL}${getConversationEndpoint()}/${conversationId}/messages`;

      const requestBody: any = {
        content: content,
        idToken: vpbankIdToken
      };

      // Add co_code_ld for CLIENT users
      if (!isAdmin && user?.co_code_ld) {
        requestBody.co_code_ld = user.co_code_ld;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${vpbankIdToken}`
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const data = await response.json();

      if (data.assistant) {
        const assistantMessage: Message = {
          id: data.assistant.id,
          content: data.assistant.content,
          role: data.assistant.role,
          timestamp: new Date(data.assistant.timestamp),
        };

        dispatch({ type: 'ADD_MESSAGE', payload: { conversationId, message: assistantMessage } });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
    }
  }, [isAdmin, user?.co_code_ld, getConversationEndpoint]);

  const deleteConversation = useCallback(async (id: string): Promise<void> => {
    try {
      const vpbankIdToken = localStorage.getItem('vpbank_id_token');

      const response = await fetch(`${API_BASE_URL}${getConversationEndpoint()}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${vpbankIdToken}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete conversation');

      dispatch({ type: 'DELETE_CONVERSATION', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
    }
  }, [getConversationEndpoint]);

  const updateConversationTitle = useCallback(async (id: string, title: string): Promise<void> => {
    try {
      const vpbankIdToken = localStorage.getItem('vpbank_id_token');

      // Find current conversation to preserve messages
      const currentConv = state.conversations.find(conv => conv.conversationId === id);

      const response = await fetch(`${API_BASE_URL}${getConversationEndpoint()}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${vpbankIdToken}`
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) throw new Error('Failed to update conversation title');

      const updatedConversation = await response.json();

      // Merge with existing conversation to preserve messages
      const mergedConversation = {
        ...currentConv,
        ...updatedConversation,
        messages: currentConv?.messages || updatedConversation.messages || []
      };

      dispatch({ type: 'UPDATE_CONVERSATION', payload: mergedConversation });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
      throw error;
    }
  }, [getConversationEndpoint, state.conversations]);

  const loadAllConversations = useCallback(async (): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const vpbankIdToken = localStorage.getItem('vpbank_id_token');

      const response = await fetch(`${API_BASE_URL}${getConversationEndpoint()}`, {
        headers: {
          'Authorization': `Bearer ${vpbankIdToken}`
        }
      });

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
  }, [getConversationEndpoint]);

  const updateMessage = useCallback(async (conversationId: string, messageId: string, sql: string, database: string): Promise<void> => {
    try {
      const vpbankIdToken = localStorage.getItem('vpbank_id_token');

      if (!vpbankIdToken) {
        throw new Error('Authentication token not found');
      }

      const endpoint = `${API_BASE_URL}${getConversationEndpoint()}/${conversationId}/messages/${messageId}`;

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${vpbankIdToken}`,
        },
        body: JSON.stringify({
          database: database,
          sql: sql
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Update the message in local state with the response data
      const updatedMessage: Message = {
        id: result.id,
        content: result.content,
        role: result.role,
        timestamp: new Date(result.timestamp),
      };

      dispatch({
        type: 'UPDATE_MESSAGE',
        payload: {
          conversationId,
          messageId,
          message: updatedMessage
        }
      });

    } catch (error) {
      console.error('Failed to update message:', error);
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update message' });
      throw error;
    }
  }, [getConversationEndpoint]);

  return (
    <ConversationContext.Provider
      value={{
        state,
        createNewConversation,
        loadConversation,
        sendMessage,
        updateMessage,
        deleteConversation,
        loadConversations: loadAllConversations,
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

      // Navigate based on user role
      const path = user.role === 'ADMIN'
        ? `/admin/conversations/${newConversation.conversationId}`
        : `/client/conversations/${newConversation.conversationId}`;

      navigate(path);
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