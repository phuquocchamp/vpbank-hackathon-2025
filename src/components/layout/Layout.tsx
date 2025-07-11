import { SidebarProvider } from '@/components/ui/sidebar';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import Header from './Header';

function ClientLayout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-hidden">
            <div className="h-full p-6 overflow-y-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default ClientLayout;