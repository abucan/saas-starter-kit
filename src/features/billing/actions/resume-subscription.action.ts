'use server';

import { revalidatePath } from 'next/cache';
import { billingService } from '../services/billing.service';
import { requireUserId } from '@/lib/auth/session';
import { handleError } from '@/lib/errors/error-handler';
import type { R } from '@/types/result';

export async function resumeSubscriptionAction(): Promise<R> {
  try {
    const userId = await requireUserId();

    await billingService.resumeSubscription(userId);

    revalidatePath('/account', 'layout');

    return { ok: true };
  } catch (error) {
    return handleError(error);
  }
}
