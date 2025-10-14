'use server';

import { revalidatePath } from 'next/cache';
import { membersService } from '../services/member.service';
import { handleError } from '@/lib/errors/error-handler';
import type { R } from '@/types/result';

export async function removeMemberAction(input: unknown): Promise<R> {
  try {
    await membersService.removeMember(input);

    revalidatePath('/workspace', 'layout');

    return {
      ok: true,
    };
  } catch (error) {
    return handleError(error);
  }
}
