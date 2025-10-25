'use client';

import { useTransition } from 'react';
import { Loader2, Mail, X } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { cancelInvitationAction } from '@/features/workspace/invitations/actions/cancel-invitation.action';
import { resendInvitationAction } from '@/features/workspace/invitations/actions/resend-invitation.action';
import type { InvitationRow } from '@/types/auth';

type InvitationActionsCellProps = {
  invitation: InvitationRow;
};

export function InvitationActionsCell({
  invitation,
}: InvitationActionsCellProps) {
  const [isResending, startResend] = useTransition();
  const [isCanceling, startCancel] = useTransition();

  async function handleResend() {
    startResend(async () => {
      const result = await resendInvitationAction({
        email: invitation.email,
        role: invitation.role,
      });

      if (result.ok) {
        toast.success(`Invitation resent to ${result.data?.email}`);
      } else {
        const errorMessage = getErrorMessage(result.code, result.message);
        toast.error(errorMessage);
      }
    });
  }

  async function handleCancel() {
    startCancel(async () => {
      const result = await cancelInvitationAction({
        invitationId: invitation.id,
      });

      if (result.ok) {
        toast.success(`Invitation canceled for ${result.data?.email}`);
      } else {
        const errorMessage = getErrorMessage(result.code, result.message);
        toast.error(errorMessage);
      }
    });
  }

  function getErrorMessage(code: string, defaultMessage?: string): string {
    const messages: Record<string, string> = {
      FORBIDDEN: 'You do not have permission to perform this action.',
      UNAUTHORIZED: 'Please sign in to continue.',
      INVALID_INPUT: 'Invalid invitation data.',
    };
    return messages[code] ?? defaultMessage ?? 'Operation failed';
  }

  return (
    <div className='flex items-center gap-2'>
      <ButtonGroup>
        <Button
          variant='outline'
          size='sm'
          onClick={handleResend}
          disabled={isResending || !invitation._acl.canResend}
        >
          {isResending ? (
            <Loader2 className='size-4 animate-spin' />
          ) : (
            <Mail className='size-4' />
          )}
          <span>Resend</span>
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={handleCancel}
          disabled={isCanceling || !invitation._acl.canCancel}
        >
          {isCanceling ? (
            <Loader2 className='size-4 animate-spin' />
          ) : (
            <X className='size-4' />
          )}
          <span>Cancel</span>
        </Button>
      </ButtonGroup>
    </div>
  );
}
