'use server';

import { revalidatePath } from 'next/cache';

import { handleError } from '@/lib/errors';
import { R } from '@/types/result';

import { invitationsService } from '../services/invitations.service';

export async function cancelInvitationAction(
  input: unknown
): Promise<R<{ email: string }>> {
  try {
    const result = await invitationsService.cancelInvitation(input);
    revalidatePath('/workspace', 'layout');
    return { ok: true, data: result };
  } catch (error) {
    return handleError(error) as R<{ email: string }>;
  }
}
