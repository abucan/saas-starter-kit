'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { workspaceService } from '../services/workspace.service';
import { handleError } from '@/lib/errors/error-handler';
import type { R } from '@/types/result';

export async function deleteWorkspaceAction(): Promise<R> {
  try {
    await workspaceService.deleteWorkspace();

    revalidatePath('/workspace', 'layout');

    redirect('/dashboard');
  } catch (error) {
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error;
    }
    return handleError(error);
  }
}
