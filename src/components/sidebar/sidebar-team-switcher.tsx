'use client';

import * as React from 'react';
import { useState, useTransition } from 'react';
import Image from 'next/image';
import { ChevronsUpDown, Plus } from 'lucide-react';
import { toast } from 'sonner';

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
                <div className='text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                  <Image
                    src={activeTeam?.logo ?? '/avatars/apple.png'}
                    alt={activeTeam?.name ?? 'team logo'}
                    width={32}
                    height={32}
                    className='rounded-lg w-full h-full'
                  />
                </div>
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
                      const res = await switchWorkspaceAction({
                        workspaceId: team.id,
                      });
                      if (!res.ok) {
                        toast.error(
                          res.message || 'Failed to switch workspace'
                        );
                      }
                    });
                  }}
                >
                  <div className='flex size-6 items-center justify-center rounded-md border'>
                    <Image
                      src={team.logo ?? '/avatars/apple.png'}
                      alt={team.name ?? 'team logo'}
                      width={32}
                      height={32}
                      className='rounded-md w-full h-full'
                    />
                  </div>
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
