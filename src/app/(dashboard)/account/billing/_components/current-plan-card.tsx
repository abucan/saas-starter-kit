import { CreditCard } from 'lucide-react';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Entitlements } from '@/features/billing/types';

export function CurrentPlanCard({
  subscription,
}: {
  subscription: Entitlements;
}) {
  const currentPlan = subscription.plan
    ? `${subscription.plan.charAt(0).toUpperCase()}${subscription.plan.slice(1)}${subscription.interval ? ` (${subscription.interval})` : ''}`
    : 'Free';

  return (
    <Card className='py-4 bg-muted w-full'>
      <CardHeader className='flex flex-row items-center gap-4'>
        <CreditCard className='p-2 bg-white rounded-lg' size={40} />
        <div>
          <CardTitle className='text-sm font-bold'>
            Current Plan: {currentPlan}
          </CardTitle>
          {subscription.status === 'active' &&
            subscription.currentPeriodEnd && (
              <CardDescription>
                {subscription.cancelAtPeriodEnd
                  ? `Your subscription ends on ${subscription.currentPeriodEnd.toLocaleDateString()}`
                  : `Your subscription renews on ${subscription.currentPeriodEnd.toLocaleDateString()}`}
              </CardDescription>
            )}
          {subscription.status === 'trialing' &&
            subscription.currentPeriodEnd && (
              <CardDescription>
                Trial ends on{' '}
                {subscription.currentPeriodEnd.toLocaleDateString()}
              </CardDescription>
            )}
          {subscription.status === 'past_due' && (
            <CardDescription>
              Payment failed. Please update your payment method.
            </CardDescription>
          )}
          {subscription.status === 'canceled' &&
            subscription.currentPeriodEnd && (
              <CardDescription>
                Your subscription ended on{' '}
                {subscription.currentPeriodEnd.toLocaleDateString()}
              </CardDescription>
            )}
          {!subscription.isActive && (
            <CardDescription>
              You&apos;re currently on the Free plan. Select a plan to access
              premium features.
            </CardDescription>
          )}
        </div>
      </CardHeader>
    </Card>
  );
}
