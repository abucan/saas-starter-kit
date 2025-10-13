'use server';

import { revalidatePath } from 'next/cache';
import { userService } from '../services/user.service';
import { handleError } from '@/lib/errors/error-handler';
import type { R } from '@/types/result';

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
