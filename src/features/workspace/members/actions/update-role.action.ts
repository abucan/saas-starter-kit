'use server';

import { revalidatePath } from 'next/cache';

import { handleError } from '@/lib/errors/error-handler';
import type { R } from '@/types/result';

import { membersService } from '../services/member.service';

export async function updateMemberRoleAction(
  input: unknown
): Promise<R<{ role: string }>> {
  try {
    const result = await membersService.updateMemberRole(input);

    revalidatePath('/workspace', 'layout');

    return {
      ok: true,
      data: result,
    };
  } catch (error) {
    return handleError(error) as R<{ role: string }>;
  }
}
