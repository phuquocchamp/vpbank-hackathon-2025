import type { Conversation } from '@/contexts/ConversationContext';
import { ChevronDown, Edit, History, MessageCircle, Minus, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';

interface ConversationHistoryProps {
  conversations: Conversation[];
  loading: boolean;
  onConversationClick: (conversation: Conversation) => void;
  onEditTitle: (conversationId: string, event: React.MouseEvent) => void;
  onDelete: (conversationId: string, event: React.MouseEvent) => void;
}

export function ConversationHistory({
  conversations,
  loading,
  onConversationClick,
  onEditTitle,
  onDelete,
}: ConversationHistoryProps) {
  const location = useLocation();
  const [itemsToShow, setItemsToShow] = useState(10);
  const ITEMS_PER_PAGE = 10;

  const hasMoreItems = conversations && conversations.length > itemsToShow;
  const displayedConversations = conversations?.slice(0, itemsToShow) || [];

  const loadMore = () => {
    setItemsToShow(prev => prev + ITEMS_PER_PAGE);
  };

  const showLess = () => {
    setItemsToShow(ITEMS_PER_PAGE);
  };

  const handleEditTitle = (conversationId: string, event: React.MouseEvent) => {
    onEditTitle(conversationId, event);

  };

  const handleDelete = (conversationId: string, event: React.MouseEvent) => {
    // Remove the toast.promise wrapper since it's handled in the parent component
    onDelete(conversationId, event);
  };

  return (
    <SidebarMenu>
      <Collapsible defaultOpen className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton className="py-3">
              <History className="size-4" />
              Recent Conversations
              {loading && (
                <div className="ml-auto animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
              )}
              <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
              <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub className="space-y-2">
              {conversations && conversations.length > 0 ? (
                <>
                  {displayedConversations.map((conversation) => (
                    <SidebarMenuSubItem key={conversation.conversationId} className="mx-1">
                      <SidebarMenuSubButton
                        onClick={() => onConversationClick(conversation)}
                        isActive={location.pathname.includes(conversation.conversationId)}
                        className="group cursor-pointer py-3 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                      >
                        {/* Icon and title */}
                        <MessageCircle className="size-4 flex-shrink-0" />
                        <div className="flex-1 min-w-0 ml-3">
                          <div className="truncate text-xs font-medium leading-3">
                            {conversation.title}
                          </div>
                          <div className="truncate text-xs leading-4">
                            {conversation.messages.length} messages
                          </div>
                        </div>

                        {/* Edit | Delete options */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <DropdownMenuItem
                              onClick={(e: React.MouseEvent) => handleEditTitle(conversation.conversationId, e)}
                              className="text-blue-600"
                            >
                              <Edit className="size-4 mr-2" />
                              Change Title
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e: React.MouseEvent) => handleDelete(conversation.conversationId, e)}
                              className="text-red-600"
                            >
                              <Trash2 className="size-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}

                  {/* Load More / Show Less Controls */}
                  {(hasMoreItems || itemsToShow > ITEMS_PER_PAGE) && (
                    <SidebarMenuSubItem className="mx-1">
                      <div className="flex gap-2 px-3 py-2">
                        {hasMoreItems && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={loadMore}
                            className="flex-1 h-8 text-xs"
                          >
                            <ChevronDown className="size-3 mr-1" />
                            Load More ({conversations.length - itemsToShow} more)
                          </Button>
                        )}
                        {itemsToShow > ITEMS_PER_PAGE && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={showLess}
                            className="h-8 text-xs text-muted-foreground hover:text-foreground"
                          >
                            Show Less
                          </Button>
                        )}
                      </div>
                    </SidebarMenuSubItem>
                  )}
                </>
              ) : (
                <SidebarMenuSubItem>
                  <div className="px-4 py-2 text-sm text-muted-foreground">
                    {loading ? 'Loading conversations...' : 'No conversations yet'}
                  </div>
                </SidebarMenuSubItem>
              )}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>
  );
}