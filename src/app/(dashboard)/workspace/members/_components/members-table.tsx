'use client';

import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import { Plus, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import type { MemberRow, Role } from '@/types/auth';
import { membersColumns } from './members-columns';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AddMemberForm } from './add-member-form';

type MembersTableProps = {
  members: MemberRow[];
  currentUserId: string;
  isPersonalWorkspace: boolean;
  defaultRole: Role;
  currentUserRole: Role;
};

export function MembersTable({
  members,
  currentUserId,
  isPersonalWorkspace,
  defaultRole,
  currentUserRole,
}: MembersTableProps) {
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);

  // Permission check: Only admins and owners can add members, and not in personal workspaces
  const canAddMembers =
    !isPersonalWorkspace &&
    (currentUserRole === 'owner' || currentUserRole === 'admin');

  // Determine tooltip message for disabled button
  const getDisabledReason = (): string => {
    if (isPersonalWorkspace) {
      return 'Cannot add members to personal workspace';
    }
    if (currentUserRole === 'member') {
      return 'Only workspace owners and admins can add members';
    }
    return 'You do not have permission to add members';
  };

  // Initialize TanStack Table
  const table = useReactTable({
    data: members,
    columns: membersColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className='flex flex-col gap-4 w-full'>
      {/* Add Member Button */}
      <Dialog open={addMemberDialogOpen} onOpenChange={setAddMemberDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Member</DialogTitle>
            <DialogDescription>
              Send an invitation to add a new member to your workspace.
            </DialogDescription>
          </DialogHeader>
          <AddMemberForm
            defaultRole={defaultRole}
            onSuccess={() => setAddMemberDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className='self-end'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setAddMemberDialogOpen(true)}
                disabled={!canAddMembers}
              >
                <Plus className='size-4' />
                <span className='font-bricolage-grotesque'>Add Member</span>
              </Button>
            </div>
          </TooltipTrigger>
          {!canAddMembers && (
            <TooltipContent>
              <p>{getDisabledReason()}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      {/* Members Table */}
      <Card className='overflow-hidden rounded-lg border p-0 w-full'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={membersColumns.length} className='h-96 p-0'>
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant='icon'>
                        <Users className='size-6' />
                      </EmptyMedia>
                      <EmptyTitle>No members found</EmptyTitle>
                      <EmptyDescription>
                        This workspace doesn&apos;t have any members yet.
                        {canAddMembers && (
                          <>
                            {' '}
                            Click the &quot;Add Member&quot; button above to
                            invite your first member.
                          </>
                        )}
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* TODO: Add Member Dialog - Implement in Phase 8 (Invitations) */}
      {/* <Dialog open={addMemberDialogOpen} onOpenChange={setAddMemberDialogOpen}>
        <DialogContent>
          <AddMemberForm
            defaultRole={defaultRole}
            onSuccess={() => setAddMemberDialogOpen(false)}
          />
        </DialogContent>
      </Dialog> */}
    </div>
  );
}
