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
    <div className='flex flex-col gap-6 w-full'>
      <div className='flex flex-col gap-1'>
        <h2 className='text-xl font-bold font-bricolage-grotesque'>
          Choose a Plan
        </h2>
        <p className='text-sm text-muted-foreground font-bricolage-grotesque'>
          Choose the plan that best suits your needs.
        </p>
      </div>

      <CurrentPlanCard subscription={subscription} />

      <PricingTables currentPlan={subscription.plan} />

      {subscription.isActive && <ManageBillingCard />}
    </div>
  );
}
