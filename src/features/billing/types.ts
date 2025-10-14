export type PlanKey = 'starter' | 'pro';

export type BillingInterval = 'monthly' | 'yearly';

export type SubscriptionStatus =
  | 'incomplete'
  | 'incomplete_expired'
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'unpaid';

export type BasePlan = {
  id: PlanKey;
  name: string;
  price: {
    monthly: number;
    yearly: number;
  };
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
};

export type Entitlements = {
  isActive: boolean;
  status: SubscriptionStatus;
  plan: PlanKey | undefined;
  interval: BillingInterval | undefined;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
};

export type CheckoutParams = {
  plan: PlanKey;
  interval: BillingInterval;
};
