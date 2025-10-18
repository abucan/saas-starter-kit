import type { Organization } from '@/lib/auth/auth';
export type {
  FullOrganization,
  OrganizationWithMetadata,
  Role,
} from '@/types/auth';

export type CreateWorkspaceInput = {
  name: string;
  slug: string;
};

export type UpdateWorkspaceInput = {
  name?: string;
  slug?: string;
  logo?: string;
  defaultRole?: 'owner' | 'admin' | 'member';
};

export type SwitchWorkspaceInput = {
  workspaceId: string;
};

export type WorkspaceWithPermissions = Organization & {
  hasOwnerPermission: boolean;
  hasAdminPermission: boolean;
  isPersonal: boolean;
  defaultRole: 'owner' | 'admin' | 'member';
};
