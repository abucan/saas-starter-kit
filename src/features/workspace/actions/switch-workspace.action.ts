'use server';

import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { redirect } from 'next/navigation';

import { handleError } from '@/lib/errors/error-handler';
import { invalidateDashboardCache } from '@/lib/redis/cache-invalidation';
import type { R } from '@/types/result';

import { workspaceService } from '../services/workspace.service';

export async function switchWorkspaceAction(input: unknown): Promise<R> {
  try {
    await workspaceService.switchWorkspace(input);

    await invalidateDashboardCache();

    redirect('/dashboard');
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return handleError(error);
  }
}
