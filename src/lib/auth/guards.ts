import 'server-only';

import { headers } from 'next/headers';

import { AppError } from '@/lib/errors/app-error';
import { ERROR_CODES } from '@/lib/errors/error-codes';

import type { Session } from './auth';
import { auth } from './auth';

type MemberWithRole = {
  id: string;
  userId: string;
  organizationId: string;
  role: 'owner' | 'admin' | 'member';
  createdAt: Date;
};

export async function requireAuth(): Promise<{
  userId: string;
  session: Session;
}> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new AppError(
      ERROR_CODES.UNAUTHORIZED,
      'Authentication required',
      401
    );
  }

  return {
    userId: session.user.id,
    session,
  };
}

export async function requireActiveMember(): Promise<MemberWithRole> {
  const member = await auth.api.getActiveMember({
    headers: await headers(),
  });

  if (!member) {
    throw new AppError(ERROR_CODES.FORBIDDEN, 'No active organization', 403);
  }

  return member as MemberWithRole;
}

export async function requireOwner(): Promise<MemberWithRole> {
  const member = await requireActiveMember();

  if (member.role !== 'owner') {
    throw new AppError(ERROR_CODES.FORBIDDEN, 'Owner access required', 403);
  }

  return member;
}

export async function requireAdmin(): Promise<MemberWithRole> {
  const member = await requireActiveMember();

  if (member.role !== 'owner' && member.role !== 'admin') {
    throw new AppError(ERROR_CODES.FORBIDDEN, 'Admin access required', 403);
  }

  return member;
}

export async function hasRole(
  roles: Array<'owner' | 'admin' | 'member'>
): Promise<boolean> {
  try {
    const member = await requireActiveMember();
    return roles.includes(member.role);
  } catch {
    return false;
  }
}
