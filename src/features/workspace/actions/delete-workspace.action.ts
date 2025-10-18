'use server';

import { revalidatePath } from 'next/cache';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { redirect } from 'next/navigation';

import { handleError } from '@/lib/errors/error-handler';
import type { R } from '@/types/result';

import { workspaceService } from '../services/workspace.service';

export async function deleteWorkspaceAction(): Promise<R> {
  try {
    await workspaceService.deleteWorkspace();

    revalidatePath('/workspace', 'layout');

    redirect('/dashboard');
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return handleError(error);
  }
}
