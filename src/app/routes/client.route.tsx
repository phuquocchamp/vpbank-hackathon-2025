import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ClientLayout from "@/components/layout/Layout";
import { CLIENT_ROUTES } from "@/config/routes";
import Analytics from "@/pages/client/analytics/Analytics";
import Conversation from "@/pages/client/conversation/Conversation";
import Dashboard from "@/pages/client/dashboard/Dashboard";
import { Suspense } from "react";
import { type RouteObject } from "react-router";
import { LoadingSpinner } from "./test";

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
        path: CLIENT_ROUTES.DASHBOARD.slice(1), // Remove leading slash for nested routes
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: CLIENT_ROUTES.CONVERSATION.slice(1),
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Conversation />
          </Suspense>
        ),
      },
      {
        path: CLIENT_ROUTES.ANALYTICS.slice(1),
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Analytics />
          </Suspense>
        ),
      }
    ],
  },
]