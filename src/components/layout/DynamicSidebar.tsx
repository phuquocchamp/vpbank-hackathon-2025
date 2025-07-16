import {
  BarChart3,
  Bell,
  Calendar,
  FileText,
  HelpCircle,
  Home,
  Inbox,
  MessageCircle,
  Search,
  Settings,
  Shield,
  Users,
  Database,
  Activity
} from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

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
import { CLIENT_ROUTES, ADMIN_ROUTES } from '@/config/routes';

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
  // {
  //   title: 'Security',
  //   url: '/admin/security',
  //   icon: Shield,
  //   roles: ['ADMIN']
  // },

  // // Shared items (both roles can access)
  // {
  //   title: 'Settings',
  //   url: '/settings',
  //   icon: Settings,
  //   roles: ['USER', 'ADMIN']
  // },
  {
    title: 'Help & Support',
    url: ADMIN_ROUTES.HELP,
    icon: HelpCircle,
    roles: ['ADMIN']
  }
];

const applicationItems: MenuItem[] = [
  {
    title: 'Search',
    url: '/search',
    icon: Search,
    roles: ['USER', 'ADMIN']
  },
  {
    title: 'Calendar',
    url: '/calendar',
    icon: Calendar,
    roles: ['USER', 'ADMIN']
  },
  {
    title: 'Inbox',
    url: '/inbox',
    icon: Inbox,
    badge: '12',
    roles: ['USER', 'ADMIN']
  },
  {
    title: 'Notifications',
    url: '/notifications',
    icon: Bell,
    roles: ['USER', 'ADMIN']
  }
];

export function DynamicSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (url: string) => {
    if (url === '/client' && user?.role === 'USER') {
      return location.pathname === '/' || location.pathname === '/client';
    }
    if (url === '/admin' && user?.role === 'ADMIN') {
      return location.pathname === '/' || location.pathname === '/admin';
    }
    return location.pathname.startsWith(url);
  };

  // Filter menu items based on user role
  const filteredMainItems = menuItems.filter(item =>
    item.roles.includes(user?.role || 'USER')
  );

  const filteredAppItems = applicationItems.filter(item =>
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

        {/* Application Items */}
        {filteredAppItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredAppItems.map((item) => (
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
        )}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}