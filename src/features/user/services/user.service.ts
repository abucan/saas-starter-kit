import 'server-only';

import { headers } from 'next/headers';

import { auth } from '@/lib/auth/auth';

import { updateProfileSchema } from '../schemas/user.schema';

export const userService = {
  async updateProfile(input: unknown): Promise<void> {
    const validated = updateProfileSchema.parse(input);

    const payload: { name?: string; image?: string } = {};
    if (validated.name !== undefined) {
      payload.name = validated.name;
    }
    if (validated.image !== undefined) {
      payload.image = validated.image;
    }

    await auth.api.updateUser({
      headers: await headers(),
      body: payload,
    });
  },

  async deleteProfile(): Promise<void> {
    await auth.api.deleteUser({
      headers: await headers(),
      body: {
        callbackURL: '/signin',
      },
    });
  },
};
