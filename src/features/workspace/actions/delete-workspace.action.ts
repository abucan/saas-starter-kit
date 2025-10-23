'use server';

import { revalidatePath } from 'next/cache';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { redirect } from 'next/navigation';

import { handleError } from '@/lib/errors/error-handler';
import { invalidateDashboardCache } from '@/lib/redis/cache-invalidation';
import type { R } from '@/types/result';

import { workspaceService } from '../services/workspace.service';

export async function deleteWorkspaceAction(): Promise<R> {
  try {
    await workspaceService.deleteWorkspace();

    await invalidateDashboardCache();

    revalidatePath('/workspace', 'layout');

    redirect('/dashboard');
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return handleError(error);
  }
}
