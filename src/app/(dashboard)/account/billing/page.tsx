import type { Metadata } from 'next';

import { getDashboardContext } from '@/lib/auth/get-dashboard-context';

import { CurrentPlanCard } from './_components/current-plan-card';
import { ManageBillingCard } from './_components/manage-billing-card';
import { PricingTables } from './_components/pricing-tables';

export const metadata: Metadata = {
  title: 'Billing | Keyvaultify',
  description: 'Manage your billing information and subscriptions',
};

export default async function BillingPage() {
  const { subscription } = await getDashboardContext();

  return (
    <div className='flex flex-col gap-6 max-w-2xl w-full'>
      <CurrentPlanCard subscription={subscription} />
      <PricingTables
        currentPlan={subscription.plan}
        currentInterval={subscription.interval}
      />
      {(subscription.isActive || subscription.cancelAtPeriodEnd) && (
        <ManageBillingCard subscription={subscription} />
      )}
    </div>
  );
}
