import 'server-only';

import { headers } from 'next/headers';

import type { Organization } from '@/lib/auth/auth';
import { auth } from '@/lib/auth/auth';
import { requireActiveMember } from '@/lib/auth/guards';
import { isPersonalWorkspace } from '@/lib/auth/org-context';
import { AppError } from '@/lib/errors/app-error';
import { ERROR_CODES } from '@/lib/errors/error-codes';

import {
  removeMemberSchema,
  updateMemberRoleSchema,
} from '../schemas/members.schema';

export const membersService = {
  async updateMemberRole(input: unknown): Promise<{ role: string }> {
    try {
      const validated = updateMemberRoleSchema.parse(input);

      const currentMember = await requireActiveMember();

      const canEditRole =
        currentMember.role === 'owner' ||
        (currentMember.role === 'admin' && validated.role !== 'owner');

      if (!canEditRole) {
        throw new AppError(
          ERROR_CODES.FORBIDDEN,
          'You do not have permission to change this role',
          403
        );
      }

      const org = await auth.api.getFullOrganization({
        headers: await headers(),
      });

      if (!org?.id) {
        throw new AppError(ERROR_CODES.FORBIDDEN, 'No active workspace', 403);
      }

      const members = org.members || [];
      const targetMember = members.find((m) => m.id === validated.memberId);

      if (!targetMember) {
        throw new AppError(ERROR_CODES.NOT_FOUND, 'Member not found', 404);
      }

      if (targetMember.role === 'owner' && validated.role !== 'owner') {
        const owners = members.filter((m) => m.role === 'owner');
        if (owners.length <= 1) {
          throw new AppError(
            ERROR_CODES.LAST_OWNER_PROTECTED,
            'Cannot demote the last owner. Transfer ownership first.',
            403
          );
        }
      }

      await auth.api.updateMemberRole({
        headers: await headers(),
        body: {
          memberId: validated.memberId,
          role: validated.role as 'owner' | 'admin' | 'member',
        },
      });

      return { role: validated.role };
    } catch (error: unknown) {
      if (error instanceof Error && 'body' in error && 'status' in error) {
        throw new AppError(
          (error.body as { code: string }).code || ERROR_CODES.INTERNAL_ERROR,
          (error.body as { message: string }).message ||
            'Failed to update member role',
          (error.status as number) || 400
        );
      }

      if (error instanceof AppError || (error as Error).name === 'ZodError') {
        throw error;
      }

      throw new AppError(
        ERROR_CODES.INTERNAL_ERROR,
        'An unexpected error occurred while updating member role',
        500
      );
    }
  },

  async removeMember(input: unknown): Promise<void> {
    try {
      const validated = removeMemberSchema.parse(input);

      const currentMember = await requireActiveMember();

      if (currentMember.role !== 'owner' && currentMember.role !== 'admin') {
        throw new AppError(
          ERROR_CODES.FORBIDDEN,
          'Only admins and owners can remove members',
          403
        );
      }

      const org = await auth.api.getFullOrganization({
        headers: await headers(),
      });

      if (!org?.id) {
        throw new AppError(ERROR_CODES.FORBIDDEN, 'No active workspace', 403);
      }

      const members = org.members || [];
      const targetMember = members.find((m) => m.id === validated.memberId);

      if (!targetMember) {
        throw new AppError(ERROR_CODES.NOT_FOUND, 'Member not found', 404);
      }

      if (targetMember.userId === currentMember.userId) {
        throw new AppError(
          ERROR_CODES.FORBIDDEN,
          'Cannot remove yourself. Use leave workspace instead.',
          403
        );
      }

      if (targetMember.role === 'owner') {
        const owners = members.filter((m) => m.role === 'owner');
        if (owners.length <= 1) {
          throw new AppError(
            ERROR_CODES.LAST_OWNER_PROTECTED,
            'Cannot remove the last owner. Transfer ownership first.',
            403
          );
        }

        if (currentMember.role !== 'owner') {
          throw new AppError(
            ERROR_CODES.FORBIDDEN,
            'Only owners can remove other owners',
            403
          );
        }
      }

      await auth.api.removeMember({
        headers: await headers(),
        body: {
          memberIdOrEmail: validated.memberId,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error && 'body' in error && 'status' in error) {
        throw new AppError(
          (error.body as { code: string }).code || ERROR_CODES.INTERNAL_ERROR,
          (error.body as { message: string }).message ||
            'Failed to remove member',
          (error.status as number) || 400
        );
      }

      if (error instanceof AppError || (error as Error).name === 'ZodError') {
        throw error;
      }

      throw new AppError(
        ERROR_CODES.INTERNAL_ERROR,
        'An unexpected error occurred while removing member',
        500
      );
    }
  },

  async leaveWorkspace(): Promise<void> {
    try {
      const currentMember = await requireActiveMember();

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
          'Cannot leave personal workspace',
          403
        );
      }

      const members = org.members || [];
      const owners = members.filter((m) => m.role === 'owner');
      const isSoleOwner = currentMember.role === 'owner' && owners.length <= 1;

      if (isSoleOwner) {
        throw new AppError(
          ERROR_CODES.LAST_OWNER_PROTECTED,
          'Cannot leave as the sole owner. Transfer ownership first.',
          403
        );
      }

      await auth.api.leaveOrganization({
        headers: await headers(),
        body: {
          organizationId: org.id,
        },
      });

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
        const session = await auth.api.getSession({
          headers: await headers(),
        });
        const personalSlug = `pw-${session?.user.id}`;

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
            'Failed to leave workspace',
          (error.status as number) || 400
        );
      }

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        ERROR_CODES.INTERNAL_ERROR,
        'An unexpected error occurred while leaving workspace',
        500
      );
    }
  },
};
