import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';
import { menuItems } from '@/config/menu.items'; // Giả sử menuItems được tách ra file config
import { useAuth } from '@/contexts/AuthContext';
import { useConversation } from '@/contexts/ConversationContext';
import { useSidebarNavigation } from '@/hooks/useSidebarNavigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ChatSection } from './ChatSection';
import { ConversationHistory } from './ConversationHistory';
import { CustomSidebarHeader } from './CustomSidebarHeader';
import { EditTitleDialog } from './EditTitleDialog';
import { MainNavigation } from './MainNavigation';

export function DynamicSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  const { state, createNewConversation, loadConversations, deleteConversation, setCurrentConversation, updateConversationTitle } = useConversation();
  const { navigateToConversation, navigateAfterDelete } = useSidebarNavigation();

  const [editingConversation, setEditingConversation] = useState<{ id: string; title: string } | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user, loadConversations]);

  const handleNewChat = async () => {
    try {
      const newConversation = await createNewConversation();
      navigateToConversation(newConversation);
    } catch (error) {
      console.error('Failed to create new chat:', error);
    }
  };

  const handleDeleteConversation = async (conversationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await deleteConversation(conversationId);
      toast.success("Conversation deleted successfully", {
        description: "The conversation has been removed from your history",
        duration: 3000,
      });
      navigateAfterDelete(conversationId, state.conversations);
    } catch (error) {
      toast.error("Failed to delete conversation", {
        description: error instanceof Error ? error.message : "Please try again later",
        duration: 3000,
      });
    }
  };

  const handleChangeConversationTitle = (conversationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const conversation = state.conversations.find(c => c.conversationId === conversationId);
    if (conversation) {
      setShowEditDialog(true);
      setEditingConversation({ id: conversationId, title: conversation.title });
      setNewTitle(conversation.title);
    }
  };

  const handleSaveTitle = async () => {
    if (!editingConversation || !newTitle.trim()) return;
    try {
      await updateConversationTitle(editingConversation.id, newTitle.trim());
      setShowEditDialog(false);
      setEditingConversation(null);
      setNewTitle('');
      toast.success("Conversation title updated successfully", {
        duration: 3000,
      });
    } catch (error) {
      toast.error("Failed to update conversation title", {
        description: error instanceof Error ? error.message : "Please try again later",
        duration: 3000,
      });
      console.error('Failed to update conversation title:', error);
    }
  };

  const getBrandInfo = () => {
    if (user?.role === 'ADMIN') {
      return {
        title: 'VPBank Admin',
        subtitle: 'Admin Console',
        color: 'bg-blue-700'
      };
    }
    return {
      title: 'VPBank',
      subtitle: 'Hackathon Platform',
      color: 'bg-sidebar-primary'
    };
  };

  return (
    <>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <CustomSidebarHeader brandInfo={getBrandInfo()} />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="py-2">Chat</SidebarGroupLabel>
            <SidebarGroupContent>
              <ChatSection onNewChat={handleNewChat} loading={state.loading} />
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel className="py-2">Main</SidebarGroupLabel>
            <SidebarGroupContent>
              <MainNavigation menuItems={menuItems} userRole={user?.role} />
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <ConversationHistory
              conversations={state.conversations}
              loading={state.loading}
              onConversationClick={(conversation) => {
                setCurrentConversation(conversation);
                navigateToConversation(conversation);
              }}
              onEditTitle={handleChangeConversationTitle}
              onDelete={handleDeleteConversation}
            />
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <EditTitleDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        newTitle={newTitle}
        onTitleChange={setNewTitle}
        onSave={handleSaveTitle}
      />
    </>
  );
}