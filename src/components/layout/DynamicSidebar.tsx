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
  roles: ('user' | 'admin')[];
}

// Define menu items with role-based access
const menuItems: MenuItem[] = [
  // User/Client items
  {
    title: 'Dashboard',
    url: '/client',
    icon: Home,
    roles: ['user']
  },
  {
    title: 'Conversations',
    url: CLIENT_ROUTES.CONVERSATION,
    icon: MessageCircle,
    roles: ['user']
  },
  {
    title: 'Analytics',
    url: CLIENT_ROUTES.ANALYTICS,
    icon: BarChart3,
    roles: ['user']
  },
  
  // Admin items
  {
    title: 'Admin Dashboard',
    url: ADMIN_ROUTES.ADMIN,
    icon: Activity,
    roles: ['admin']
  },
  {
    title: 'User Management',
    url: ADMIN_ROUTES.USERS,
    icon: Users,
    roles: ['admin']
  },
  {
    title: 'System Reports',
    url: ADMIN_ROUTES.REPORTS,
    icon: FileText,
    roles: ['admin']
  },
  {
    title: 'System Analytics',
    url: ADMIN_ROUTES.ANALYTICS,
    icon: Database,
    roles: ['admin']
  },
  {
    title: 'Security',
    url: '/admin/security',
    icon: Shield,
    roles: ['admin']
  },
  
  // Shared items (both roles can access)
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
    roles: ['user', 'admin']
  },
  {
    title: 'Help & Support',
    url: '/help',
    icon: HelpCircle,
    roles: ['user', 'admin']
  }
];

const applicationItems: MenuItem[] = [
  {
    title: 'Search',
    url: '/search',
    icon: Search,
    roles: ['user', 'admin']
  },
  {
    title: 'Calendar',
    url: '/calendar',
    icon: Calendar,
    roles: ['user', 'admin']
  },
  {
    title: 'Inbox',
    url: '/inbox',
    icon: Inbox,
    badge: '12',
    roles: ['user', 'admin']
  },
  {
    title: 'Notifications',
    url: '/notifications',
    icon: Bell,
    roles: ['user', 'admin']
  }
];

export function DynamicSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (url: string) => {
    if (url === '/client' && user?.role === 'user') {
      return location.pathname === '/' || location.pathname === '/client';
    }
    if (url === '/admin' && user?.role === 'admin') {
      return location.pathname === '/' || location.pathname === '/admin';
    }
    return location.pathname.startsWith(url);
  };

  // Filter menu items based on user role
  const filteredMainItems = menuItems.filter(item => 
    item.roles.includes(user?.role || 'user')
  );

  const filteredAppItems = applicationItems.filter(item => 
    item.roles.includes(user?.role || 'user')
  );

  // Get brand info based on role
  const getBrandInfo = () => {
    if (user?.role === 'admin') {
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
              <Link to={user?.role === 'admin' ? '/admin' : '/client'}>
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