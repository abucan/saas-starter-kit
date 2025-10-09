'use server';

import { authService } from '../services/auth.service';
import { handleError } from '@/lib/errors/error-handler';
import type { R } from '@/types/result';
import type { ResendOtpInput } from '../types';

export async function resendOtpAction(input: unknown): Promise<R> {
  try {
    await authService.resendSignInOtp(input as ResendOtpInput);
    return { ok: true };
  } catch (error) {
    return handleError(error);
  }
}
