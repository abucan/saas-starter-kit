'use client';

import { useState, useTransition } from 'react';
import { ArrowRight, BadgeCheck } from 'lucide-react';
import { toast } from 'sonner';
import { plans } from '@/features/billing/constants/plans';
import { createCheckoutAction } from '@/features/billing/actions';
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
import { cn } from '@/lib/utils';
import type { PlanKey, BillingInterval } from '@/features/billing/types';

export function PricingTables({ currentPlan }: { currentPlan?: PlanKey }) {
  const [frequency, setFrequency] = useState<BillingInterval>('monthly');
  const [isPending, startTransition] = useTransition();

  async function handleSubscribe(plan: PlanKey) {
    startTransition(async () => {
      const result = await createCheckoutAction({ plan, interval: frequency });
      if (!result.ok) {
        toast.error(result.message ?? 'Failed to start checkout');
      }
      // Success case redirects to Stripe, so no toast needed
    });
  }

  return (
    <div className='flex flex-col text-center'>
      <div className='flex flex-col items-center justify-center gap-4'>
        <Tabs
          defaultValue={frequency}
          onValueChange={(value) => setFrequency(value as BillingInterval)}
          className='w-full items-end'
        >
          <TabsList>
            <TabsTrigger className='font-bricolage-grotesque' value='monthly'>
              Monthly
            </TabsTrigger>
            <TabsTrigger className='font-bricolage-grotesque' value='yearly'>
              Yearly (20% off)
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className='w-full grid grid-cols-2 gap-4'>
          {plans.map((plan) => (
            <Card
              className={cn(
                'relative w-full text-left',
                plan.popular && 'ring-2 ring-primary'
              )}
              key={plan.id}
            >
              {plan.popular && (
                <Badge className='-translate-x-1/2 -translate-y-1/2 absolute top-0 left-1/2 rounded-full font-bricolage-grotesque'>
                  Popular
                </Badge>
              )}
              <CardHeader>
                <CardTitle className='font-medium text-xl font-bricolage-grotesque'>
                  {plan.name}
                </CardTitle>
                <CardDescription>
                  <p className='font-bricolage-grotesque'>{plan.description}</p>
                  <p className='font-medium text-foreground font-bricolage-grotesque mt-2 text-2xl'>
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
                    className='flex items-center gap-2 text-muted-foreground text-sm font-bricolage-grotesque'
                    key={index}
                  >
                    <BadgeCheck className='h-4 w-4' />
                    {feature}
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button
                  className='w-full font-bricolage-grotesque'
                  variant={plan.popular ? 'default' : 'secondary'}
                  disabled={plan.id === currentPlan || isPending}
                  onClick={() => handleSubscribe(plan.id as PlanKey)}
                >
                  {plan.id === currentPlan ? 'Current Plan' : plan.cta}
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
