import { getDashboardContext } from '@/lib/auth/get-dashboard-context';
import type { Metadata } from 'next';
import { WorkspaceSettingsForm } from './_components/workspace-settings-form';
import { updateWorkspaceAction } from '@/features/workspace';

export const metadata: Metadata = {
  title: 'Workspace Settings | Keyvaultify',
  description: 'Manage your workspace settings and preferences',
};

export default async function WorkspaceSettingsPage() {
  const ctx = await getDashboardContext();
  const canEdit =
    ctx.membership.role === 'owner' || ctx.membership.role === 'admin';

  return (
    <div className='container mx-auto'>
      <WorkspaceSettingsForm
        name={ctx.org.name}
        slug={ctx.org.slug}
        logo={ctx.org.logo ?? '/avatars/shadcn.jfif'}
        defaultRole={ctx.org.defaultRole}
        isPersonal={ctx.org.isPersonal}
        canEdit={canEdit}
        updateAction={updateWorkspaceAction}
      />
    </div>
  );
}
