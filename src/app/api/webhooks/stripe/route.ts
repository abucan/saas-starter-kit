import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { stripe } from '@/lib/stripe/stripe';
import { billingRepository } from '@/features/billing/repositories/billing.repository';
import { mapStripeSubscriptionToDb } from '@/features/billing/utils/webhook-mapper';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    console.error('Missing Stripe signature or webhook secret');
    return new NextResponse('Missing signature or secret', { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return new NextResponse('Invalid signature', { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        if (
          session.mode === 'subscription' &&
          session.subscription &&
          session.customer
        ) {
          const userId =
            session.client_reference_id || session.metadata?.userId;

          if (!userId) {
            console.error('No userId found in checkout session');
            break;
          }

          // Fetch full subscription details
          const subscription = await stripe.subscriptions.retrieve(
            String(session.subscription)
          );

          // Map and upsert subscription
          const subscriptionData = mapStripeSubscriptionToDb(
            userId,
            subscription
          );

          await billingRepository.createSubscription(subscriptionData);
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (!userId) {
          console.error('No userId found in subscription metadata');
          break;
        }

        const subscriptionData = mapStripeSubscriptionToDb(
          userId,
          subscription
        );

        // Find existing subscription by Stripe ID
        const existing = await billingRepository.findSubscriptionByStripeId(
          subscription.id
        );

        if (existing) {
          await billingRepository.updateSubscription(
            existing.id,
            subscriptionData
          );
        } else {
          await billingRepository.createSubscription(subscriptionData);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (!userId) {
          console.error('No userId found in subscription metadata');
          break;
        }

        const subscriptionData = mapStripeSubscriptionToDb(
          userId,
          subscription
        );

        const existing = await billingRepository.findSubscriptionByStripeId(
          subscription.id
        );

        if (existing) {
          await billingRepository.updateSubscription(existing.id, {
            ...subscriptionData,
            status: 'canceled',
          });
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new NextResponse('Webhook processed', { status: 200 });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return new NextResponse('Webhook processing failed', { status: 500 });
  }
}
