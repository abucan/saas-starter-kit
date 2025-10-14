import { getDashboardContext } from '@/lib/auth/get-dashboard-context';
import { Metadata } from 'next';
import { MembersTable } from './_components/members-table';

export const metadata: Metadata = {
  title: 'Members | Workspace',
  description: 'Manage your workspace members and permissions',
};

export default async function MembersPage() {
  const { members, user, org, membership } = await getDashboardContext();
  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-1'>
        <h2 className='text-xl font-bold font-bricolage-grotesque'>Members</h2>
        <p className='text-sm text-muted-foreground font-bricolage-grotesque'>
          Manage your workspace members and their roles.
        </p>
      </div>
      <MembersTable
        members={members}
        currentUserId={user.id}
        isPersonalWorkspace={org.isPersonal}
        defaultRole={org.defaultRole}
        currentUserRole={membership.role}
      />
    </div>
  );
}
