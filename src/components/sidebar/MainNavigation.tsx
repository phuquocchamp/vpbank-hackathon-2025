import { Link, useLocation } from 'react-router-dom';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';

interface MenuItem {
  title: string;
  url: string;
  icon: any;
  badge?: string;
  roles: ('USER' | 'ADMIN')[];
}

interface MainNavigationProps {
  menuItems: MenuItem[];
  userRole: 'USER' | 'ADMIN' | undefined;
}

export function MainNavigation({ menuItems, userRole }: MainNavigationProps) {
  const location = useLocation();

  const isActive = (url: string) => {
    if (url === '/client' && userRole === 'USER') {
      return location.pathname === '/' || location.pathname === '/client';
    }
    if (url === '/admin' && userRole === 'ADMIN') {
      return location.pathname === '/' || location.pathname === '/admin';
    }
    return location.pathname.startsWith(url);
  };

  const filteredItems = menuItems.filter(item => item.roles.includes(userRole || 'USER'));

  return (
    <SidebarMenu className="space-y-1">
      {filteredItems.map((item) => (
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
  );
}