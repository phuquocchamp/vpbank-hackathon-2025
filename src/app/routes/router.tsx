import { createBrowserRouter, Navigate } from 'react-router-dom';
import { adminRoutes } from './admin.router';
import { clientRoutes } from './client.route';
import LoginPage from '@/pages/auth/LoginPage';

// Create router
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  ...adminRoutes,
  ...clientRoutes,
  {
    path: '*',
    element: (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold text-gray-600 mb-4">404</h1>
        <p className="text-gray-500 mb-4">Page not found</p>
        <a href="/login" className="text-blue-600 hover:underline">
          Go back to login
        </a>
      </div>
    ),
  },
]);