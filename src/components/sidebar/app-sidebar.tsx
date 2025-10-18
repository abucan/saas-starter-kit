'use client';

import * as React from 'react';
import { BookOpen, Key } from 'lucide-react';

import { SidebarMain } from '@/components/sidebar/sidebar-main';
import { SidebarProjects } from '@/components/sidebar/sidebar-projects';
import { SidebarTeamSwitcher } from '@/components/sidebar/sidebar-team-switcher';
import { SidebarUser } from '@/components/sidebar/sidebar-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { navigationConfig } from '@/config/navigation';
import { SidebarContext } from '@/types/sidebar';

export function AppSidebar({
  ctx,
  ...props
}: React.ComponentProps<typeof Sidebar> & { ctx: SidebarContext }) {
  const data = React.useMemo(() => {
    return {
      navMain: navigationConfig.main,
      projects: [{ name: 'Keyvaultify (DEMO)', url: '#', icon: Key }],
      docs: { title: 'Documentation', url: '#', icon: BookOpen },
    };
  }, []);

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <SidebarTeamSwitcher
          teams={ctx?.teams ?? []}
          orgId={ctx.org.id}
          plan={ctx.subscription.plan}
        />
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
