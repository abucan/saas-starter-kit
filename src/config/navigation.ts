import { Home, User, Users } from 'lucide-react';

export const navigationConfig = {
  main: [
    { title: 'Dashboard', url: '/dashboard', icon: Home },
    {
      title: 'Workspace',
      url: '/workspace',
      icon: Users,
      items: [
        { title: 'Members', url: '/workspace/members' },
        { title: 'Invitations', url: '/workspace/invitations' },
        { title: 'Settings', url: '/workspace/settings' },
      ],
    },
    {
      title: 'Account',
      url: '/account',
      icon: User,
      items: [
        { title: 'Profile', url: '/account/profile' },
        { title: 'Billing', url: '/account/billing' },
        { title: 'Security', url: '/account/security' },
      ],
    },
  ],
};
