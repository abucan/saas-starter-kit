import 'server-only';

import { cache } from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { entitlementsService } from '@/features/billing/services/entitlements.service';
import { computeInvitationACL } from '@/features/workspace/invitations/utils/compute-invitation-acl';
import { computeMemberACL } from '@/features/workspace/members/utils/compute-member-acl';
import { auth } from '@/lib/auth/auth';
import { FullOrganization, Role } from '@/types';
import { InvitationRow } from '@/types/auth';

export const getDashboardContext = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/signin');
  }

  let org = await auth.api.getFullOrganization({
    headers: await headers(),
  });

  const teams = await auth.api.listOrganizations({
    headers: await headers(),
  });

  // Check if user is still a member of their active workspace
  const isMemberOfActiveOrg = org?.members?.some(
    (m) => m.userId === session.user.id
  );

  // If user is not a member (kicked or org deleted), switch to a valid workspace
  if (!org || !isMemberOfActiveOrg) {
    // Find personal workspace or use first available workspace
    const personalWorkspace = teams?.find((o) => {
      const metadata =
        typeof o.metadata === 'string' ? JSON.parse(o.metadata) : o.metadata;
      return metadata?.isPersonal === true;
    });

    const targetWorkspace = personalWorkspace || teams?.[0];

    if (targetWorkspace?.id) {
      // Switch to valid workspace
      await auth.api.setActiveOrganization({
        headers: await headers(),
        body: {
          organizationId: targetWorkspace.id,
        },
      });

      // Get the new active organization after switching
      org = await auth.api.getFullOrganization({
        headers: await headers(),
      });
    } else {
      // No valid workspaces found - redirect to signin
      redirect('/signin');
    }
  }

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

  return {
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
});
