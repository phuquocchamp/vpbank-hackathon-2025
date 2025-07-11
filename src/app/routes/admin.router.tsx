import AdminLayout from "@/components/layout/AdminLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminDashboard from "@/pages/admin/dashboard/AdminDashboard";
import UserManagement from "@/pages/admin/user/UserManagement";
import { Suspense } from "react";
import type { RouteObject } from "react-router";
import { LoadingSpinner, PlaceholderPage } from "./test";

export const adminRoutes: RouteObject[] = [
  {
    path: "admin",
    element: (
      <ProtectedRoute requiredRole="admin">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <AdminDashboard />
          </Suspense>
        ),
      },
      {
        path: "users",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <UserManagement />
          </Suspense>
        ),
      },
      {
        path: "reports",
        element: <PlaceholderPage title="System Reports" />,
      },
      {
        path: "analytics",
        element: <PlaceholderPage title="Admin Analytics" />,
      },
      {
        path: "settings",
        element: <PlaceholderPage title="System Settings" />,
      },
      {
        path: "security",
        element: <PlaceholderPage title="Security Settings" />,
      },
    ]
  }
]