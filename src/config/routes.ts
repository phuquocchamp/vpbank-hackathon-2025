export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  CONVERSATION: '/conversation',
  CONVERSATION_DETAIL: '/conversation/:id',
  ANALYTICS: '/analytics',
  USERS: '/users',
  REPORTS: '/reports',
  SEARCH: '/search',
  CALENDAR: '/calendar',
  INBOX: '/inbox',
  SETTINGS: '/settings',
  NOTIFICATIONS: '/settings/notifications',
  HELP: '/help',
} as const;

export type RouteKey = keyof typeof ROUTES;