import type { BasePlan } from '../types';

export const plans: BasePlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: {
      monthly: 4.99,
      yearly: 49.99,
    },
    description:
      'The perfect starting place for your web app or personal project.',
    features: [
      '2 Workspaces',
      '10 Projects',
      'Unlimited Environments',
      '100 Secrets',
    ],
    cta: 'Subscribe to Starter',
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: {
      monthly: 8.99,
      yearly: 89.99,
    },
    description:
      'For personal projects or small teams looking for additional features.',
    features: [
      'Unlimited Workspaces',
      'Unlimited Projects',
      'Unlimited Environments',
      'Unlimited Secrets',
    ],
    cta: 'Subscribe to Pro',
  },
];
