import { Metadata } from 'next';

import { getDashboardContext } from '@/lib/auth/get-dashboard-context';

import { MembersTable } from './_components/members-table';

export const metadata: Metadata = {
  title: 'Members | Workspace',
  description: 'Manage your workspace members and permissions',
};

export default async function MembersPage() {
  const { members, user, org, membership } = await getDashboardContext();

  return (
    <div className='flex-1'>
      <MembersTable
        members={members ?? []}
        currentUserId={user.id}
        isPersonalWorkspace={org.isPersonal}
        defaultRole={org.defaultRole}
        currentUserRole={membership.role}
      />
    </div>
  );
}
