import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY environment variable is required');
}

// initialize stripe to use stripe default api version
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  typescript: true,
});
