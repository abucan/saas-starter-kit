import { eq, and, desc, lt } from 'drizzle-orm';
import { db } from '@/lib/db';
import {
  stripeCustomers,
  subscriptions,
} from '@/lib/db/schemas/billing.schema';
import type {
  StripeCustomer,
  NewStripeCustomer,
  Subscription,
  NewSubscription,
} from '@/lib/db/schemas/billing.schema';

export const billingRepository = {
  /**
   * Find Stripe customer by user ID
   * @param userId - User ID
   * @returns StripeCustomer object or undefined if not found
   */
  async findCustomerByUserId(
    userId: string
  ): Promise<StripeCustomer | undefined> {
    return await db.query.stripeCustomers.findFirst({
      where: eq(stripeCustomers.userId, userId),
    });
  },

  /**
   * Find Stripe customer by Stripe customer ID
   * @param stripeCustomerId - Stripe customer ID
   * @returns StripeCustomer object or undefined if not found
   */
  async findCustomerByStripeId(
    stripeCustomerId: string
  ): Promise<StripeCustomer | undefined> {
    return await db.query.stripeCustomers.findFirst({
      where: eq(stripeCustomers.stripeCustomerId, stripeCustomerId),
    });
  },

  /**
   * Create Stripe customer record
   * @param data - New customer data
   * @returns Created customer object
   */
  async createCustomer(data: NewStripeCustomer): Promise<StripeCustomer> {
    const [created] = await db.insert(stripeCustomers).values(data).returning();
    return created as StripeCustomer;
  },

  /**
   * Update Stripe customer
   * @param userId - User ID
   * @param data - Partial customer data to update
   * @returns Updated customer object
   */
  async updateCustomer(
    userId: string,
    data: Partial<StripeCustomer>
  ): Promise<StripeCustomer> {
    const [updated] = await db
      .update(stripeCustomers)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(stripeCustomers.userId, userId))
      .returning();
    return updated as StripeCustomer;
  },

  /**
   * Find active subscription for user
   * @param userId - User ID
   * @returns Subscription object or undefined if not found
   */
  async findSubscriptionByUserId(
    userId: string
  ): Promise<Subscription | undefined> {
    return await db.query.subscriptions.findFirst({
      where: eq(subscriptions.userId, userId),
      orderBy: [desc(subscriptions.createdAt)],
    });
  },

  /**
   * Find subscription by Stripe subscription ID
   * @param stripeSubscriptionId - Stripe subscription ID
   * @returns Subscription object or undefined if not found
   */
  async findSubscriptionByStripeId(
    stripeSubscriptionId: string
  ): Promise<Subscription | undefined> {
    return await db.query.subscriptions.findFirst({
      where: eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId),
    });
  },

  /**
   * Find all active subscriptions
   * @returns Array of active subscriptions
   */
  async findActiveSubscriptions(): Promise<Subscription[]> {
    return await db.query.subscriptions.findMany({
      where: eq(subscriptions.status, 'active'),
      orderBy: [desc(subscriptions.createdAt)],
    });
  },

  /**
   * Create subscription record
   * @param data - New subscription data
   * @returns Created subscription object
   */
  async createSubscription(data: NewSubscription): Promise<Subscription> {
    const [created] = await db.insert(subscriptions).values(data).returning();
    return created as Subscription;
  },

  /**
   * Update subscription
   * @param id - Subscription ID
   * @param data - Partial subscription data to update
   * @returns Updated subscription object
   */
  async updateSubscription(
    id: string,
    data: Partial<Subscription>
  ): Promise<Subscription> {
    const [updated] = await db
      .update(subscriptions)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(subscriptions.id, id))
      .returning();
    return updated as Subscription;
  },

  /**
   * Update subscription status
   * @param stripeSubscriptionId - Stripe subscription ID
   * @param status - New status
   * @returns Updated subscription object
   */
  async updateSubscriptionStatus(
    stripeSubscriptionId: string,
    status: string
  ): Promise<Subscription> {
    const [updated] = await db
      .update(subscriptions)
      .set({ status, updatedAt: new Date() })
      .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId))
      .returning();
    return updated as Subscription;
  },

  /**
   * Mark subscription as canceled
   * @param stripeSubscriptionId - Stripe subscription ID
   * @returns Updated subscription object
   */
  async cancelSubscription(
    stripeSubscriptionId: string
  ): Promise<Subscription> {
    const [updated] = await db
      .update(subscriptions)
      .set({
        status: 'canceled',
        cancelAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId))
      .returning();
    return updated as Subscription;
  },

  /**
   * Delete subscription record
   * @param id - Subscription ID
   */
  async deleteSubscription(id: string): Promise<void> {
    await db.delete(subscriptions).where(eq(subscriptions.id, id));
  },

  /**
   * Get subscription with customer details
   * @param orgId - Organization ID
   * @returns Subscription with customer or undefined
   */
  async getSubscriptionWithCustomer(userId: string) {
    const subscription = await this.findSubscriptionByUserId(userId);
    if (!subscription) return undefined;

    const customer = await this.findCustomerByUserId(userId);
    return {
      subscription,
      customer,
    };
  },

  /**
   * Find subscriptions past their end date
   * @returns Array of expired subscriptions
   */
  async findExpiredSubscriptions(): Promise<Subscription[]> {
    const now = new Date();
    return await db.query.subscriptions.findMany({
      where: and(
        eq(subscriptions.status, 'active'),
        lt(subscriptions.currentPeriodEnd, now)
      ),
    });
  },

  /**
   * Check if subscription is active
   * @param subscription - Subscription object
   * @returns True if subscription is active
   */
  isSubscriptionActive(subscription: Subscription): boolean {
    if (
      subscription.status !== 'active' &&
      subscription.status !== 'trialing'
    ) {
      return false;
    }

    if (subscription.currentPeriodEnd) {
      return new Date() < subscription.currentPeriodEnd;
    }

    return true;
  },

  /**
   * Get subscription end date
   * @param subscription - Subscription object
   * @returns End date or null
   */
  getSubscriptionEndDate(subscription: Subscription): Date | null {
    return subscription.cancelAt || subscription.currentPeriodEnd || null;
  },
};
