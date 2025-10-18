'use client';

import { useTransition } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cancelSubscriptionAction } from '@/features/billing/actions/cancel-subscription.action';
import { createPortalAction } from '@/features/billing/actions/create-portal.action';
import { resumeSubscriptionAction } from '@/features/billing/actions/resume-subscription.action';
import type { Entitlements } from '@/features/billing/types';

export function ManageBillingCard({
  subscription,
}: {
  subscription: Entitlements;
}) {
  const [isCanceling, startCancel] = useTransition();
  const [isResuming, startResume] = useTransition();
  const [isOpeningPortal, startPortal] = useTransition();

  async function handleCancel() {
    startCancel(async () => {
      const result = await cancelSubscriptionAction();
      if (!result.ok) {
        toast.error(result.message ?? 'Failed to open cancellation portal');
      }
    });
  }

  async function handleResume() {
    startResume(async () => {
      const result = await resumeSubscriptionAction();
      if (!result.ok) {
        toast.error(result.message ?? 'Failed to resume subscription');
      } else {
        toast.success('Subscription resumed successfully');
      }
    });
  }

  async function handlePortal() {
    startPortal(async () => {
      const result = await createPortalAction();
      if (!result.ok) {
        toast.error(result.message ?? 'Failed to open billing portal');
      }
    });
  }

  const isPending = isCanceling || isResuming || isOpeningPortal;

  return (
    <Card className='py-4 bg-muted w-full'>
      <CardHeader className='flex flex-row items-center justify-between gap-4'>
        <div className='flex flex-col gap-0.5'>
          <CardTitle className='text-sm font-bold'>Manage Billing</CardTitle>
          <CardDescription>
            Update payment method, view invoices, and manage your subscription.
          </CardDescription>
        </div>
        <div className='flex gap-2'>
          {subscription.cancelAtPeriodEnd ? (
            <Button
              variant='outline'
              onClick={handleResume}
              disabled={isPending}
            >
              {isResuming ? 'Resuming...' : 'Resume Subscription'}
            </Button>
          ) : (
            <Button
              variant='outline'
              onClick={handleCancel}
              disabled={isPending}
            >
              {isCanceling ? 'Opening Portal...' : 'Cancel Subscription'}
            </Button>
          )}
          <Button variant='outline' onClick={handlePortal} disabled={isPending}>
            {isOpeningPortal ? 'Opening...' : 'Manage Billing'}
            <ArrowUpRight className='h-4 w-4' />
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}
