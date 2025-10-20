'use server';

import { redirect } from 'next/navigation';

import { handleError } from '@/lib/errors/error-handler';
import type { R } from '@/types/result';

import { membersService } from '../services/member.service';

export async function leaveWorkspaceAction(): Promise<R> {
  try {
    await membersService.leaveWorkspace();
    redirect('/dashboard');
  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error;
    }

    return handleError(error);
  }
}
