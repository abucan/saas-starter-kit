import 'server-only';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { entitlementsService } from '@/features/billing/services/entitlements.service';
import { computeInvitationACL } from '@/features/workspace/invitations/utils/compute-invitation-acl';
import { computeMemberACL } from '@/features/workspace/members/utils/compute-member-acl';
import { auth } from '@/lib/auth/auth';
import { redis } from '@/lib/redis/client';
import { FullOrganization, Role } from '@/types';
import { InvitationRow } from '@/types/auth';

const DASHBOARD_CACHE_TTL = 300; // 5 minutes
const CACHE_KEY_PREFIX = 'dashboard';

export async function getDashboardContext() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/signin');
  }

  const cacheKey = `${CACHE_KEY_PREFIX}:${session.user.id}`;

  try {
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      console.log('Serving from cache', cacheKey);
      return JSON.parse(cachedData);
    }
  } catch (error) {
    console.error('Redis GET error:', error);
  }

  const org = await auth.api.getFullOrganization({
    headers: await headers(),
  });

  const teams = await auth.api.listOrganizations({
    headers: await headers(),
  });

  const role =
    org?.members?.find((m) => m.userId === session.user.id)?.role ?? 'member';

  const members = org?.members.map((m) =>
    computeMemberACL(m, session.user.id, role, org as FullOrganization)
  );

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const invitations: InvitationRow[] = (org?.invitations ?? []).map((inv) =>
    computeInvitationACL(inv, role, baseUrl)
  );

  const subscription = await entitlementsService.getEntitlements(
    session.user.id
  );

  const metadata =
    typeof org?.metadata === 'string'
      ? JSON.parse(org.metadata)
      : org?.metadata;

  const result = {
    user: {
      id: session.user.id,
      email: session.user.email!,
      name: session.user.name ?? null,
      image: session.user.image ?? null,
    },
    org: {
      id: org?.id ?? '',
      slug: org?.slug ?? '',
      name: org?.name ?? '',
      isPersonal: Boolean(metadata?.isPersonal),
      logo: org?.logo ?? '',
      defaultRole: (metadata?.default_role as Role) ?? 'member',
    },
    membership: { role },
    teams: teams ?? [],
    members,
    invitations,
    subscription,
  };

  try {
    await redis.setex(cacheKey, DASHBOARD_CACHE_TTL, JSON.stringify(result));
    console.log('✅ Cached dashboard data for user:', session.user.id);
  } catch (error) {
    console.error('Redis cache write error:', error);
  }

  return result;
}
