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
    (deletedId: string, conversations: Conversation[], currentPath?: string) => {
      // Filter out the deleted conversation to get remaining ones
      const remainingConversations = conversations.filter(c => c.conversationId !== deletedId);

      // Only navigate if we're currently viewing the deleted conversation
      const isViewingDeletedConversation = currentPath?.includes(deletedId);

      if (isViewingDeletedConversation) {
        if (remainingConversations.length > 0) {
          // Navigate to the most recent conversation (first in the list)
          navigateToConversation(remainingConversations[0]);
        } else {
          // No conversations left, navigate to home
          navigate(getHomePath());
        }
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