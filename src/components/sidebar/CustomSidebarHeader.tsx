import { useAuth } from '@/contexts/AuthContext';
import { BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from '@/components/ui/sidebar';

interface SidebarHeaderProps {
  brandInfo: {
    title: string;
    subtitle: string;
    color: string;
  };
}

export function CustomSidebarHeader({ brandInfo }: SidebarHeaderProps) {
  const { user } = useAuth();

  return (
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
  );
}