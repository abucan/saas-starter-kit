import Image from 'next/image';
import { ColumnDef } from '@tanstack/react-table';

import { MemberRow } from '@/types/auth';

import { MemberActionsCell } from './members-actions-cell';
import { RoleCell } from './role-cell';

export const membersColumns: ColumnDef<MemberRow>[] = [
  {
    accessorKey: 'user',
    header: () => <p className='text-sm'>Member</p>,
    cell: ({ row }) => (
      <div className='flex items-center gap-3'>
        <Image
          src={row.original.user.image || '/avatars/apple.png'}
          alt={row.original.user.name}
          width={40}
          height={40}
          className='rounded-full'
        />
        <div className='flex flex-col'>
          <p className='text-sm font-medium'>
            {row.original.user.name}
            {row.original._meta.isSelf && (
              <span className='ml-2 text-xs text-muted-foreground'>(You)</span>
            )}
          </p>
          <p className='text-sm text-muted-foreground'>
            {row.original.user.email}
          </p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: () => <p className='text-sm'>Joined</p>,
    cell: ({ row }) => (
      <p className='text-sm text-muted-foreground'>
        {new Date(row.original.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>
    ),
  },
  {
    accessorKey: 'role',
    header: () => <p className='text-sm'>Role</p>,
    cell: ({ row }) => <RoleCell member={row.original} />,
  },
  {
    id: 'actions',
    header: () => <p className='text-sm'>Actions</p>,
    cell: ({ row }) => <MemberActionsCell member={row.original} />,
  },
];
