'use server';

import { revalidatePath } from 'next/cache';

import { handleError } from '@/lib/errors/error-handler';
import type { R } from '@/types/result';

import { workspaceService } from '../services/workspace.service';

export async function createWorkspaceAction(
  input: unknown
): Promise<R<{ id: string; slug: string }>> {
  try {
    const workspace = await workspaceService.createWorkspace(input);

    revalidatePath('/workspace', 'layout');

    return {
      ok: true,
      data: workspace,
    };
  } catch (error) {
    return handleError(error) as R<{ id: string; slug: string }>;
  }
}
