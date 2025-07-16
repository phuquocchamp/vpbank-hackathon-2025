import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/contexts/AuthContext';
import { router } from './app/routes/router';
import { ConversationProvider } from './contexts/ConversationContext';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vpbank-ui-theme">
      <AuthProvider>
        <ConversationProvider>
          <RouterProvider router={router} />
        </ConversationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
