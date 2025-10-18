'use server';

import { handleError } from '@/lib/errors/error-handler';
import type { R } from '@/types/result';

import { userService } from '../services/user.service';

export async function deleteProfileAction(): Promise<R> {
  try {
    await userService.deleteProfile();
    return {
      ok: true,
    };
  } catch (error) {
    return handleError(error);
  }
}
