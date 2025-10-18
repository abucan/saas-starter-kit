import { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { InvitationRow } from '@/types/auth';

import { CopyLinkButton } from './copy-link-button';
import { InvitationActionsCell } from './invitation-actions-cell';

const STATUS_STYLES: Record<
  string,
  {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
  }
> = {
  pending: { label: 'Pending', variant: 'secondary' },
  accepted: { label: 'Accepted', variant: 'default' },
  canceled: { label: 'Canceled', variant: 'outline' },
  rejected: { label: 'Rejected', variant: 'destructive' },
};

export const invitationsColumns: ColumnDef<InvitationRow>[] = [
  {
    accessorKey: 'email',
    header: () => <p className='text-sm font-bricolage-grotesque'>Email</p>,
    cell: ({ row }) => (
      <p className='text-sm font-medium font-bricolage-grotesque'>
        {row.original.email}
      </p>
    ),
  },
  {
    accessorKey: 'role',
    header: () => <p className='text-sm font-bricolage-grotesque'>Role</p>,
    cell: ({ row }) => (
      <p className='text-sm text-muted-foreground font-bricolage-grotesque capitalize'>
        {row.original.role}
      </p>
    ),
  },
  {
    accessorKey: 'expiresAt',
    header: () => <p className='text-sm font-bricolage-grotesque'>Expires</p>,
    cell: ({ row }) => (
      <p className='text-sm text-muted-foreground font-bricolage-grotesque'>
        {new Date(row.original.expiresAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>
    ),
  },
  {
    accessorKey: 'status',
    header: () => <p className='text-sm font-bricolage-grotesque'>Status</p>,
    cell: ({ row }) => {
      const status =
        STATUS_STYLES[row.original.status] || STATUS_STYLES.pending;
      return <Badge variant={status?.variant}>{status?.label}</Badge>;
    },
  },
  {
    id: 'actions',
    header: () => <p className='text-sm font-bricolage-grotesque'>Actions</p>,
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        <CopyLinkButton
          url={row.original.acceptUrl}
          canCopy={row.original._acl.canCopy}
        />
        <InvitationActionsCell invitation={row.original} />
      </div>
    ),
  },
];
