import 'server-only';
import { headers } from 'next/headers';
import { bAuth } from '@/lib/auth/auth';
import { updateProfileSchema } from '../schemas/user.schema';
import { AppError } from '@/lib/errors/app-error';
import { ERROR_CODES } from '@/lib/errors/error-codes';

export const userService = {
  async updateProfile(input: unknown): Promise<void> {
    try {
      const validated = updateProfileSchema.parse(input);

      const session = await bAuth.api.getSession({
        headers: await headers(),
      });

      if (!session) {
        throw new AppError(
          ERROR_CODES.UNAUTHORIZED,
          'Authentication required',
          401
        );
      }

      const payload: { name?: string; image?: string } = {};
      if (validated.name !== undefined) {
        payload.name = validated.name;
      }
      if (validated.image !== undefined) {
        payload.image = validated.image;
      }

      await bAuth.api.updateUser({
        headers: await headers(),
        body: payload,
      });
    } catch (error: unknown) {
      if (error instanceof Error && 'body' in error && 'status' in error) {
        throw new AppError(
          (error.body as { code: string }).code,
          (error.body as { message: string }).message ||
            'Failed to update profile',
          (error.status as number) || 400
        );
      }
      if (error instanceof AppError || (error as Error).name === 'ZodError') {
        throw error;
      }
      throw new AppError(
        ERROR_CODES.INTERNAL_ERROR,
        'An unexpected error occurred',
        500
      );
    }
  },

  async deleteProfile(): Promise<void> {
    try {
      const session = await bAuth.api.getSession({
        headers: await headers(),
      });

      if (!session) {
        throw new AppError(
          ERROR_CODES.UNAUTHORIZED,
          'Authentication required',
          401
        );
      }

      await bAuth.api.deleteUser({
        headers: await headers(),
        body: {
          callbackURL: '/signin',
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error && 'body' in error && 'status' in error) {
        throw new AppError(
          (error.body as { code: string }).code,
          (error.body as { message: string }).message ||
            'Failed to delete account',
          (error.status as number) || 400
        );
      }
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        ERROR_CODES.INTERNAL_ERROR,
        'An unexpected error occurred',
        500
      );
    }
  },
};
