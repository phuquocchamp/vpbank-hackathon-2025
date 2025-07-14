export const CLIENT_ROUTES = {
  HOME: '/client',
  DASHBOARD: '/client/dashboard',
  CONVERSATION: '/client/conversations',
  CONVERSATION_DETAIL: '/client/conversations/:id',
  ANALYTICS: '/client/analytics',
} as const;

export const ADMIN_ROUTES = {
  ADMIN: '/admin',
  DASHBOARD: '/admin/dashboard',
  USERS: '/admin/users',
  REPORTS: '/admin/reports',
  ANALYTICS: '/admin/analytics',
  SETTINGS: '/admin/settings',
} as const;

export type RouteKey = keyof typeof CLIENT_ROUTES | keyof typeof ADMIN_ROUTES;