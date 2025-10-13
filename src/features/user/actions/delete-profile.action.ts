'use server';

import { redirect } from 'next/navigation';
import { userService } from '../services/user.service';
import { handleError } from '@/lib/errors/error-handler';
import type { R } from '@/types/result';

export async function deleteProfileAction(): Promise<R> {
  try {
    await userService.deleteProfile();
    redirect('/signin');
  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error;
    }
    return handleError(error);
  }
}
