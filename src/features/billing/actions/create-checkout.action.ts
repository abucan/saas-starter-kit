'use server';

import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { redirect } from 'next/navigation';

import { requireUser } from '@/lib/auth/session';
import { handleError } from '@/lib/errors/error-handler';
import type { R } from '@/types/result';

import { billingService } from '../services/billing.service';

export async function createCheckoutAction(input: unknown): Promise<R<never>> {
  try {
    const user = await requireUser();

    const checkoutUrl = await billingService.createCheckout(
      input,
      user.id,
      user.email,
      user.name
    );

    redirect(checkoutUrl as any);
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return handleError(error) as R<never>;
  }
}
