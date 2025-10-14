import 'server-only';
import { billingRepository } from '../repositories/billing.repository';
import { getPlanFromPriceId } from '../constants/price-ids';
import type { Entitlements, SubscriptionStatus } from '../types';

const ACTIVE_STATUSES: SubscriptionStatus[] = [
  'trialing',
  'active',
  'past_due',
];

export const entitlementsService = {
  /**
   * Get user's subscription entitlements
   * Returns free tier if no subscription found
   */
  async getEntitlements(userId: string): Promise<Entitlements> {
    const subscription = await billingRepository.findSubscriptionByUserId(
      userId
    );

    // No subscription = free tier
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

    // Determine plan and interval from price ID
    const planInfo = subscription.stripePriceId
      ? getPlanFromPriceId(subscription.stripePriceId)
      : undefined;

    return {
      isActive: ACTIVE_STATUSES.includes(
        subscription.status as SubscriptionStatus
      ),
      status: subscription.status as SubscriptionStatus,
      plan: planInfo?.plan,
      interval: planInfo?.interval,
      currentPeriodEnd: subscription.currentPeriodEnd,
      cancelAtPeriodEnd: Boolean(subscription.cancelAtPeriodEnd),
    };
  },

  /**
   * Check if user has active subscription
   */
  async hasActiveSubscription(userId: string): Promise<boolean> {
    const entitlements = await this.getEntitlements(userId);
    return entitlements.isActive;
  },

  /**
   * Check if user has specific plan
   */
  async hasPlan(userId: string, plan: 'starter' | 'pro'): Promise<boolean> {
    const entitlements = await this.getEntitlements(userId);
    return entitlements.isActive && entitlements.plan === plan;
  },
};
