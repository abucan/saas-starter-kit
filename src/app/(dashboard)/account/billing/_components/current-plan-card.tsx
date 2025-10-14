import { CreditCard } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { Entitlements } from '@/features/billing/types';

export function CurrentPlanCard({
  subscription,
}: {
  subscription: Entitlements;
}) {
  const currentPlan = subscription.plan
    ? `${subscription.plan.charAt(0).toUpperCase()}${subscription.plan.slice(
        1
      )} (${subscription.interval})`
    : 'Free';

  return (
    <Card className='py-4 bg-muted'>
      <CardContent className='flex flex-row items-center gap-4'>
        <CreditCard className='p-2 bg-white rounded-lg' size={40} />
        <div>
          <h2 className='text-sm font-bold font-bricolage-grotesque capitalize'>
            Current Plan: {currentPlan}
          </h2>
          {subscription.status === 'active' &&
            subscription.currentPeriodEnd && (
              <p className='text-sm font-medium text-muted-foreground font-bricolage-grotesque'>
                {subscription.cancelAtPeriodEnd
                  ? `Your subscription ends on ${subscription.currentPeriodEnd.toLocaleDateString()}`
                  : `Your subscription renews on ${subscription.currentPeriodEnd.toLocaleDateString()}`}
              </p>
            )}
          {subscription.status === 'canceled' &&
            subscription.currentPeriodEnd && (
              <p className='text-sm font-medium text-muted-foreground font-bricolage-grotesque'>
                Your subscription ended on{' '}
                {subscription.currentPeriodEnd.toLocaleDateString()}
              </p>
            )}
          {!subscription.isActive && (
            <p className='text-sm text-muted-foreground font-bricolage-grotesque'>
              You&apos;re currently on the Free plan. Select a plan to access
              premium features.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
