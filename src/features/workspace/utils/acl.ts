import 'server-only';

import { headers } from 'next/headers';

import { auth } from '@/lib/auth/auth';
import { requireActiveMember } from '@/lib/auth/guards';
import { AppError } from '@/lib/errors/app-error';
import { ERROR_CODES } from '@/lib/errors/error-codes';

import type { Role } from '../types';

export async function canEditWorkspace(): Promise<boolean> {
  try {
    const member = await requireActiveMember();
    return member.role === 'owner' || member.role === 'admin';
  } catch {
    return false;
  }
}

export async function canDeleteWorkspace(): Promise<boolean> {
  try {
    const member = await requireActiveMember();
    const org = await auth.api.getFullOrganization({
      headers: await headers(),
    });

    if (!org) return false;

    const metadata =
      typeof org.metadata === 'string'
        ? JSON.parse(org.metadata)
        : org.metadata;

    if (metadata?.isPersonal) return false;

    if (member.role !== 'owner') return false;

    const owners = org.members.filter(
      (m: { role: string }) => m.role === 'owner'
    );
    return owners.length === 1;
  } catch {
    return false;
  }
}

export async function ensureNotPersonalWorkspace(): Promise<void> {
  const org = await auth.api.getFullOrganization({
    headers: await headers(),
  });

  if (!org) {
    throw new AppError(ERROR_CODES.FORBIDDEN, 'No active workspace', 403);
  }

  const metadata =
    typeof org.metadata === 'string' ? JSON.parse(org.metadata) : org.metadata;

  if (metadata?.isPersonal) {
    throw new AppError(
      ERROR_CODES.FORBIDDEN,
      'Cannot perform this action on personal workspace',
      403
    );
  }
}

export async function ensureSlugAvailable(
  slug: string,
  currentOrgId?: string
): Promise<void> {
  const existingOrg = await auth.api.getFullOrganization({
    headers: await headers(),
    query: { organizationSlug: slug },
  });

  if (existingOrg && existingOrg.id !== currentOrgId) {
    throw new AppError(
      ERROR_CODES.ALREADY_EXISTS,
      'Workspace slug already in use',
      409
    );
  }
}

export async function getWorkspacePermissions(): Promise<{
  canEdit: boolean;
  canDelete: boolean;
  isPersonal: boolean;
  role: Role;
}> {
  const member = await requireActiveMember();
  const org = await auth.api.getFullOrganization({
    headers: await headers(),
  });

  if (!org) {
    throw new AppError(ERROR_CODES.FORBIDDEN, 'No active workspace', 403);
  }

  const metadata =
    typeof org.metadata === 'string' ? JSON.parse(org.metadata) : org.metadata;

  const isPersonal = metadata?.isPersonal === true;
  const canEdit = member.role === 'owner' || member.role === 'admin';

  const owners = org.members.filter(
    (m: { role: string }) => m.role === 'owner'
  );
  const canDelete =
    member.role === 'owner' && owners.length === 1 && !isPersonal;

  return {
    canEdit,
    canDelete,
    isPersonal,
    role: member.role as Role,
  };
}
