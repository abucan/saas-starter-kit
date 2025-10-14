// src/db/schemas/subscription-schema.ts
import { sql } from 'drizzle-orm';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const stripeCustomers = sqliteTable('stripe_customers', {
  userId: text('user_id').primaryKey(), // FK to User.id (BetterAuth)
  stripeCustomerId: text('stripe_customer_id').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
});

export const subscriptions = sqliteTable('subscriptions', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  userId: text('user_id').notNull(), // FK to BetterAuth User.id
  stripeSubscriptionId: text('stripe_subscription_id').unique(), // null for lifetime/one-time
  stripeCustomerId: text('stripe_customer_id').notNull(),

  status: text('status').notNull(), // 'incomplete'|'trialing'|'active'|'past_due'|'canceled'|'unpaid'
  mode: text('mode').notNull(), // 'subscription' | 'payment' (for lifetime, later)

  // Primary price snapshot (kept for quick checks; Stripe remains source of truth)
  stripePriceId: text('stripe_price_id'),
  stripeProductId: text('stripe_product_id'),
  quantity: integer('quantity'),

  currency: text('currency'), // e.g., 'usd'
  unitAmount: integer('unit_amount'), // in minor units

  currentPeriodStart: integer('current_period_start_ms', {
    mode: 'timestamp_ms',
  }),
  currentPeriodEnd: integer('current_period_end_ms', { mode: 'timestamp_ms' }),
  cancelAt: integer('cancel_at_ms', { mode: 'timestamp_ms' }),
  cancelAtPeriodEnd: integer('cancel_at_period_end_bool'),

  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
});

// Indexes for performance
export const stripeCustomerIdIdx = index('stripe_customer_id_idx').on(
  stripeCustomers.stripeCustomerId
);
export const subscriptionUserIdIdx = index('subscription_user_id_idx').on(
  subscriptions.userId
);
export const subscriptionStripeIdIdx = index('subscription_stripe_id_idx').on(
  subscriptions.stripeSubscriptionId
);
export const subscriptionCustomerIdIdx = index(
  'subscription_customer_id_idx'
).on(subscriptions.stripeCustomerId);
export const subscriptionStatusIdx = index('subscription_status_idx').on(
  subscriptions.status
);

// StripeCustomer types
export type StripeCustomer = typeof stripeCustomers.$inferSelect;
export type NewStripeCustomer = typeof stripeCustomers.$inferInsert;

// Subscription types
export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
