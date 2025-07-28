import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/contexts/AuthContext';
import { router } from './router';
import { ConversationProvider } from '@/contexts/ConversationContext';
import { Toaster } from 'sonner';
import { HeaderProvider } from '@/contexts/HeaderContext';

const AppProvider = () => {
  return (
    <HeaderProvider>
      <ThemeProvider defaultTheme="system" storageKey="vpbank-ui-theme">
        <AuthProvider>
          <ConversationProvider>
            <RouterProvider router={router} />
            <Toaster
              position="top-center"
              richColors
            />
          </ConversationProvider>
        </AuthProvider>
      </ThemeProvider>
    </HeaderProvider>
  );
};

export default AppProvider;