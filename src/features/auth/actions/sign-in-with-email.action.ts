'use server';

import { authService } from '../services/auth.service';
import { handleError } from '@/lib/errors/error-handler';
import type { R } from '@/types/result';
import type { SignInWithEmailInput } from '../types';

export async function signInWithEmailAction(input: unknown): Promise<R> {
  try {
    await authService.sendSignInOtp(input as SignInWithEmailInput);
    return { ok: true };
  } catch (error) {
    return handleError(error);
  }
}
