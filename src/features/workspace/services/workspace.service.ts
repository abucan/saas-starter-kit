import 'server-only';

import { headers } from 'next/headers';

import type { Organization } from '@/lib/auth/auth';
import { auth } from '@/lib/auth/auth';
import { isPersonalWorkspace } from '@/lib/auth/org-context';
import { AppError } from '@/lib/errors/app-error';
import { ERROR_CODES } from '@/lib/errors/error-codes';

import {
  createWorkspaceSchema,
  switchWorkspaceSchema,
  updateWorkspaceSchema,
} from '../schemas/workspace.schema';

export const workspaceService = {
  async createWorkspace(input: unknown): Promise<{ id: string; slug: string }> {
    try {
      const validated = createWorkspaceSchema.parse(input);

      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (!session) {
        throw new AppError(
          ERROR_CODES.UNAUTHORIZED,
          'Authentication required',
          401
        );
      }

      const slugCheck = await auth.api.checkOrganizationSlug({
        body: {
          slug: validated.slug,
        },
      });

      if (slugCheck) {
        throw new AppError(
          ERROR_CODES.ALREADY_EXISTS,
          'Workspace slug already in use',
          409
        );
      }

      const organization = await auth.api.createOrganization({
        headers: await headers(),
        body: {
          name: validated.name,
          slug: validated.slug,
          userId: session.user.id,
          metadata: {
            isPersonal: false,
            default_role: 'member',
          },
        },
      });

      if (!organization?.id || !organization?.slug) {
        throw new AppError(
          ERROR_CODES.INTERNAL_ERROR,
          'Failed to create workspace',
          500
        );
      }

      return {
        id: organization.id,
        slug: organization.slug,
      };
    } catch (error: unknown) {
      if (error instanceof Error && 'body' in error && 'status' in error) {
        throw new AppError(
          (error.body as { code: string }).code || ERROR_CODES.INTERNAL_ERROR,
          (error.body as { message: string }).message ||
            'Failed to create workspace',
          (error.status as number) || 400
        );
      }

      if (error instanceof AppError || (error as Error).name === 'ZodError') {
        throw error;
      }

      throw new AppError(
        ERROR_CODES.INTERNAL_ERROR,
        'An unexpected error occurred while creating workspace',
        500
      );
    }
  },

  async updateWorkspace(input: unknown): Promise<void> {
    try {
      const validated = updateWorkspaceSchema.parse(input);

      const org = await auth.api.getFullOrganization({
        headers: await headers(),
      });

      if (!org?.id) {
        throw new AppError(ERROR_CODES.FORBIDDEN, 'No active workspace', 403);
      }

      const isPersonal = isPersonalWorkspace(org as Organization);
      if (isPersonal && validated.slug && validated.slug !== org.slug) {
        throw new AppError(
          ERROR_CODES.FORBIDDEN,
          'Cannot change slug of personal workspace',
          403
        );
      }

      if (validated.slug && validated.slug !== org.slug) {
        const slugCheck = await auth.api.checkOrganizationSlug({
          body: {
            slug: validated.slug,
          },
        });

        if (slugCheck) {
          throw new AppError(
            ERROR_CODES.ALREADY_EXISTS,
            'Workspace slug already in use',
            409
          );
        }
      }

      const payload: {
        name?: string;
        slug?: string;
        logo?: string;
        metadata?: Record<string, unknown>;
      } = {};

      if (validated.name !== undefined) {
        payload.name = validated.name;
      }
      if (validated.slug !== undefined && !isPersonal) {
        payload.slug = validated.slug;
      }
      if (validated.logo !== undefined) {
        payload.logo = validated.logo;
      }

      if (validated.defaultRole !== undefined) {
        const currentMetadata =
          typeof org.metadata === 'string'
            ? JSON.parse(org.metadata)
            : org.metadata || {};

        payload.metadata = {
          ...currentMetadata,
          default_role: validated.defaultRole,
        };
      }

      await auth.api.updateOrganization({
        headers: await headers(),
        body: {
          organizationId: org.id,
          data: payload,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error && 'body' in error && 'status' in error) {
        throw new AppError(
          (error.body as { code: string }).code || ERROR_CODES.INTERNAL_ERROR,
          (error.body as { message: string }).message ||
            'Failed to update workspace',
          (error.status as number) || 400
        );
      }

      if (error instanceof AppError || (error as Error).name === 'ZodError') {
        throw error;
      }

      throw new AppError(
        ERROR_CODES.INTERNAL_ERROR,
        'An unexpected error occurred while updating workspace',
        500
      );
    }
  },

  async deleteWorkspace(): Promise<void> {
    try {
      const org = await auth.api.getFullOrganization({
        headers: await headers(),
      });

      if (!org?.id) {
        throw new AppError(ERROR_CODES.FORBIDDEN, 'No active workspace', 403);
      }

      const isPersonal = isPersonalWorkspace(org as Organization);
      if (isPersonal) {
        throw new AppError(
          ERROR_CODES.FORBIDDEN,
          'Cannot delete personal workspace',
          403
        );
      }

      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (!session) {
        throw new AppError(
          ERROR_CODES.UNAUTHORIZED,
          'Authentication required',
          401
        );
      }

      const members = org.members || [];
      const owners = members.filter((m) => m.role === 'owner');
      const isUserOwner = owners.some((o) => o.userId === session.user.id);

      if (!isUserOwner) {
        throw new AppError(
          ERROR_CODES.FORBIDDEN,
          'Only workspace owners can delete the workspace',
          403
        );
      }

      if (owners.length > 1) {
        throw new AppError(
          ERROR_CODES.FORBIDDEN,
          'Transfer ownership to other members before deleting workspace',
          403
        );
      }

      await auth.api.deleteOrganization({
        headers: await headers(),
        body: {
          organizationId: org.id,
        },
      });

      const personalSlug = `pw-${session.user.id}`;
      const organizations = await auth.api.listOrganizations({
        headers: await headers(),
      });

      const personalWorkspace = organizations?.find((o) => {
        const metadata =
          typeof o.metadata === 'string' ? JSON.parse(o.metadata) : o.metadata;
        return metadata?.isPersonal === true;
      });

      if (personalWorkspace?.id) {
        await auth.api.setActiveOrganization({
          headers: await headers(),
          body: {
            organizationId: personalWorkspace.id,
          },
        });
      } else {
        await auth.api.setActiveOrganization({
          headers: await headers(),
          body: {
            organizationSlug: personalSlug,
          },
        });
      }
    } catch (error: unknown) {
      if (error instanceof Error && 'body' in error && 'status' in error) {
        throw new AppError(
          (error.body as { code: string }).code || ERROR_CODES.INTERNAL_ERROR,
          (error.body as { message: string }).message ||
            'Failed to delete workspace',
          (error.status as number) || 400
        );
      }

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        ERROR_CODES.INTERNAL_ERROR,
        'An unexpected error occurred while deleting workspace',
        500
      );
    }
  },

  async switchWorkspace(input: unknown): Promise<void> {
    try {
      const validated = switchWorkspaceSchema.parse(input);

      const organizations = await auth.api.listOrganizations({
        headers: await headers(),
      });

      if (!organizations) {
        throw new AppError(
          ERROR_CODES.INTERNAL_ERROR,
          'Failed to fetch workspaces',
          500
        );
      }

      const targetWorkspace = organizations.find(
        (org) => org.id === validated.workspaceId
      );

      if (!targetWorkspace) {
        throw new AppError(
          ERROR_CODES.FORBIDDEN,
          'You are not a member of this workspace',
          403
        );
      }

      await auth.api.setActiveOrganization({
        body: {
          organizationId: validated.workspaceId,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error && 'body' in error && 'status' in error) {
        throw new AppError(
          (error.body as { code: string }).code || ERROR_CODES.INTERNAL_ERROR,
          (error.body as { message: string }).message ||
            'Failed to switch workspace',
          (error.status as number) || 400
        );
      }

      if (error instanceof AppError || (error as Error).name === 'ZodError') {
        throw error;
      }

      throw new AppError(
        ERROR_CODES.INTERNAL_ERROR,
        'An unexpected error occurred while switching workspace',
        500
      );
    }
  },
};
