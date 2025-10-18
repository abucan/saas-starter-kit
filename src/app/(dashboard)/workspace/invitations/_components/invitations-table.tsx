'use client';

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Mail } from 'lucide-react';

import { Card } from '@/components/ui/card';
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
import type { InvitationRow, Role } from '@/types/auth';

import { invitationsColumns } from './invitations-columns';

type InvitationsTableProps = {
  invitations: InvitationRow[];
  currentUserRole: Role;
};

export function InvitationsTable({
  invitations,
  currentUserRole,
}: InvitationsTableProps) {
  const table = useReactTable({
    data: invitations,
    columns: invitationsColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className='flex flex-col gap-4 max-w-2xl w-full'>
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
                <TableCell
                  colSpan={invitationsColumns.length}
                  className='h-96 p-0'
                >
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant='icon'>
                        <Mail className='size-6' />
                      </EmptyMedia>
                      <EmptyTitle>No pending invitations</EmptyTitle>
                      <EmptyDescription>
                        There are no pending invitations for this workspace.
                        Invite members from the Members page.
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
