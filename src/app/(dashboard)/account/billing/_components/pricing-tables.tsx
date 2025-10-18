'use client';

import { useState, useTransition } from 'react';
import { ArrowRight, BadgeCheck } from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createCheckoutAction } from '@/features/billing/actions/create-checkout.action';
import { plans } from '@/features/billing/constants/plans';
import type { BillingInterval, PlanKey } from '@/features/billing/types';
import { cn } from '@/lib/utils';

export function PricingTables({
  currentPlan,
  currentInterval,
}: {
  currentPlan?: PlanKey;
  currentInterval?: BillingInterval;
}) {
  const [frequency, setFrequency] = useState<BillingInterval>('monthly');
  const [isPending, startTransition] = useTransition();

  async function handleSubscribe(plan: PlanKey) {
    startTransition(async () => {
      const result = await createCheckoutAction({ plan, interval: frequency });
      if (!result.ok) {
        toast.error(result.message ?? 'Failed to start checkout');
      }
    });
  }

  return (
    <div className='flex flex-col text-center max-w-2xl w-full'>
      <div className='flex flex-col items-center justify-center gap-4'>
        <Tabs
          defaultValue={frequency}
          onValueChange={(value) => setFrequency(value as BillingInterval)}
          className='w-full items-end'
        >
          <TabsList>
            <TabsTrigger value='monthly'>Monthly</TabsTrigger>
            <TabsTrigger value='yearly'>Yearly (20% off)</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className='w-full grid grid-cols-2 gap-4'>
          {plans.map((plan) => {
            const isCurrentPlan =
              plan.id === currentPlan && frequency === currentInterval;

            return (
              <Card
                className={cn(
                  'relative w-full text-left',
                  plan.popular && 'ring-2 ring-primary'
                )}
                key={plan.id}
              >
                {plan.popular && (
                  <Badge className='-translate-x-1/2 -translate-y-1/2 absolute top-0 left-1/2 rounded-full'>
                    Popular
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle className='font-medium text-xl'>
                    {plan.name}
                  </CardTitle>
                  <CardDescription>
                    <p>{plan.description}</p>
                    <p className='font-medium text-foreground mt-2 text-2xl'>
                      ${plan.price[frequency]}
                      <span className='text-sm text-muted-foreground'>
                        /{frequency === 'monthly' ? 'month' : 'year'}
                      </span>
                    </p>
                  </CardDescription>
                </CardHeader>
                <CardContent className='grid gap-2'>
                  {plan.features.map((feature, index) => (
                    <div
                      className='flex items-center gap-2 text-muted-foreground text-sm'
                      key={index}
                    >
                      <BadgeCheck className='h-4 w-4' />
                      {feature}
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button
                    className='w-full'
                    variant={plan.popular ? 'default' : 'secondary'}
                    disabled={isCurrentPlan || isPending}
                    onClick={() => handleSubscribe(plan.id as PlanKey)}
                  >
                    {isCurrentPlan
                      ? 'Current Plan'
                      : isPending
                        ? 'Loading...'
                        : plan.cta}
                    {!isCurrentPlan && <ArrowRight className='ml-2 h-4 w-4' />}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
