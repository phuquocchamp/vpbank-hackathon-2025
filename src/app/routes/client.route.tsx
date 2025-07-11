import ClientLayout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { ROUTES } from "@/config/routes";
import Analytics from "@/pages/client/analytics/Analytics";
import Conversation from "@/pages/client/conversation/Conversation";
import Dashboard from "@/pages/client/dashboard/Dashboard";
import Users from "@/pages/client/users/Users";
import { Suspense } from "react";
import { type RouteObject } from "react-router";
import { LoadingSpinner, PlaceholderPage } from "./test";

export const clientRoutes: RouteObject[] = [
  {
    path: "client",
    element: (
      <ProtectedRoute requiredRole="client">
        <ClientLayout />
      </ProtectedRoute>
    ),
    children: [
    
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: ROUTES.DASHBOARD.slice(1), // Remove leading slash for nested routes
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: ROUTES.CONVERSATION.slice(1),
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Conversation />
          </Suspense>
        ),
      },
      {
        path: ROUTES.ANALYTICS.slice(1),
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Analytics />
          </Suspense>
        ),
      },
      // {
      //   path: ROUTES.USERS.slice(1),
      //   element: (
      //     <Suspense fallback={<LoadingSpinner />}>
      //       <Users />
      //     </Suspense>
      //   ),
      // },
      // {
      //   path: ROUTES.REPORTS.slice(1),
      //   element: <PlaceholderPage title="Reports" />,
      // },
      // {
      //   path: ROUTES.SEARCH.slice(1),
      //   element: <PlaceholderPage title="Search" />,
      // },
      // {
      //   path: ROUTES.CALENDAR.slice(1),
      //   element: <PlaceholderPage title="Calendar" />,
      // },
      // {
      //   path: ROUTES.INBOX.slice(1),
      //   element: <PlaceholderPage title="Inbox" />,
      // },
      // {
      //   path: ROUTES.SETTINGS.slice(1),
      //   element: <PlaceholderPage title="Settings" />,
      // },
      // {
      //   path: ROUTES.HELP.slice(1),
      //   element: <PlaceholderPage title="Help & Support" />,
      // },
    ],
  },
]