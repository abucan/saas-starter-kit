'use server';

import { revalidatePath } from 'next/cache';

import { handleError } from '@/lib/errors/error-handler';
import type { R } from '@/types/result';

import { workspaceService } from '../services/workspace.service';

export async function updateWorkspaceAction(input: unknown): Promise<R> {
  try {
    await workspaceService.updateWorkspace(input);

    revalidatePath('/workspace', 'layout');

    return { ok: true };
  } catch (error) {
    return handleError(error);
  }
}
