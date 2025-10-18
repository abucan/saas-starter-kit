import { and, eq, lt } from 'drizzle-orm';

import { db } from '@/lib/db';
import type { Subscription } from '@/lib/db/schemas/auth.schema';
import { subscription } from '@/lib/db/schemas/auth.schema';

export const billingRepository = {
  async findSubscriptionByUserId(
    userId: string
  ): Promise<Subscription | undefined> {
    return await db.query.subscription.findFirst({
      where: eq(subscription.stripeCustomerId, userId),
    });
  },

  async findSubscriptionByStripeId(
    stripeSubscriptionId: string
  ): Promise<Subscription | undefined> {
    return await db.query.subscription.findFirst({
      where: eq(subscription.stripeSubscriptionId, stripeSubscriptionId),
    });
  },

  async findActiveSubscriptions(): Promise<Subscription[]> {
    return await db.query.subscription.findMany({
      where: eq(subscription.status, 'active'),
    });
  },

  async findExpiredSubscriptions(): Promise<Subscription[]> {
    const now = new Date();
    return await db.query.subscription.findMany({
      where: and(
        eq(subscription.status, 'active'),
        lt(subscription.periodEnd, now)
      ),
    });
  },

  isSubscriptionActive(sub: Subscription): boolean {
    if (sub.status !== 'active' && sub.status !== 'trialing') {
      return false;
    }

    if (sub.periodEnd) {
      return new Date() < new Date(sub.periodEnd);
    }

    return true;
  },

  getSubscriptionEndDate(sub: Subscription): Date | null {
    if (sub.cancelAtPeriodEnd && sub.periodEnd) {
      return new Date(sub.periodEnd);
    }
    return sub.periodEnd ? new Date(sub.periodEnd) : null;
  },
};
