import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { router } from './router';

const AppProvider = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vpbank-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default AppProvider;