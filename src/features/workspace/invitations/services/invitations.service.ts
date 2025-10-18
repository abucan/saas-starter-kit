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
  /**
   * Invite a new member to the workspace
   *
   * @param input - Unknown input to be validated
   * @returns Object with email of invited user
   * @throws AppError if validation fails or user lacks permission
   */
  async inviteMember(input: unknown): Promise<{ email: string }> {
    try {
      // Validate input
      const validated = inviteMemberSchema.parse(input);

      // Check authentication and get current member
      const currentMember = await requireActiveMember();

      // Check permission: only admins and owners can invite
      if (currentMember.role !== 'owner' && currentMember.role !== 'admin') {
        throw new AppError(
          ERROR_CODES.FORBIDDEN,
          'Only admins and owners can invite members',
          403
        );
      }

      // Create invitation via Better Auth
      await auth.api.createInvitation({
        headers: await headers(),
        body: {
          email: validated.email,
          role: validated.role as 'owner' | 'admin' | 'member',
        },
      });

      return { email: validated.email };
    } catch (error: unknown) {
      // Handle Better Auth API errors
      if (error instanceof Error && 'body' in error && 'status' in error) {
        throw new AppError(
          (error.body as { code: string }).code || ERROR_CODES.INTERNAL_ERROR,
          (error.body as { message: string }).message ||
            'Failed to send invitation',
          (error.status as number) || 400
        );
      }

      // Re-throw AppError and ZodError
      if (error instanceof AppError || (error as Error).name === 'ZodError') {
        throw error;
      }

      // Handle unexpected errors
      throw new AppError(
        ERROR_CODES.INTERNAL_ERROR,
        'An unexpected error occurred while sending invitation',
        500
      );
    }
  },

  /**
   * Resend an existing invitation
   *
   * @param input - Unknown input to be validated
   * @returns Object with email of invited user
   * @throws AppError if validation fails or user lacks permission
   */
  async resendInvitation(input: unknown): Promise<{ email: string }> {
    try {
      // Validate input
      const validated = resendInvitationSchema.parse(input);

      // Check authentication and get current member
      const currentMember = await requireActiveMember();

      // Check permission: only admins and owners can resend
      if (currentMember.role !== 'owner' && currentMember.role !== 'admin') {
        throw new AppError(
          ERROR_CODES.FORBIDDEN,
          'Only admins and owners can resend invitations',
          403
        );
      }

      // Resend invitation via Better Auth (uses createInvitation with resend flag)
      await auth.api.createInvitation({
        headers: await headers(),
        body: {
          email: validated.email,
          role: validated.role as 'owner' | 'admin' | 'member',
          resend: true,
        },
      });

      return { email: validated.email };
    } catch (error: unknown) {
      // Handle Better Auth API errors
      if (error instanceof Error && 'body' in error && 'status' in error) {
        throw new AppError(
          (error.body as { code: string }).code || ERROR_CODES.INTERNAL_ERROR,
          (error.body as { message: string }).message ||
            'Failed to resend invitation',
          (error.status as number) || 400
        );
      }

      // Re-throw AppError and ZodError
      if (error instanceof AppError || (error as Error).name === 'ZodError') {
        throw error;
      }

      // Handle unexpected errors
      throw new AppError(
        ERROR_CODES.INTERNAL_ERROR,
        'An unexpected error occurred while resending invitation',
        500
      );
    }
  },

  /**
   * Cancel a pending invitation
   *
   * @param input - Unknown input to be validated
   * @returns Object with email of canceled invitation
   * @throws AppError if validation fails or user lacks permission
   */
  async cancelInvitation(input: unknown): Promise<{ email: string }> {
    try {
      // Validate input
      const validated = cancelInvitationSchema.parse(input);

      // Check authentication and get current member
      const currentMember = await requireActiveMember();

      // Check permission: only admins and owners can cancel
      if (currentMember.role !== 'owner' && currentMember.role !== 'admin') {
        throw new AppError(
          ERROR_CODES.FORBIDDEN,
          'Only admins and owners can cancel invitations',
          403
        );
      }

      // Cancel invitation via Better Auth
      const result = await auth.api.cancelInvitation({
        headers: await headers(),
        body: {
          invitationId: validated.invitationId,
        },
      });

      return { email: result?.email ?? '' };
    } catch (error: unknown) {
      // Handle Better Auth API errors
      if (error instanceof Error && 'body' in error && 'status' in error) {
        throw new AppError(
          (error.body as { code: string }).code || ERROR_CODES.INTERNAL_ERROR,
          (error.body as { message: string }).message ||
            'Failed to cancel invitation',
          (error.status as number) || 400
        );
      }

      // Re-throw AppError and ZodError
      if (error instanceof AppError || (error as Error).name === 'ZodError') {
        throw error;
      }

      // Handle unexpected errors
      throw new AppError(
        ERROR_CODES.INTERNAL_ERROR,
        'An unexpected error occurred while canceling invitation',
        500
      );
    }
  },
};
