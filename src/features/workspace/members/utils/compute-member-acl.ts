import { Member } from '@/lib/auth/auth';
import { FullOrganization, MemberRow, MemberWithUser, Role } from '@/types';

export function computeMemberACL(
  member: Member,
  currentUserId: string,
  currentUserRole: Role,
  org: FullOrganization
): MemberRow {
  const isSelf = member.userId === currentUserId;
  const isOwner = member.role === 'owner';
  const hasOtherOwners =
    org.members.filter((m: MemberWithUser) => m.role === 'owner').length > 1;

  const metadata =
    typeof org.metadata === 'string'
      ? JSON.parse(org.metadata)
      : org.metadata || {};

  const isPersonalOrg = metadata.isPersonal === true;
  const defaultRole = (metadata.default_role ?? 'member') as Role;

  const canEditRole =
    currentUserRole === 'owner' || (currentUserRole === 'admin' && !isOwner);

  const canSetOwner = currentUserRole === 'owner';

  const canRemove =
    !isSelf &&
    (currentUserRole === 'owner'
      ? !isOwner || hasOtherOwners
      : currentUserRole === 'admin'
      ? !isOwner
      : false);

  const canLeave = isSelf && (!isOwner || hasOtherOwners);

  const joinedAt = new Date(member.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return {
    ...member,
    createdAt: new Date(joinedAt),
    _acl: {
      canEditRole,
      canRemove,
      canLeave,
      canSetOwner,
    },
    _meta: {
      hasOtherOwners,
      isSelf,
      isOwner,
      isPersonalOrg,
      defaultRole,
    },
    user: {
      id: member.userId,
      name: member.user.name,
      email: member.user.email,
      image: member.user.image ?? null,
    },
  } satisfies MemberRow;
}
