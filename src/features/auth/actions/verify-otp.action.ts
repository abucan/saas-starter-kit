'use server';

import { redirect } from 'next/navigation';
import { authService } from '../services/auth.service';
import { handleError } from '@/lib/errors/error-handler';
import type { R } from '@/types/result';
import type { VerifyOtpInput } from '../types';

type RedirectPath = '/dashboard' | (string & {});

export async function verifyOtpAction(input: unknown): Promise<R> {
  try {
    const { email, otp, next } = input as VerifyOtpInput & { next?: string };

    let nextPath: RedirectPath = '/dashboard';
    if (
      next &&
      typeof next === 'string' &&
      next.startsWith('/') &&
      !next.startsWith('//')
    ) {
      nextPath = next;
    }

    await authService.verifySignInOtp({ email, otp });
    redirect(nextPath as '/dashboard');
  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error;
    }
    return handleError(error);
  }
}
