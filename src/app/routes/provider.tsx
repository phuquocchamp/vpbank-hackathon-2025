import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/contexts/AuthContext';
import { router } from './router';
import { ConversationProvider } from '@/contexts/ConversationContext';

const AppProvider = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vpbank-ui-theme">
      <AuthProvider>
        <ConversationProvider>
          <RouterProvider router={router} />
        </ConversationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default AppProvider;