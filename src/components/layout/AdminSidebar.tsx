import {
  BarChart3,
  Settings,
  Shield,
  Users,
  FileText,
  Database,
} from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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

// Admin menu items
const adminItems = [
  {
    title: 'Dashboard',
    url: '/admin',
    icon: BarChart3,
  },
  {
    title: 'User Management',
    url: '/admin/users',
    icon: Users,
  },
  {
    title: 'System Reports',
    url: '/admin/reports',
    icon: FileText,
  },
  {
    title: 'Analytics',
    url: '/admin/analytics',
    icon: Database,
  },
];

// Admin settings
const adminSettingsItems = [
  {
    title: 'System Settings',
    url: '/admin/settings',
    icon: Settings,
  },
  {
    title: 'Security',
    url: '/admin/security',
    icon: Shield,
  },
];

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();

  const isActive = (url: string) => {
    if (url === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(url);
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/admin">
                <SidebarTrigger>
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-red-600 text-white">
                    <Shield className="size-4" />
                  </div>
                </SidebarTrigger>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">VPBank Admin</span>
                  <span className="truncate text-xs">Management Portal</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Admin Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Settings */}
        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminSettingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-red-600 text-white">
                <Shield className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Admin User</span>
                <span className="truncate text-xs">admin@vpbank.com</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  );
}
