import 'server-only';
import { stripe } from '@/lib/stripe/stripe';
import { billingRepository } from '../repositories/billing.repository';
import { customerService } from './customer.service';
import { checkoutSchema } from '../schemas/billing.schema';
import { PRICE_IDS } from '../constants/price-ids';
import { AppError } from '@/lib/errors/app-error';
import { ERROR_CODES } from '@/lib/errors/error-codes';

export const billingService = {
  /**
   * Create Stripe checkout session
   * Returns checkout URL
   */
  async createCheckout(
    input: unknown,
    userId: string,
    userEmail: string,
    userName: string | null
  ): Promise<string> {
    try {
      // Validate input
      const validated = checkoutSchema.parse(input);

      // Ensure Stripe customer exists
      const customerId = await customerService.ensureCustomer(
        userId,
        userEmail,
        userName
      );

      // Get price ID
      const priceId = PRICE_IDS[validated.interval][validated.plan];

      // Create checkout session
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        customer: customerId,
        line_items: [{ price: priceId, quantity: 1 }],
        allow_promotion_codes: true,
        client_reference_id: userId,
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/account/billing?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/account/billing?checkout=cancelled`,
        subscription_data: {
          metadata: {
            userId,
            plan: validated.plan,
            interval: validated.interval,
          },
        },
        metadata: {
          userId,
          plan: validated.plan,
          interval: validated.interval,
        },
      });

      if (!session.url) {
        throw new AppError(
          ERROR_CODES.EXTERNAL_SERVICE_ERROR,
          'Failed to create checkout session',
          500
        );
      }

      return session.url;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        ERROR_CODES.EXTERNAL_SERVICE_ERROR,
        'Failed to create checkout session',
        500
      );
    }
  },

  /**
   * Cancel subscription at period end
   */
  async cancelSubscription(userId: string): Promise<void> {
    try {
      const subscription = await billingRepository.findSubscriptionByUserId(
        userId
      );

      if (!subscription?.stripeSubscriptionId) {
        throw new AppError(
          ERROR_CODES.SUBSCRIPTION_NOT_FOUND,
          'No active subscription found',
          404
        );
      }

      if (subscription.status === 'canceled') {
        throw new AppError(
          ERROR_CODES.CONFLICT,
          'Subscription already canceled',
          400
        );
      }

      // Cancel at period end in Stripe
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });

      // Update database (webhook will also update, but we do it here for immediate UI feedback)
      await billingRepository.updateSubscription(subscription.id, {
        cancelAtPeriodEnd: 1,
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        ERROR_CODES.EXTERNAL_SERVICE_ERROR,
        'Failed to cancel subscription',
        500
      );
    }
  },

  /**
   * Resume scheduled cancellation
   */
  async resumeSubscription(userId: string): Promise<void> {
    try {
      const subscription = await billingRepository.findSubscriptionByUserId(
        userId
      );

      if (!subscription?.stripeSubscriptionId) {
        throw new AppError(
          ERROR_CODES.SUBSCRIPTION_NOT_FOUND,
          'No active subscription found',
          404
        );
      }

      if (!subscription.cancelAtPeriodEnd) {
        throw new AppError(
          ERROR_CODES.CONFLICT,
          'Subscription is not scheduled to cancel',
          400
        );
      }

      // Resume in Stripe
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: false,
      });

      // Update database
      await billingRepository.updateSubscription(subscription.id, {
        cancelAtPeriodEnd: 0,
        cancelAt: null,
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

  /**
   * Create Stripe billing portal session
   * Returns portal URL
   */
  async createPortalSession(userId: string): Promise<string> {
    try {
      const customerId = await customerService.getCustomerId(userId);

      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/account/billing`,
      });

      return session.url;
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
