import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { Conversation } from '@/contexts/ConversationContext';

export function useSidebarNavigation() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const getHomePath = useCallback(() => {
    return user?.role === 'ADMIN' ? '/admin' : '/client';
  }, [user?.role]);

  const navigateToConversation = useCallback(
    (conversation: Conversation) => {
      const path = user?.role === 'ADMIN'
        ? `/admin/conversations/${conversation.conversationId}`
        : `/client/conversations/${conversation.conversationId}`;
      navigate(path);
    },
    [navigate, user?.role]
  );

  const navigateAfterDelete = useCallback(
    (deletedId: string, conversations: Conversation[]) => {
      const remainingConversations = conversations.filter(c => c.conversationId !== deletedId);
      if (remainingConversations.length > 0) {
        navigateToConversation(remainingConversations[0]);
      } else {
        navigate(getHomePath());
      }
    },
    [navigate, navigateToConversation, getHomePath]
  );

  return {
    getHomePath,
    navigateToConversation,
    navigateAfterDelete,
  };
}