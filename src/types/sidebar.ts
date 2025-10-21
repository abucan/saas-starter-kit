import { Entitlements } from '@/features/billing/types';
import { Organization } from '@/lib/auth/auth';
import { InvitationRow, MemberRow } from '@/types/auth';

export type SidebarContext = {
  user: {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
  };
  org: {
    id: string;
    slug: string;
    name: string;
    isPersonal?: boolean;
  };
  membership: {
    role: 'owner' | 'admin' | 'member';
  };
  teams: Organization[] | undefined;
  members: MemberRow[] | undefined;
  invitations: InvitationRow[] | undefined;
  subscription: Entitlements;
};
