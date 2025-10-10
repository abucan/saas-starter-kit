import 'server-only';
import { headers } from 'next/headers';
import { bAuth } from './auth';
import type { Organization } from './auth';
import { AppError } from '@/lib/errors/app-error';
import { ERROR_CODES } from '@/lib/errors/error-codes';
import type { FullOrganization } from '@/types/auth'; // TODO: check if this is the correct type

export async function setActiveOrganization(params: {
  organizationId?: string;
  organizationSlug?: string;
}): Promise<void> {
  await bAuth.api.setActiveOrganization({
    headers: await headers(),
    body: {
      organizationId: params.organizationId ?? null,
      organizationSlug: params.organizationSlug,
    },
  });
}

export async function getActiveOrgId(): Promise<string | null> {
  const session = await bAuth.api.getSession({
    headers: await headers(),
  });
  return session?.session?.activeOrganizationId ?? null;
}

export async function requireActiveOrgId(): Promise<string> {
  const orgId = await getActiveOrgId();
  if (!orgId) {
    throw new AppError(ERROR_CODES.FORBIDDEN, 'No active organization', 403);
  }
  return orgId;
}

export async function getActiveOrg(): Promise<FullOrganization | null> {
  const organization = await bAuth.api.getFullOrganization({
    headers: await headers(),
  });
  return organization as FullOrganization | null;
}

export async function requireActiveOrg(): Promise<FullOrganization> {
  const organization = await getActiveOrg();
  if (!organization) {
    throw new AppError(ERROR_CODES.FORBIDDEN, 'No active organization', 403);
  }
  return organization;
}

export async function listUserOrganizations(): Promise<Organization[]> {
  const organizations = await bAuth.api.listOrganizations({
    headers: await headers(),
  });
  return organizations ?? [];
}

export function isPersonalWorkspace(org: Organization): boolean {
  const metadata =
    typeof org.metadata === 'string' ? JSON.parse(org.metadata) : org.metadata;
  return metadata?.isPersonal === true;
}
