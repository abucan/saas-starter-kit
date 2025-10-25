'use client';

import * as React from 'react';
import { useState, useTransition } from 'react';
import { BProgress } from '@bprogress/core';
import { ChevronsUpDown, Plus } from 'lucide-react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Entitlements } from '@/features/billing/types';
import { switchWorkspaceAction } from '@/features/workspace/actions/switch-workspace.action';
import { Organization } from '@/lib/auth/auth';

import { CreateWorkspaceDialog } from './create-workspace-dialog';

export function SidebarTeamSwitcher({
  teams,
  orgId,
  plan,
}: {
  teams: Organization[];
  orgId: string | null;
  plan: Entitlements['plan'];
}) {
  const [pending, startTransition] = useTransition();

  const { isMobile } = useSidebar();

  const [addWorkspaceDialogOpen, setAddWorkspaceDialogOpen] = useState(false);

  const activeTeam = React.useMemo(
    () => teams.find((t) => t.id === orgId) ?? teams[0],
    [teams, orgId]
  );

  return (
    <>
      <CreateWorkspaceDialog
        open={addWorkspaceDialogOpen}
        onOpenChange={setAddWorkspaceDialogOpen}
      />
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size='lg'
                className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer'
              >
                <Avatar className='size-8 rounded-lg'>
                  <AvatarImage
                    src={activeTeam?.logo ?? '/avatars/shadcn.jfif'}
                    alt={activeTeam?.name ?? 'team logo'}
                  />
                  <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>
                    {activeTeam?.name}
                  </span>
                  <span className='truncate text-xs'>
                    {plan
                      ? `${plan.charAt(0).toUpperCase()}${plan.slice(1)}`
                      : 'Hobby'}
                  </span>
                </div>
                <ChevronsUpDown className='ml-auto' />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
              align='start'
              side={isMobile ? 'bottom' : 'right'}
              sideOffset={4}
            >
              <DropdownMenuLabel className='text-muted-foreground text-xs'>
                Workspaces
              </DropdownMenuLabel>
              {teams.map((team) => (
                <DropdownMenuItem
                  key={team.slug}
                  className='gap-2 p-2'
                  onClick={() => {
                    startTransition(async () => {
                      BProgress.start();
                      try {
                        const res = await switchWorkspaceAction({
                          workspaceId: team.id,
                        });
                        if (!res.ok) {
                          toast.error(
                            res.message || 'Failed to switch workspace'
                          );
                        }
                      } finally {
                        BProgress.done(true);
                      }
                    });
                  }}
                >
                  <Avatar className='size-8 rounded-lg'>
                    <AvatarImage
                      src={team.logo ?? '/avatars/shadcn.jfif'}
                      alt={team.name ?? 'team logo'}
                    />
                    <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
                  </Avatar>

                  {team.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className='gap-2 p-2'
                onClick={() => setAddWorkspaceDialogOpen(true)}
                disabled={pending}
              >
                <div className='flex flex-row items-center gap-2'>
                  <div className='flex size-6 items-center justify-center rounded-md border bg-transparent'>
                    <Plus className='size-4' />
                  </div>
                  <div className='text-muted-foreground font-medium'>
                    Add workspace
                  </div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}
