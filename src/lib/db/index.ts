import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';

import * as schemas from '@/lib/db/schemas';

export const db = drizzle(process.env.DATABASE_URL!, {
  schema: schemas,
});

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
