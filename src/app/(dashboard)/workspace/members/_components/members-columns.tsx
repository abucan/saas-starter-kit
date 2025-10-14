import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { MemberRow } from '@/types/auth';
import { RoleCell } from './role-cell';
import { MemberActionsCell } from './members-actions-cell';

export const membersColumns: ColumnDef<MemberRow>[] = [
  // Avatar + Name + Email column
  {
    accessorKey: 'user',
    header: () => <p className='text-sm font-bricolage-grotesque'>Member</p>,
    cell: ({ row }) => (
      <div className='flex items-center gap-3'>
        <Image
          src={row.original.user.image || '/avatars/shadcn.jfif'}
          alt={row.original.user.name}
          width={40}
          height={40}
          className='rounded-full'
        />
        <div className='flex flex-col'>
          <p className='text-sm font-medium font-bricolage-grotesque'>
            {row.original.user.name}
            {row.original._meta.isSelf && (
              <span className='ml-2 text-xs text-muted-foreground'>(You)</span>
            )}
          </p>
          <p className='text-sm text-muted-foreground font-bricolage-grotesque'>
            {row.original.user.email}
          </p>
        </div>
      </div>
    ),
  },
  // Joined At column
  {
    accessorKey: 'createdAt',
    header: () => <p className='text-sm font-bricolage-grotesque'>Joined</p>,
    cell: ({ row }) => (
      <p className='text-sm text-muted-foreground font-bricolage-grotesque'>
        {new Date(row.original.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>
    ),
  },
  // Role column
  {
    accessorKey: 'role',
    header: () => <p className='text-sm font-bricolage-grotesque'>Role</p>,
    cell: ({ row }) => <RoleCell member={row.original} />,
  },
  // Actions column
  {
    id: 'actions',
    header: () => <p className='text-sm font-bricolage-grotesque'>Actions</p>,
    cell: ({ row }) => <MemberActionsCell member={row.original} />,
  },
];
