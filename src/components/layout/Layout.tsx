import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { DynamicSidebar } from './DynamicSidebar';
import Header from './Header';

const Layout = () => {
  return (
    <SidebarProvider>
      <DynamicSidebar />
      <SidebarInset className="flex flex-col w-full min-w-0">
        <Header />
        <div className="flex flex-1 flex-col gap-4 p-4 w-full min-w-0 overflow-hidden">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;