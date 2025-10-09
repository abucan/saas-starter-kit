import 'server-only';
import { headers } from 'next/headers';
import { bAuth } from './auth';
import type { Session, User } from './auth';
import { AppError } from '@/lib/errors/app-error';
import { ERROR_CODES } from '@/lib/errors/error-codes';

export async function getSession(): Promise<Session | null> {
  const session = await bAuth.api.getSession({
    headers: await headers(),
  });
  return session ?? null;
}

export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) {
    throw new AppError(
      ERROR_CODES.UNAUTHORIZED,
      'Authentication required',
      401
    );
  }
  return session;
}

export async function getUser(): Promise<User | null> {
  const session = await getSession();
  return session?.user ?? null;
}

export async function requireUser(): Promise<User> {
  const session = await requireSession();
  return session.user;
}

export async function getUserId(): Promise<string | null> {
  const user = await getUser();
  return user?.id ?? null;
}

export async function requireUserId(): Promise<string> {
  const user = await requireUser();
  return user.id;
}
