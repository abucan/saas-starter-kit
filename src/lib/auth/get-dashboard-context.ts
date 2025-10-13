import 'server-only';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { bAuth } from '@/lib/auth/auth';

export async function getDashboardContext() {
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
    redirect('/signin'); // Or create personal workspace
  }

  const teams = await bAuth.api.listOrganizations({
    headers: await headers(),
  });

  const role =
    org.members?.find((m) => m.userId === session.user.id)?.role ?? 'member';

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
    },
    membership: { role },
    teams: teams ?? [],
  };
}
