import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthGuard from '../../components/auth/AuthGuard';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import Layout from '../../components/layout/Layout';
import LoginPage from '../../pages/auth/LoginPage';

// Client pages
import Analytics from '../../pages/client/analytics/Analytics';
import Conversation from '../../pages/client/conversation/Conversation';
import Dashboard from '../../pages/client/dashboard/Dashboard';

// Admin pages
import { PlaceholderPage } from '@/components/common/SampleComponent';
import AdminConversation from '@/pages/admin/conversation/AdminConversation';
import AdminHelp from '@/pages/admin/help/AdminHelp';
import KnowledgeBase from '@/pages/admin/knowledge-base/KnowledgeBase';
import SystemReport from '@/pages/admin/report/SystemReport';
import AdminDashboard from '../../pages/admin/dashboard/AdminDashboard';
import UserManagement from '../../pages/admin/user/UserManagement';


// Create router
export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthGuard />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Navigate to="/client" replace />,
      }
    ]
  },
  {
    path: '/login',
    element: <LoginPage />,
  },

  // Client routes
  {
    path: '/client',
    element: (
      <ProtectedRoute requiredRole="USER">
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'conversations',
        element: <Conversation />,
      },
      {
        path: 'analytics',
        element: <Analytics />,
      }
    ]
  },

  // Admin routes
  {
    path: '/admin',
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: 'users',
        element: <UserManagement />,
      },
      {
        path: 'knowledge-base',
        element: <KnowledgeBase />,
      },
      {
        path: 'conversations',
        element: <AdminConversation />,
      },
      {
        path: 'conversations/:conversationId',
        element: <AdminConversation />,
      },
      {
        path: 'help',
        element: <AdminHelp />,
      },
      {
        path: 'reports',
        element: <SystemReport />,
      }
    ]
  },

  // Shared routes
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <PlaceholderPage title="Settings" />,
      }
    ]
  },

  {
    path: '*',
    element: (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold text-gray-600 mb-4">404</h1>
        <p className="text-gray-500 mb-4">Page not found</p>
        <a href="/" className="text-blue-600 hover:underline">
          Go back to dashboard
        </a>
      </div>
    ),
  },
]);