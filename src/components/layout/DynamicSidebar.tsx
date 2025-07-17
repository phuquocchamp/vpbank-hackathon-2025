import { useAuth } from '@/contexts/AuthContext';
import { useConversation } from '@/contexts/ConversationContext';
import {
  Activity,
  BarChart3,
  Database,
  Edit,
  FileText,
  HelpCircle,
  History,
  Home,
  MessageCircle,
  Minus,
  MoreHorizontal,
  Plus,
  Trash2,
  Users
} from 'lucide-react';
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { ADMIN_ROUTES, CLIENT_ROUTES } from '@/config/routes';

interface MenuItem {
  title: string;
  url: string;
  icon: any;
  badge?: string;
  roles: ('USER' | 'ADMIN')[];
}

// Define menu items with role-based access
const menuItems: MenuItem[] = [
  // User/Client items
  {
    title: 'Dashboard',
    url: '/client',
    icon: Home,
    roles: ['USER']
  },
  {
    title: 'Conversations',
    url: CLIENT_ROUTES.CONVERSATION,
    icon: MessageCircle,
    roles: ['USER']
  },
  {
    title: 'Analytics',
    url: CLIENT_ROUTES.ANALYTICS,
    icon: BarChart3,
    roles: ['USER']
  },

  // Admin items
  {
    title: 'Admin Dashboard',
    url: ADMIN_ROUTES.ADMIN,
    icon: Activity,
    roles: ['ADMIN']
  },
  {
    title: 'User Management',
    url: ADMIN_ROUTES.USERS,
    icon: Users,
    roles: ['ADMIN']
  },
  {
    title: 'Knowledge Base',
    url: ADMIN_ROUTES.KNOWLEDGE_BASE,
    icon: Database,
    roles: ['ADMIN']
  },
  {
    title: 'System Reports',
    url: ADMIN_ROUTES.REPORTS,
    icon: FileText,
    roles: ['ADMIN']
  },
  {
    title: 'Help & Support',
    url: ADMIN_ROUTES.HELP,
    icon: HelpCircle,
    roles: ['ADMIN']
  }
];

export function DynamicSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  const { state, createNewConversation, loadConversations, deleteConversation, setCurrentConversation } = useConversation();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      loadConversations();
    }
  }, [user, loadConversations]);

  const isActive = (url: string) => {
    if (url === '/client' && user?.role === 'USER') {
      return location.pathname === '/' || location.pathname === '/client';
    }
    if (url === '/admin' && user?.role === 'ADMIN') {
      return location.pathname === '/' || location.pathname === '/admin';
    }
    return location.pathname.startsWith(url);
  };

  const handleNewChat = async () => {
    try {
      const newConversation = await createNewConversation();
      navigate(`/admin/conversations/${newConversation.conversationId}`);
    } catch (error) {
      console.error('Failed to create new chat:', error);
    }
  };

  const handleDeleteConversation = async (conversationId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      await deleteConversation(conversationId);
      if (location.pathname === `/admin/conversations/${conversationId}`) {
        navigate('/admin');
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  const handleChangeConversationTitle = async (conversationId: string, event: React.MouseEvent) => {
    //   event.preventDefault();
    //   event.stopPropagation();

    //   // You can implement this function based on your conversation context
    //   // For now, it's just a placeholder
    //   const newTitle = prompt('Enter new title:');
    //   if (newTitle) {
    //     // Implement the logic to update conversation title
    //     // This might require adding an updateConversationTitle function to your conversation context
    //     console.log('Updating conversation title:', conversationId, newTitle);
    //   }
  };

  const handleConversationClick = (conversation: any) => {
    setCurrentConversation(conversation);
    navigate(`/admin/conversations/${conversation.conversationId}`);
  };

  // Filter menu items based on user role
  const filteredMainItems = menuItems.filter(item =>
    item.roles.includes(user?.role || 'USER')
  );

  // Get brand info based on role
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

  const brandInfo = getBrandInfo();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to={user?.role === 'ADMIN' ? '/admin' : '/client'}>
                <SidebarTrigger>
                  <div className={`flex aspect-square size-8 items-center justify-center rounded-lg ${brandInfo.color} text-white`}>
                    <BarChart3 className="size-4" />
                  </div>
                </SidebarTrigger>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{brandInfo.title}</span>
                  <span className="truncate text-xs">{brandInfo.subtitle}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Admin Chat Section */}
        {user?.role === 'ADMIN' && (
          <SidebarGroup>
            <SidebarGroupLabel className="py-2">Chat</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <Button
                    onClick={handleNewChat}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start py-3 px-3 h-auto"
                    disabled={state.loading}
                  >
                    <Plus className="size-4 mr-3" />
                    New Chat
                  </Button>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="py-2">Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {filteredMainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                    className="py-3 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                  >
                    <Link to={item.url}>
                      <item.icon className="size-4" />
                      <span className="ml-3">{item.title}</span>
                      {item.badge && (
                        <span className="ml-auto text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Conversation History for Admin */}
        {user?.role === 'ADMIN' && (
          <SidebarGroup>
            <SidebarMenu>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="py-3">
                      <History className="size-4" />
                      Recent Conversations
                      {state.loading && (
                        <div className="ml-auto animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                      )}
                      <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                      <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="space-y-2">
                      {state.conversations && state.conversations.length > 0 ? (
                        state.conversations.slice(0, 10).map((conversation) => (
                          <SidebarMenuSubItem key={conversation.conversationId} className="mx-1">
                            <SidebarMenuSubButton
                              onClick={() => handleConversationClick(conversation)}
                              isActive={location.pathname === `/admin/conversations/${conversation.conversationId}`}
                              className="group cursor-pointer py-3 px-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                            >
                              <MessageCircle className="size-4 flex-shrink-0" />
                              <div className="flex-1 min-w-0 ml-3">
                                <div className="truncate text-xs font-medium leading-3">
                                  {conversation.title}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {conversation.messages.length} messages
                                </div>
                              </div>
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
                                    onClick={(e: React.MouseEvent) => handleChangeConversationTitle(conversation.conversationId, e)}
                                    className="text-blue-600"
                                  >
                                    <Edit className="size-4 mr-2" />
                                    Change Title
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e: React.MouseEvent) => handleDeleteConversation(conversation.conversationId, e)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="size-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))
                      ) : (
                        <SidebarMenuSubItem>
                          <div className="px-4 py-2 text-sm text-muted-foreground">
                            {state.loading ? 'Loading conversations...' : 'No conversations yet'}
                          </div>
                        </SidebarMenuSubItem>
                      )}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroup>
        )}

      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}