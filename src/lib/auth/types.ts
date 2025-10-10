/* TODO: SAFE DELETE LATER */
import type { bAuth } from './auth';

export type Session = typeof bAuth.$Infer.Session;
export type User = typeof bAuth.$Infer.Session.user;

export type BetterAuthOrganization = {
  id: string;
  name: string;
  slug: string | null;
  logo: string | null;
  createdAt: Date;
  metadata: Record<string, unknown> | null;
};

export type BetterAuthMember = {
  id: string;
  userId: string;
  organizationId: string;
  role: 'owner' | 'admin' | 'member';
  createdAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
};

export type FullOrganization = BetterAuthOrganization & {
  members: BetterAuthMember[];
  invitations: BetterAuthInvitation[];
};

export type BetterAuthInvitation = {
  id: string;
  organizationId: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | null;
  status: 'pending' | 'accepted' | 'rejected' | 'canceled';
  expiresAt: Date;
  inviterId: string;
};

export type ActiveMember = {
  id: string;
  userId: string;
  organizationId: string;
  role: 'owner' | 'admin' | 'member';
  createdAt: Date;
};
