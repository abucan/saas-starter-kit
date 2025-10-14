import { getDashboardContext } from '@/lib/auth/get-dashboard-context';
import type { Metadata } from 'next';
import { WorkspaceSettingsForm } from './_components/workspace-settings-form';
import {
  deleteWorkspaceAction,
  updateWorkspaceAction,
} from '@/features/workspace';
import { DangerZoneCard } from '@/components/shared/danger-zone-card';

export const metadata: Metadata = {
  title: 'Workspace Settings | Keyvaultify',
  description: 'Manage your workspace settings and preferences',
};

export default async function WorkspaceSettingsPage() {
  const ctx = await getDashboardContext();
  const canEdit =
    ctx.membership.role === 'owner' || ctx.membership.role === 'admin';

  return (
    <div className='container mx-auto flex flex-col gap-6'>
      <WorkspaceSettingsForm
        name={ctx.org.name}
        slug={ctx.org.slug}
        logo={ctx.org.logo ?? '/avatars/shadcn.jfif'}
        defaultRole={ctx.org.defaultRole}
        isPersonal={ctx.org.isPersonal}
        canEdit={canEdit}
        updateAction={updateWorkspaceAction}
      />
      <DangerZoneCard
        title='Delete Workspace'
        description='Permanently delete this workspace and all associated data'
        warningContent={
          <>
            Deleting your workspace is <strong>irreversible</strong> and will
            not end your subscription. To delete your workspace, please make
            sure you are the only owner of the workspace.
          </>
        }
        finalWarningContent={
          <>
            This will permanently delete the workspace, all projects,
            environments, and secrets. This action cannot be undone.
          </>
        }
        actionLabel='Delete Workspace'
        confirmLabel='Confirm Deletion'
        action={deleteWorkspaceAction}
        canPerformAction={canEdit}
        disabledReason={
          ctx.org.isPersonal
            ? 'Cannot delete personal workspace'
            : 'Only the sole owner can delete the workspace'
        }
        errorMessages={{
          CANNOT_DELETE_PERSONAL_WORKSPACE:
            'Personal workspaces cannot be deleted.',
          MUST_TRANSFER_OWNERSHIP:
            'Transfer ownership to another member before deleting.',
        }}
      />
    </div>
  );
}
