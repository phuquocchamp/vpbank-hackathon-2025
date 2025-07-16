import { useAuth } from '@/contexts/AuthContext';
import { useConversation } from '@/contexts/ConversationContext';
import {
  Activity,
  BarChart3,
  Database,
  FileText,
  HelpCircle,
  Home,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Trash2,
  Users
} from 'lucide-react';
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
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
  const { state, createNewConversation, loadConversations, deleteConversation } = useConversation();
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
      navigate(`/admin/conversations/${newConversation.id}`);
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

  const formatDate = (date: Date | string) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return '';
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - dateObj.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return dateObj.toLocaleDateString();
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
        color: 'bg-red-600'
      };
    }
    return {
      title: 'VPBank',
      subtitle: 'Hackathon Platform',
      color: 'bg-sidebar-primary'
    };
  };

  const brandInfo = getBrandInfo();
  console.log("Conversations", state.conversations);
  console.log('Conversations', state.conversations.length);

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
            <SidebarGroupLabel>Chat</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <Button
                    onClick={handleNewChat}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    disabled={state.loading}
                  >
                    <Plus className="size-4 mr-2" />
                    New Chat
                  </Button>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Conversation History for Admin */}

        {user?.role === 'ADMIN' && state.conversations.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Recent Conversations</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {state.conversations.slice(0, 10).map((conversation) => (
                  <SidebarMenuItem key={conversation.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === `/admin/conversations/${conversation.id}`}
                      tooltip={conversation.title}
                    >
                      <Link to={`/admin/conversations/${conversation.id}`} className="group">
                        <MessageCircle className="size-4" />
                        <div className="flex-1 min-w-0">
                          <div className="truncate text-sm font-medium">
                            {conversation.title}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(conversation.updatedAt)}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="size-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => handleDeleteConversation(conversation.id, e)}
                              className="text-red-600"
                            >
                              <Trash2 className="size-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
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
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}