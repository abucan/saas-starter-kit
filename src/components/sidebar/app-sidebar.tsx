'use client';

import * as React from 'react';
import { BookOpen, Home, Key, User, Users } from 'lucide-react';

import { SidebarMain } from '@/components/sidebar/sidebar-main';
import { SidebarProjects } from '@/components/sidebar/sidebar-projects';
import { SidebarUser } from '@/components/sidebar/sidebar-user';
import { SidebarTeamSwitcher } from '@/components/sidebar/sidebar-team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Organization } from '@/lib/auth/auth';

export type AppSidebarProps = {
  ctx: {
    user: {
      id: string;
      email: string;
      name: string | null;
      image: string | null;
    };
    org: { id: string; slug: string; name: string; isPersonal?: boolean };
    membership: { role: 'owner' | 'admin' | 'member' };
    teams: Organization[] | undefined;
  };
};

export function AppSidebar({
  ctx,
  ...props
}: React.ComponentProps<typeof Sidebar> & AppSidebarProps) {
  const data = React.useMemo(() => {
    return {
      navMain: [
        { title: 'Dashboard', url: '/dashboard', icon: Home },
        {
          title: 'Workspace',
          url: '/workspace',
          icon: Users,
          items: [
            { title: 'Overview', url: '/workspace/overview' },
            { title: 'Members', url: '/workspace/members' },
            { title: 'Invitations', url: '/workspace/invitations' },
            { title: 'Settings', url: '/workspace/settings' },
          ],
        },
        {
          title: 'Account',
          url: '/account',
          icon: User,
          items: [
            { title: 'Profile', url: '/account/profile' },
            { title: 'Billing', url: '/account/billing' },
            { title: 'Security', url: '/account/security' },
          ],
        },
      ],
      projects: [{ name: 'Keyvaultify (DEMO)', url: '#', icon: Key }],
      docs: { title: 'Documentation', url: '#', icon: BookOpen },
    };
  }, []);

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <SidebarTeamSwitcher teams={ctx?.teams ?? []} orgId={ctx.org.id} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMain items={data.navMain} />
        <SidebarProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarUser user={ctx.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
