import { Invitation } from '@/lib/db/schemas/auth.schema';
import type { InvitationRow, Role } from '@/types/auth';

type RawInvitation = Invitation;

export function computeInvitationACL(
  invitation: RawInvitation,
  currentUserRole: Role,
  baseUrl: string
): InvitationRow {
  const acceptUrl = `${baseUrl}/accept-invitation/${invitation.id}`;

  const canManage = currentUserRole === 'owner' || currentUserRole === 'admin';
  const isPending = invitation.status === 'pending';

  return {
    ...invitation,
    acceptUrl,
    _acl: {
      canResend: canManage && isPending,
      canCancel: canManage && isPending,
      canCopy: isPending,
    },
  };
}
