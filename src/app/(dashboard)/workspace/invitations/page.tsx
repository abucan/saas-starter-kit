import { Metadata } from 'next';

import { getDashboardContext } from '@/lib/auth/get-dashboard-context';

import { InvitationsTable } from './_components/invitations-table';

export const metadata: Metadata = {
  title: 'Invitations | Workspace',
  description: 'Manage your workspace invitations and permissions',
};

export default async function InvitationsPage() {
  const { invitations, membership } = await getDashboardContext();

  return (
    <div className='flex-1'>
      <InvitationsTable
        invitations={invitations}
        currentUserRole={membership.role}
      />
    </div>
  );
}
