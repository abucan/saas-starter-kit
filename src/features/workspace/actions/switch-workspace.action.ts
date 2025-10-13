'use server';

import { revalidatePath } from 'next/cache';
import { workspaceService } from '../services/workspace.service';
import { handleError } from '@/lib/errors/error-handler';
import type { R } from '@/types/result';

export async function switchWorkspaceAction(input: unknown): Promise<R> {
  try {
    await workspaceService.switchWorkspace(input);

    revalidatePath('/', 'layout');

    return { ok: true };
  } catch (error) {
    return handleError(error);
  }
}
