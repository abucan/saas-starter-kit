'use server';

import { revalidatePath } from 'next/cache';

import { handleError } from '@/lib/errors/error-handler';
import { invalidateDashboardCache } from '@/lib/redis/cache-invalidation';
import type { R } from '@/types/result';

import { workspaceService } from '../services/workspace.service';

export async function updateWorkspaceAction(input: unknown): Promise<R> {
  try {
    await workspaceService.updateWorkspace(input);

    await invalidateDashboardCache();

    revalidatePath('/workspace', 'layout');

    return { ok: true };
  } catch (error) {
    return handleError(error);
  }
}
