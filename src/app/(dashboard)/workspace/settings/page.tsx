import type { Metadata } from 'next';

import { deleteWorkspaceAction } from '@/features/workspace/actions/delete-workspace.action';
import { updateWorkspaceAction } from '@/features/workspace/actions/update-workspace.action';
import { getDashboardContext } from '@/lib/auth/get-dashboard-context';

import { DeleteWorkspaceCard } from './_components/delete-workspace-card';
import { WorkspaceSettingsForm } from './_components/workspace-settings-form';

export const metadata: Metadata = {
  title: 'Workspace Settings | Keyvaultify',
  description: 'Manage your workspace settings and preferences',
};

export default async function WorkspaceSettingsPage() {
  const ctx = await getDashboardContext();
  const canEdit =
    ctx.membership.role === 'owner' || ctx.membership.role === 'admin';

  return (
    <div className='flex flex-col gap-6 w-full mb-6'>
      <WorkspaceSettingsForm
        name={ctx.org.name}
        slug={ctx.org.slug}
        logo={ctx.org.logo ?? '/avatars/shadcn.jfif'}
        defaultRole={ctx.org.defaultRole}
        isPersonal={ctx.org.isPersonal}
        canEdit={canEdit}
        updateAction={updateWorkspaceAction}
      />
      <DeleteWorkspaceCard action={deleteWorkspaceAction} />
    </div>
  );
}
