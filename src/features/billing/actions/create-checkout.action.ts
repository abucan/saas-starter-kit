'use server';

import { redirect } from 'next/navigation';
import { billingService } from '../services/billing.service';
import { requireUser } from '@/lib/auth/session';
import { handleError } from '@/lib/errors/error-handler';
import type { R } from '@/types/result';

export async function createCheckoutAction(input: unknown): Promise<R<never>> {
  try {
    const user = await requireUser();

    const checkoutUrl = await billingService.createCheckout(
      input,
      user.id,
      user.email,
      user.name
    );

    // Redirect to Stripe Checkout
    redirect(checkoutUrl);
  } catch (error) {
    return handleError(error) as R<never>;
  }
}
