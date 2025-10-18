import 'dotenv/config';

import { drizzle } from 'drizzle-orm/libsql';

import * as schemas from '@/lib/db/schemas';

export const db = drizzle(process.env.DATABASE_URL!, {
  schema: schemas,
});

export type {
  Account,
  Invitation,
  Member,
  NewAccount,
  NewInvitation,
  NewMember,
  NewOrganization,
  NewSession,
  NewUser,
  NewVerification,
  Organization,
  Session,
  User,
  Verification,
} from '@/lib/db/schemas/auth.schema';
