'use server';

import { revalidatePath } from 'next/cache';
import { isRedirectError } from 'next/dist/client/components/redirect-error';

import { requireUserId } from '@/lib/auth/session';
import { handleError } from '@/lib/errors/error-handler';
import { invalidateDashboardCache } from '@/lib/redis/cache-invalidation';
import type { R } from '@/types/result';

import { billingService } from '../services/billing.service';

export async function resumeSubscriptionAction(): Promise<R> {
  try {
    await requireUserId();

    await billingService.resumeSubscription();

    await invalidateDashboardCache();
    revalidatePath('/account', 'layout');

    return { ok: true };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return handleError(error) as R<never>;
  }
}
