import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';

import * as authSchema from '@/lib/db/schemas/auth.schema';
import * as billingSchema from '@/lib/db/schemas/billing.schema';

const fullSchema = { ...authSchema, ...billingSchema };

export const db = drizzle(process.env.DB_FILE_NAME!, { schema: fullSchema });

export type {
  User,
  NewUser,
  Session,
  NewSession,
  Account,
  NewAccount,
  Verification,
  NewVerification,
  Organization,
  NewOrganization,
  Member,
  NewMember,
  Invitation,
  NewInvitation,
} from '@/lib/db/schemas/auth.schema';

export type {
  StripeCustomer,
  NewStripeCustomer,
  Subscription,
  NewSubscription,
} from '@/lib/db/schemas/billing.schema';
