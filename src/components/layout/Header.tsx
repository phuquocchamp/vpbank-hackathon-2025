import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const { setTheme } = useTheme();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <div className="flex-1" />
      
      {/* User info */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-sm">
          <User className="size-4" />
          <span>{user?.name || user?.email}</span>
          <span className={`px-2 py-1 rounded-full text-xs ${
            user?.role === 'admin' 
              ? 'bg-red-100 text-red-700' 
              : 'bg-blue-100 text-blue-700'
          }`}>
            {user?.role}
          </span>
        </div>
        
        <Button variant="ghost" size="sm" onClick={logout}>
          <LogOut className="size-4" />
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Header;