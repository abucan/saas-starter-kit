import 'server-only';

import { headers } from 'next/headers';

import { auth } from '@/lib/auth/auth';
import { AppError } from '@/lib/errors/app-error';
import { ERROR_CODES } from '@/lib/errors/error-codes';

import { checkoutSchema } from '../schemas/billing.schema';

export const billingService = {
  async createCheckout(input: unknown): Promise<string> {
    try {
      const validated = checkoutSchema.parse(input);

      const planName = validated.plan;
      const isAnnual = validated.interval === 'yearly';

      const activeSubscriptions = await auth.api.listActiveSubscriptions({
        headers: await headers(),
      });

      const existingSubscription = activeSubscriptions?.[0];

      const response = await auth.api.upgradeSubscription({
        headers: await headers(),
        body: {
          plan: planName,
          successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/account/billing?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/account/billing?checkout=cancelled`,
          annual: isAnnual,
          ...(existingSubscription?.id && {
            subscriptionId: existingSubscription.id,
          }),
        },
      });

      if (!response.url) {
        throw new AppError(
          ERROR_CODES.EXTERNAL_SERVICE_ERROR,
          'Failed to create checkout session',
          500
        );
      }

      return response.url;
    } catch (error) {
      console.error(error);
      if (error instanceof AppError) throw error;
      throw new AppError(
        ERROR_CODES.EXTERNAL_SERVICE_ERROR,
        'Failed to create checkout session',
        500
      );
    }
  },

  async cancelSubscription(): Promise<string> {
    try {
      const response = await auth.api.cancelSubscription({
        headers: await headers(),
        body: {
          returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/account/billing`,
        },
      });

      if (!response.url) {
        throw new AppError(
          ERROR_CODES.EXTERNAL_SERVICE_ERROR,
          'Failed to create cancellation portal',
          500
        );
      }

      return response.url;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        ERROR_CODES.EXTERNAL_SERVICE_ERROR,
        'Failed to cancel subscription',
        500
      );
    }
  },

  async resumeSubscription(): Promise<void> {
    try {
      await auth.api.restoreSubscription({
        headers: await headers(),
        body: {},
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        ERROR_CODES.EXTERNAL_SERVICE_ERROR,
        'Failed to resume subscription',
        500
      );
    }
  },

  async createPortalSession(): Promise<string> {
    try {
      const response = await auth.api.createBillingPortal({
        headers: await headers(),
        body: {
          returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/account/billing`,
        },
      });

      if (!response.url) {
        throw new AppError(
          ERROR_CODES.EXTERNAL_SERVICE_ERROR,
          'Failed to create portal session',
          500
        );
      }

      return response.url;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        ERROR_CODES.EXTERNAL_SERVICE_ERROR,
        'Failed to create portal session',
        500
      );
    }
  },
};
