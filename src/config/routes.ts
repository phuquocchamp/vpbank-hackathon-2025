export const CLIENT_ROUTES = {
  CLIENT: '/client',
  CONVERSATION_DETAIL: '/client/conversations/:conversationId',
  HELP: '/client/help',
} as const;

export const ADMIN_ROUTES = {
  ADMIN: '/admin',
  CONVERSATION_DETAIL: '/admin/conversations/:conversationId',
  USERS: '/admin/users',
  KNOWLEDGE_BASE: '/admin/knowledge-base',
  REPORTS: '/admin/reports',
  HELP: '/admin/help',
} as const;

export type RouteKey = keyof typeof CLIENT_ROUTES | keyof typeof ADMIN_ROUTES;