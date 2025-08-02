import { Activity, Database, FileText, HelpCircle, Home, Users, Zap } from 'lucide-react';
import { ADMIN_ROUTES, CLIENT_ROUTES } from '@/config/routes';

export interface MenuItem {
  title: string;
  url: string;
  icon: any;
  badge?: string;
  roles: ('USER' | 'ADMIN')[];
}

export const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    url: '/client',
    icon: Home,
    roles: ['USER'],
  },
  {
    title: 'AI Analysis',
    url: CLIENT_ROUTES.AUTOMATION_TASKS,
    icon: Zap,
    roles: ['USER'],
  },
  {
    title: 'Usage Guide',
    url: CLIENT_ROUTES.HELP,
    icon: HelpCircle,
    roles: ['USER'],
  },
  {
    title: 'Admin Dashboard',
    url: ADMIN_ROUTES.ADMIN,
    icon: Activity,
    roles: ['ADMIN'],
  },
  {
    title: 'User Management',
    url: ADMIN_ROUTES.USERS,
    icon: Users,
    roles: ['ADMIN'],
  },
  {
    title: 'Knowledge Base',
    url: ADMIN_ROUTES.KNOWLEDGE_BASE,
    icon: Database,
    roles: ['ADMIN'],
  },
  {
    title: 'AI Analysis',
    url: ADMIN_ROUTES.AUTOMATION_TASKS,
    icon: Zap,
    roles: ['ADMIN'],
  },
  {
    title: 'System Reports',
    url: ADMIN_ROUTES.REPORTS,
    icon: FileText,
    roles: ['ADMIN'],
  },
  {
    title: 'Usage Guide',
    url: ADMIN_ROUTES.HELP,
    icon: HelpCircle,
    roles: ['ADMIN'],
  },
];