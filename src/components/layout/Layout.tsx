import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { DynamicSidebar } from '@/components/sidebar/DynamicSidebar';
import Header from './Header';

const Layout = () => {
  return (
    <SidebarProvider>
      <DynamicSidebar />
      <SidebarInset className="flex flex-col w-full min-w-0 h-screen">
        <Header />
        <div className="flex flex-1 flex-col p-4 w-full min-w-0 overflow-y-auto">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;