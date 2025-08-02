export const CLIENT_ROUTES = {
  CLIENT: '/client',
  CONVERSATION_DETAIL: '/client/conversations/:conversationId',
  HELP: '/client/help',
  AUTOMATION_TASKS: '/client/automation-tasks',
} as const;

export const ADMIN_ROUTES = {
  ADMIN: '/admin',
  CONVERSATION_DETAIL: '/admin/conversations/:conversationId',
  USERS: '/admin/users',
  KNOWLEDGE_BASE: '/admin/knowledge-base',
  REPORTS: '/admin/reports',
  HELP: '/admin/help',
  AUTOMATION_TASKS: '/admin/automation-tasks',
} as const;

export type RouteKey = keyof typeof CLIENT_ROUTES | keyof typeof ADMIN_ROUTES;