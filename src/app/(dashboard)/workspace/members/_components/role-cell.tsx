'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { updateMemberRoleAction } from '@/features/workspace/members/actions/update-role.action';
import type { MemberRow, Role } from '@/types/auth';

type RoleCellProps = {
  member: MemberRow;
};

export function RoleCell({ member }: RoleCellProps) {
  const [optimisticRole, setOptimisticRole] = useState<Role>(
    member.role as Role
  );
  const [isPending, startTransition] = useTransition();

  async function handleRoleChange(newRole: Role) {
    const previousRole = optimisticRole;
    setOptimisticRole(newRole);

    startTransition(async () => {
      const result = await updateMemberRoleAction({
        memberId: member.id,
        role: newRole,
      });

      if (!result.ok) {
        setOptimisticRole(previousRole);
        const errorMessage = getErrorMessage(result.code, result.message);
        toast.error(errorMessage);
      } else {
        toast.success(
          `Role updated to ${
            newRole.charAt(0).toUpperCase() + newRole.slice(1)
          }`
        );
      }
    });
  }

  function getErrorMessage(code: string, defaultMessage?: string): string {
    const messages: Record<string, string> = {
      LAST_OWNER_PROTECTED:
        'Cannot demote the last owner. Transfer ownership first.',
      FORBIDDEN: 'You do not have permission to change this role.',
      UNAUTHORIZED: 'Please sign in to continue.',
      INVALID_INPUT: 'Invalid role selection.',
    };
    return messages[code] ?? defaultMessage ?? 'Failed to update role';
  }

  const isDisabled = isPending || !member._acl.canEditRole;
  const cannotDemoteLastOwner =
    member._meta.isOwner && !member._meta.hasOtherOwners;

  return (
    <Select
      value={optimisticRole}
      onValueChange={(value) => handleRoleChange(value as Role)}
      disabled={isDisabled}
    >
      <SelectTrigger className='w-[120px]'>
        <SelectValue placeholder='Role' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem
          value='owner'
          disabled={
            !member._acl.canEditRole ||
            (!member._acl.canSetOwner && member.role !== 'owner')
          }
        >
          Owner
        </SelectItem>
        <SelectItem
          value='admin'
          disabled={
            !member._acl.canEditRole ||
            (cannotDemoteLastOwner && optimisticRole === 'owner')
          }
        >
          Admin
        </SelectItem>
        <SelectItem
          value='member'
          disabled={
            !member._acl.canEditRole ||
            (cannotDemoteLastOwner && optimisticRole === 'owner')
          }
        >
          Member
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
