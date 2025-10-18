import { ZodError } from 'zod';

import { R } from '@/types/result';

import { AppError } from './app-error';
import { ERROR_CODES } from './error-codes';

type BetterAuthError = {
  body?: { code?: string; message?: string };
  status?: string;
  statusCode?: number;
  message?: string;
};

function isBetterAuthError(error: unknown): error is BetterAuthError {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  const err = error as Record<string, unknown>;

  return (
    ('statusCode' in err && typeof err.statusCode === 'number') ||
    ('status' in err &&
      (typeof err.status === 'string' || typeof err.status === 'number')) ||
    'body' in err
  );
}

function formatZodError(error: ZodError): string {
  const errors = error.issues.map((err) => {
    const path = err.path.join('.');
    return path ? `${path}: ${err.message}` : err.message;
  });
  return errors.join(', ');
}

export function handleError(error: unknown): R {
  if (error instanceof AppError) {
    return {
      ok: false,
      code: error.code,
      message: error.message,
    };
  }

  if (error instanceof ZodError) {
    return {
      ok: false,
      code: ERROR_CODES.VALIDATION_ERROR,
      message: formatZodError(error),
    };
  }

  if (isBetterAuthError(error)) {
    const betterAuthError = error as BetterAuthError;
    if (betterAuthError.body?.code) {
      return {
        ok: false,
        code: betterAuthError.body.code,
        message: betterAuthError.body.message || 'Authentication error',
      };
    }

    if (
      betterAuthError.status === 'UNAUTHORIZED' ||
      betterAuthError.statusCode === 401
    ) {
      return {
        ok: false,
        code: ERROR_CODES.UNAUTHORIZED,
        message: 'You must be signed in to perform this action',
      };
    }

    if (betterAuthError.statusCode) {
      return {
        ok: false,
        code: ERROR_CODES.INTERNAL_ERROR,
        message:
          betterAuthError.message ||
          `Authentication error (${betterAuthError.statusCode})`,
      };
    }
  }

  if (error instanceof Error) {
    console.error('❌ Unhandled error 1:', error);
    return {
      ok: false,
      code: ERROR_CODES.INTERNAL_ERROR,
      message: error.message || 'Unexpected error occurred',
    };
  }

  console.error('❌ Unhandled error 2:', error);
  return {
    ok: false,
    code: ERROR_CODES.UNKNOWN_ERROR,
    message: 'An unexpected error occurred',
  };
}

export async function handleErrorAsync<T>(
  fn: () => Promise<R<T>>
): Promise<R<T>> {
  try {
    return await fn();
  } catch (error) {
    return handleError(error) as R<T>;
  }
}
