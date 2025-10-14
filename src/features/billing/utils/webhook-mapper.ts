import 'server-only';
import type Stripe from 'stripe';
import type { NewSubscription } from '@/lib/db/schemas/billing.schema';

export function mapStripeSubscriptionToDb(
  userId: string,
  subscription: Stripe.Subscription
): Omit<NewSubscription, 'id' | 'createdAt'> {
  const items = subscription.items.data ?? [];
  const firstItem = items[0];
  const firstPrice = firstItem?.price as Stripe.Price | undefined;

  // Extract period dates from subscription items
  const periodStarts = items
    .map((item) => item.current_period_start)
    .filter(Boolean);
  const periodEnds = items
    .map((item) => item.current_period_end)
    .filter(Boolean);

  const currentPeriodStart =
    periodStarts.length > 0 ? new Date(Math.min(...periodStarts) * 1000) : null;
  const currentPeriodEnd =
    periodEnds.length > 0 ? new Date(Math.max(...periodEnds) * 1000) : null;

  // Extract product ID
  const stripeProductId =
    typeof firstPrice?.product === 'string'
      ? firstPrice.product
      : firstPrice?.product?.id ?? null;

  return {
    userId,
    stripeSubscriptionId: subscription.id,
    stripeCustomerId: String(subscription.customer),
    status: subscription.status,
    mode: 'subscription',
    stripePriceId: firstPrice?.id ?? null,
    stripeProductId,
    quantity: firstItem?.quantity ?? 1,
    currency: firstPrice?.currency ?? null,
    unitAmount: firstPrice?.unit_amount ?? null,
    currentPeriodStart,
    currentPeriodEnd,
    cancelAt: subscription.cancel_at
      ? new Date(subscription.cancel_at * 1000)
      : null,
    cancelAtPeriodEnd: subscription.cancel_at_period_end ? 1 : 0,
    updatedAt: new Date(),
  };
}
