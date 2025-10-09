import type {
  Organization,
  Member,
  Invitation,
} from '@/lib/db/schemas/auth.schema';

// Role Types
export type Role = 'owner' | 'admin' | 'member';
export type InvitationStatus = 'pending' | 'accepted' | 'rejected' | 'canceled';

// Organization Types
export type OrganizationWithMetadata = Organization & {
  metadata: {
    isPersonal?: boolean;
    default_role?: Role;
  } | null;
};

export type FullOrganization = Organization & {
  members: MemberWithUser[];
  invitations: Invitation[];
};

// Member Types
export type MemberWithUser = Member & {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
};

export type MemberRow = MemberWithUser & {
  _acl: {
    canEditRole: boolean;
    canRemove: boolean;
    canLeave: boolean;
    canSetOwner: boolean;
  };
  _meta: {
    hasOtherOwners: boolean;
    isSelf: boolean;
    isOwner: boolean;
    isPersonalOrg: boolean;
    defaultRole: Role;
  };
};

// Invitation Types
export type InvitationRow = Invitation & {
  acceptUrl: string;
  _acl: {
    canResend: boolean;
    canCancel: boolean;
    canCopy: boolean;
  };
};

// Session Types
export type SessionUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type SessionData = {
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress: string | null;
    userAgent: string | null;
    activeOrganizationId: string | null;
  };
  user: SessionUser;
};
