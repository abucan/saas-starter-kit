import 'dotenv/config';

import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schemas from '@/lib/db/schemas';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, {
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
