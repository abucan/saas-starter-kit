'use server';

import { revalidatePath } from 'next/cache';

import { handleError } from '@/lib/errors/error-handler';
import type { R } from '@/types/result';

import { userService } from '../services/user.service';

export async function updateProfileAction(input: unknown): Promise<R> {
  try {
    await userService.updateProfile(input);

    revalidatePath('/account', 'layout');
    return {
      ok: true,
    };
  } catch (error) {
    return handleError(error);
  }
}
