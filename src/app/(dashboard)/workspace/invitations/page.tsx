import { getDashboardContext } from '@/lib/auth/get-dashboard-context';
import { Metadata } from 'next';
import { InvitationsTable } from './_components/invitations-table';

export const metadata: Metadata = {
  title: 'Invitations | Workspace',
  description: 'Manage your workspace invitations',
};

export default async function InvitationsPage() {
  const { invitations, user, org, membership } = await getDashboardContext();
  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-1'>
        <h2 className='text-xl font-bold font-bricolage-grotesque'>
          Invitations
        </h2>
        <p className='text-sm text-muted-foreground font-bricolage-grotesque'>
          Manage pending invitations to your workspace.
        </p>
      </div>
      <InvitationsTable
        invitations={invitations}
        currentUserRole={membership.role}
      />
    </div>
  );
}
