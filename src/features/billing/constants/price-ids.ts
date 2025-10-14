import type { BillingInterval, PlanKey } from '../types';

function validatePriceId(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  if (!value.startsWith('price_')) {
    throw new Error(`${name} must be a Stripe Price ID (starts with "price_")`);
  }
  return value;
}

export const PRICE_IDS: Record<BillingInterval, Record<PlanKey, string>> = {
  monthly: {
    starter: validatePriceId(
      process.env.STRIPE_PRICE_STARTER_MONTHLY,
      'STRIPE_PRICE_STARTER_MONTHLY'
    ),
    pro: validatePriceId(
      process.env.STRIPE_PRICE_PRO_MONTHLY,
      'STRIPE_PRICE_PRO_MONTHLY'
    ),
  },
  yearly: {
    starter: validatePriceId(
      process.env.STRIPE_PRICE_STARTER_YEARLY,
      'STRIPE_PRICE_STARTER_YEARLY'
    ),
    pro: validatePriceId(
      process.env.STRIPE_PRICE_PRO_YEARLY,
      'STRIPE_PRICE_PRO_YEARLY'
    ),
  },
};

export function getPlanFromPriceId(
  priceId: string
): { plan: PlanKey; interval: BillingInterval } | undefined {
  for (const interval of Object.keys(PRICE_IDS) as BillingInterval[]) {
    for (const plan of Object.keys(PRICE_IDS[interval]) as PlanKey[]) {
      if (PRICE_IDS[interval][plan] === priceId) {
        return { plan, interval };
      }
    }
  }
  return undefined;
}
