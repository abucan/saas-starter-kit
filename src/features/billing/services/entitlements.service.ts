import 'server-only';

import { headers } from 'next/headers';

import { auth } from '@/lib/auth/auth';

import type { Entitlements, SubscriptionStatus } from '../types';
import { getSubscriptionInterval } from '../utils/subscription-interval';

const ACTIVE_STATUSES: SubscriptionStatus[] = [
  'trialing',
  'active',
  'past_due',
];

export const entitlementsService = {
  async getEntitlements(userId: string): Promise<Entitlements> {
    try {
      const subscriptions = await auth.api.listActiveSubscriptions({
        headers: await headers(),
      });

      const subscription = subscriptions?.[0];

      if (!subscription) {
        return {
          isActive: false,
          status: 'incomplete',
          plan: undefined,
          interval: undefined,
          currentPeriodEnd: null,
          cancelAtPeriodEnd: false,
        };
      }

      let interval = undefined;

      if (subscription.stripeSubscriptionId) {
        try {
          interval = await getSubscriptionInterval(
            subscription.stripeSubscriptionId
          );
        } catch (error) {
          console.warn('Failed to fetch subscription interval:', error);
        }
      }

      return {
        isActive: ACTIVE_STATUSES.includes(
          subscription.status as SubscriptionStatus
        ),
        status: subscription.status as SubscriptionStatus,
        plan: subscription.plan?.toLowerCase() as 'starter' | 'pro' | undefined,
        interval,
        currentPeriodEnd: subscription.periodEnd
          ? new Date(subscription.periodEnd)
          : null,
        cancelAtPeriodEnd: Boolean(subscription.cancelAtPeriodEnd),
      };
    } catch {
      return {
        isActive: false,
        status: 'incomplete',
        plan: undefined,
        interval: undefined,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
      };
    }
  },

  async hasActiveSubscription(userId: string): Promise<boolean> {
    const entitlements = await this.getEntitlements(userId);
    return entitlements.isActive;
  },

  async hasPlan(userId: string, plan: 'starter' | 'pro'): Promise<boolean> {
    const entitlements = await this.getEntitlements(userId);
    return entitlements.isActive && entitlements.plan === plan;
  },
};
