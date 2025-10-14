'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  cancelSubscriptionAction,
  resumeSubscriptionAction,
} from '@/features/billing/actions';

export function ManageBillingCard() {
  const [isCanceling, startCancel] = useTransition();
  const [isResuming, startResume] = useTransition();

  async function handleCancel() {
    if (
      !confirm(
        'Are you sure you want to cancel your subscription? It will remain active until the end of your billing period.'
      )
    ) {
      return;
    }

    startCancel(async () => {
      const result = await cancelSubscriptionAction();
      if (!result.ok) {
        toast.error(result.message ?? 'Failed to cancel subscription');
      } else {
        toast.success(
          'Subscription will be canceled at the end of your billing period'
        );
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

  // Note: We need to get subscription data to show cancel/resume buttons
  // This should be passed as a prop from the parent page
  // For now, showing just the portal link

  return (
    <Card className='py-4 bg-muted'>
      <CardContent className='flex flex-row items-center justify-between gap-4'>
        <div className='flex flex-col gap-2'>
          <h3 className='text-sm font-bold font-bricolage-grotesque'>
            Manage Billing
          </h3>
          <p className='text-xs text-muted-foreground font-bricolage-grotesque'>
            Update payment method, view invoices, and manage your subscription.
          </p>
        </div>
        <div className='flex gap-2'>
          <Button
            asChild
            variant='outline'
            className='font-bricolage-grotesque'
          >
            <Link href='/api/billing/portal'>
              Manage Billing
              <ArrowUpRight className='h-4 w-4' />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
