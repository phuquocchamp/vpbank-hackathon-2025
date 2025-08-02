import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthGuard from '../../components/auth/AuthGuard';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import Layout from '../../components/layout/Layout';
import LoginPage from '../../pages/auth/LoginPage';

// Client pages
import ClientDashboard from '../../pages/client/dashboard/ClientDashboard';
import Helps from '../../pages/client/helps/Helps';

// Client guide pages
import ConversationBasicsGuide from '../../pages/client/helps/guides/ConversationBasicsGuide';
import DashboardOverviewGuide from '../../pages/client/helps/guides/DashboardOverviewGuide';

// Admin pages
import { PlaceholderPage } from '@/components/common/SampleComponent';
import AdminConversation from '@/pages/admin/conversation/AdminConversation';
import AdminHelp from '@/pages/admin/help/AdminHelp';
import KnowledgeBase from '@/pages/admin/knowledge-base/KnowledgeBase';
import SystemReport from '@/pages/admin/report/SystemReport';
import AdminDashboard from '../../pages/admin/dashboard/AdminDashboard';
import UserManagement from '../../pages/admin/user/UserManagement';
import ClientConversation from '../../pages/client/conversation/ClientConversation';

// Admin guide pages
import DashboardNavigationGuide from '../../pages/admin/help/guides/DashboardNavigationGuide';
import SystemLogsGuide from '../../pages/admin/help/guides/SystemLogsGuide';
import ConversationManagementGuide from '../../pages/admin/help/guides/ConversationManagementGuide';
import BillingAnalyticsGuide from '../../pages/admin/help/guides/BillingAnalyticsGuide';

// Automation pages
import AdminAutomationTasks from '../../pages/admin/automation/AdminAutomationTasks';
import ClientAutomationTasks from '../../pages/client/automation/ClientAutomationTasks';


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
        element: <ClientDashboard />,
      },
      {
        path: 'conversations',
        element: <ClientConversation />,
      },
      {
        path: 'conversations/:conversationId',
        element: <ClientConversation />,
      },
      {
        path: 'automation-tasks',
        element: <ClientAutomationTasks />,
      },
      {
        path: 'help',
        element: <Helps />,
      },
      {
        path: 'help/conversation-basics',
        element: <ConversationBasicsGuide />,
      },
      {
        path: 'help/dashboard-overview',
        element: <DashboardOverviewGuide />,
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
        path: 'automation-tasks',
        element: <AdminAutomationTasks />,
      },
      {
        path: 'help',
        element: <AdminHelp />,
      },
      {
        path: 'help/dashboard-navigation',
        element: <DashboardNavigationGuide />,
      },
      {
        path: 'help/system-logs',
        element: <SystemLogsGuide />,
      },
      {
        path: 'help/conversation-management',
        element: <ConversationManagementGuide />,
      },
      {
        path: 'help/billing-analytics',
        element: <BillingAnalyticsGuide />,
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