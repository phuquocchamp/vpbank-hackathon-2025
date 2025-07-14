import {
  BarChart3,
  // Bell,
  // Calendar,
  // FileText,
  // HelpCircle,
  Home,
  // Inbox,
  MessageCircle
} from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

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
import { CLIENT_ROUTES } from '@/config/routes';

// Menu items.
const items = [
  {
    title: 'Dashboard',
    url: CLIENT_ROUTES.DASHBOARD,
    icon: Home,
  },
  {
    title: 'Conversations',
    url: CLIENT_ROUTES.CONVERSATION,
    icon: MessageCircle,
  },
];

// Application items
// const appItems: { title: string; url: string; icon: any; badge?: string }[] = [
//   {
//     title: 'Search',
//     url: '/search',
//     icon: Search,
//   },
//   {
//     title: 'Calendar',
//     url: '/calendar',
//     icon: Calendar,
//   },
//   {
//     title: 'Inbox',
//     url: '/inbox',
//     icon: Inbox,
//     badge: '12',
//   },
// ];

// Settings items
// const settingsItems: { title: string; url: string; icon: any }[] = [
//   {
//     title: 'Notifications',
//     url: '/settings/notifications',
//     icon: Bell,
//   },
//   {
//     title: 'Settings',
//     url: '/settings',
//     icon: Settings,
//   },
//   {
//     title: 'Help & Support',
//     url: '/help',
//     icon: HelpCircle,
//   },
// ];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();

  const isActive = (url: string) => {
    if (url === CLIENT_ROUTES.HOME || url === CLIENT_ROUTES.DASHBOARD) {
      return location.pathname === CLIENT_ROUTES.HOME || location.pathname === CLIENT_ROUTES.DASHBOARD;
    }
    return location.pathname.startsWith(url);
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to={CLIENT_ROUTES.HOME}>
                <SidebarTrigger>
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <BarChart3 className="size-4" />
                  </div>
                </SidebarTrigger>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">VPBank</span>
                  <span className="truncate text-xs">Hackathon Platform</span>
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
              {items.map((item) => (
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

      {/* <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Users className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">VPBank User</span>
                <span className="truncate text-xs">user@vpbank.com</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter> */}
      
      <SidebarRail />
    </Sidebar>
  );
}
