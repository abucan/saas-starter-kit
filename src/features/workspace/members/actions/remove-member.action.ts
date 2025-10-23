'use server';

import { revalidatePath } from 'next/cache';

import { handleError } from '@/lib/errors/error-handler';
import { invalidateDashboardCache } from '@/lib/redis/cache-invalidation';
import type { R } from '@/types/result';

import { membersService } from '../services/member.service';

export async function removeMemberAction(input: unknown): Promise<R> {
  try {
    await membersService.removeMember(input);

    await invalidateDashboardCache();

    revalidatePath('/workspace', 'layout');

    return {
      ok: true,
    };
  } catch (error) {
    return handleError(error);
  }
}
