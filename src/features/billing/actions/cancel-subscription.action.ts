'use server';

import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { redirect } from 'next/navigation';

import { requireUserId } from '@/lib/auth/session';
import { handleError } from '@/lib/errors/error-handler';
import { invalidateDashboardCache } from '@/lib/redis/cache-invalidation';
import type { R } from '@/types/result';

import { billingService } from '../services/billing.service';

export async function cancelSubscriptionAction(): Promise<R<never>> {
  try {
    await requireUserId();

    const portalUrl = await billingService.cancelSubscription();

    await invalidateDashboardCache();

    redirect(portalUrl as any);
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return handleError(error) as R<never>;
  }
}
