'use client';

import { useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Plus, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
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
import type { MemberRow, Role } from '@/types/auth';

import { AddMemberForm } from './add-member-form';
import { membersColumns } from './members-columns';

type MembersTableProps = {
  members: MemberRow[];
  currentUserId: string;
  isPersonalWorkspace: boolean;
  defaultRole: Role;
  currentUserRole: Role;
};

export function MembersTable({
  members,
  isPersonalWorkspace,
  defaultRole,
  currentUserRole,
}: MembersTableProps) {
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);

  const canAddMembers =
    !isPersonalWorkspace &&
    (currentUserRole === 'owner' || currentUserRole === 'admin');

  const getDisabledReason = (): string => {
    if (isPersonalWorkspace) {
      return 'Cannot add members to personal workspace';
    }
    if (currentUserRole === 'member') {
      return 'Only workspace owners and admins can add members';
    }
    return 'You do not have permission to add members';
  };

  const table = useReactTable({
    data: members,
    columns: membersColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className='flex flex-col gap-4 min-w-3/4'>
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
                <span>Add Member</span>
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

      <Card className='rounded-lg border p-0 w-full'>
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
    </div>
  );
}
