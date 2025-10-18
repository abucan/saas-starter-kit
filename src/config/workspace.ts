import { Mail, Settings, Users } from 'lucide-react';

export const workspaceNavConfig = [
  {
    title: 'Members',
    description: 'Manage your workspace members and permissions',
    href: '/workspace/members',
    icon: Users,
  },
  {
    title: 'Invitations',
    description: 'Manage your workspace invitations and permissions',
    href: '/workspace/invitations',
    icon: Mail,
  },
  {
    title: 'Settings',
    description: 'Manage your workspace settings and preferences',
    href: '/workspace/settings',
    icon: Settings,
  },
];
