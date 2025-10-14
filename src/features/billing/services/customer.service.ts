import 'server-only';
import { stripe } from '@/lib/stripe/stripe';
import { billingRepository } from '../repositories/billing.repository';
import { AppError } from '@/lib/errors/app-error';
import { ERROR_CODES } from '@/lib/errors/error-codes';

export const customerService = {
  /**
   * Ensure Stripe customer exists for user
   * Creates customer if not found
   */
  async ensureCustomer(
    userId: string,
    userEmail: string,
    userName: string | null
  ): Promise<string> {
    try {
      // Check if customer already exists
      const existing = await billingRepository.findCustomerByUserId(userId);
      if (existing) {
        return existing.stripeCustomerId;
      }

      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: userEmail,
        name: userName ?? undefined,
        metadata: { userId },
      });

      // Save to database
      await billingRepository.createCustomer({
        userId,
        stripeCustomerId: customer.id,
      });

      return customer.id;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        ERROR_CODES.EXTERNAL_SERVICE_ERROR,
        'Failed to create Stripe customer',
        500
      );
    }
  },

  /**
   * Get Stripe customer ID for user
   * Throws if customer not found
   */
  async getCustomerId(userId: string): Promise<string> {
    const customer = await billingRepository.findCustomerByUserId(userId);
    if (!customer) {
      throw new AppError(
        ERROR_CODES.NOT_FOUND,
        'Stripe customer not found',
        404
      );
    }
    return customer.stripeCustomerId;
  },
};
