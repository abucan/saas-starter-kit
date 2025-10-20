import 'server-only';

import { headers } from 'next/headers';

import { auth } from '@/lib/auth/auth';
import { requireActiveMember } from '@/lib/auth/guards';
import { AppError } from '@/lib/errors/app-error';
import { ERROR_CODES } from '@/lib/errors/error-codes';

import {
  cancelInvitationSchema,
  inviteMemberSchema,
  resendInvitationSchema,
} from '../schemas/invitations.schema';

export const invitationsService = {
  async inviteMember(input: unknown): Promise<{ email: string }> {
    const validated = inviteMemberSchema.parse(input);

    const currentMember = await requireActiveMember();

    if (currentMember.role !== 'owner' && currentMember.role !== 'admin') {
      throw new AppError(
        ERROR_CODES.FORBIDDEN,
        'Only admins and owners can invite members',
        403
      );
    }

    await auth.api.createInvitation({
      headers: await headers(),
      body: {
        email: validated.email,
        role: validated.role as 'owner' | 'admin' | 'member',
      },
    });

    return { email: validated.email };
  },

  async resendInvitation(input: unknown): Promise<{ email: string }> {
    const validated = resendInvitationSchema.parse(input);

    const currentMember = await requireActiveMember();

    if (currentMember.role !== 'owner' && currentMember.role !== 'admin') {
      throw new AppError(
        ERROR_CODES.FORBIDDEN,
        'Only admins and owners can resend invitations',
        403
      );
    }

    await auth.api.createInvitation({
      headers: await headers(),
      body: {
        email: validated.email,
        role: validated.role as 'owner' | 'admin' | 'member',
        resend: true,
      },
    });

    return { email: validated.email };
  },

  async cancelInvitation(input: unknown): Promise<{ email: string }> {
    const validated = cancelInvitationSchema.parse(input);

    const currentMember = await requireActiveMember();

    if (currentMember.role !== 'owner' && currentMember.role !== 'admin') {
      throw new AppError(
        ERROR_CODES.FORBIDDEN,
        'Only admins and owners can cancel invitations',
        403
      );
    }

    const result = await auth.api.cancelInvitation({
      headers: await headers(),
      body: {
        invitationId: validated.invitationId,
      },
    });

    return { email: result?.email ?? '' };
  },
};
