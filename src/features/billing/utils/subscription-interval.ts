import type { BillingInterval } from '@/features/billing/types';
import { stripe } from '@/lib/stripe/stripe';

type CacheEntry = {
  interval: BillingInterval;
  timestamp: number;
};

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 60 * 60 * 1000;

export async function getSubscriptionInterval(
  stripeSubscriptionId: string
): Promise<BillingInterval | undefined> {
  try {
    const cached = cache.get(stripeSubscriptionId);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.interval;
    }

    const subscription = await stripe.subscriptions.retrieve(
      stripeSubscriptionId,
      {
        expand: ['items.data.price'],
      }
    );

    const price = subscription.items.data[0]?.price;

    if (!price?.recurring) {
      return undefined;
    }

    const { interval, interval_count } = price.recurring;

    let billingInterval: BillingInterval;

    if (interval === 'year') {
      billingInterval = 'yearly';
    } else if (interval === 'month' && interval_count === 12) {
      billingInterval = 'yearly';
    } else if (interval === 'month') {
      billingInterval = 'monthly';
    } else {
      return undefined;
    }

    cache.set(stripeSubscriptionId, {
      interval: billingInterval,
      timestamp: Date.now(),
    });

    return billingInterval;
  } catch (error) {
    console.error('Failed to retrieve subscription interval:', error);
    return undefined;
  }
}
