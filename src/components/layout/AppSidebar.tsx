import {
  BarChart3,
  // Bell,
  // Calendar,
  // FileText,
  // HelpCircle,
  Home,
  // Inbox,
  MessageCircle,
  // Search,
  // Settings,
  Users,
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
import { ROUTES } from '@/config/routes';

// Menu items.
const items = [
  {
    title: 'Dashboard',
    url: ROUTES.DASHBOARD,
    icon: Home,
  },
  {
    title: 'Conversations',
    url: ROUTES.CONVERSATION,
    icon: MessageCircle,
  },
  {
    title: 'Analytics',
    url: '/analytics',
    icon: BarChart3,
  },
  // {
  //   title: 'Users',
  //   url: '/users',
  //   icon: Users,
  // },
  // {
  //   title: 'Reports',
  //   url: '/reports',
  //   icon: FileText,
  // },
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
    if (url === ROUTES.HOME || url === ROUTES.DASHBOARD) {
      return location.pathname === ROUTES.HOME || location.pathname === ROUTES.DASHBOARD;
    }
    return location.pathname.startsWith(url);
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to={ROUTES.HOME}>
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

        {/* Application */}
        {/* <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {appItems.map((item) => (
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
                        <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> */}

        {/* Settings */}
        {/* <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
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
        </SidebarGroup> */}
      </SidebarContent>

      <SidebarFooter>
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
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  );
}
