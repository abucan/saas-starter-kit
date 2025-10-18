import { CreditCard, Shield, User } from 'lucide-react';

export const accountNavConfig = [
  {
    title: 'Profile',
    description: 'Manage your account settings and preferences',
    href: '/account/profile',
    icon: User,
  },
  {
    title: 'Billing',
    description: 'Manage your billing information and subscriptions',
    href: '/account/billing',
    icon: CreditCard,
  },
  {
    title: 'Security',
    description: 'Manage security settings and delete your account',
    href: '/account/security',
    icon: Shield,
  },
];
