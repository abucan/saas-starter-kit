import 'server-only';
import { cache } from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { bAuth } from '@/lib/auth/auth';
import { FullOrganization, Role } from '@/types';
import { computeMemberACL } from '@/features/workspace/members/utils/compute-member-acl';
import { computeInvitationACL } from '@/features/workspace/invitations/utils/compute-invitation-acl';
import { InvitationRow } from '@/types/auth';

import { entitlementsService } from '@/features/billing/services/entitlements.service';
import type { Entitlements } from '@/features/billing/types';

export const getDashboardContext = cache(async () => {
  const session = await bAuth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/signin');
  }

  const org = await bAuth.api.getFullOrganization({
    headers: await headers(),
  });

  if (!org?.id) {
    redirect('/signin'); // TODO: Or create personal workspace
  }

  const teams = await bAuth.api.listOrganizations({
    headers: await headers(),
  });

  const role =
    org.members?.find((m) => m.userId === session.user.id)?.role ?? 'member';

  const members = org.members.map((m) =>
    computeMemberACL(m, session.user.id, role, org as FullOrganization)
  );

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const invitations: InvitationRow[] = (org.invitations ?? []).map((inv) =>
    computeInvitationACL(inv, role, baseUrl)
  );

  const subscription = await entitlementsService.getEntitlements(
    session.user.id
  );

  return {
    user: {
      id: session.user.id,
      email: session.user.email!,
      name: session.user.name ?? null,
      image: session.user.image ?? null,
    },
    org: {
      id: org.id,
      slug: org.slug!,
      name: org.name,
      isPersonal: Boolean(org.metadata?.isPersonal),
      logo: org.logo,
      defaultRole: (org.metadata?.default_role as Role) ?? 'member',
    },
    membership: { role },
    teams: teams ?? [],
    members,
    invitations,
    subscription,
  };
});
