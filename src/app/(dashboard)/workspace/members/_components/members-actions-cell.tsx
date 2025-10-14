'use client';

import { useState } from 'react';
import { LogOut, UserMinus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { MemberRow } from '@/types/auth';
import {
  removeMemberAction,
  leaveWorkspaceAction,
} from '@/features/workspace/members/actions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type MemberActionsCellProps = {
  member: MemberRow;
};

export function MemberActionsCell({ member }: MemberActionsCellProps) {
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  async function handleRemove() {
    setIsRemoving(true);

    try {
      const result = await removeMemberAction({
        memberId: member.id,
      });

      if (!result.ok) {
        const errorMessage = getRemoveErrorMessage(result.code, result.message);
        toast.error(errorMessage);
        setIsRemoving(false);
      } else {
        toast.success(
          `${member.user.name} has been removed from the workspace`
        );
        setRemoveDialogOpen(false);
        // Don't reset isRemoving - component will unmount on revalidation
      }
    } catch {
      toast.error('An unexpected error occurred');
      setIsRemoving(false);
    }
  }

  async function handleLeave() {
    setIsLeaving(true);

    try {
      const result = await leaveWorkspaceAction();

      if (!result.ok) {
        const errorMessage = getLeaveErrorMessage(result.code, result.message);
        toast.error(errorMessage);
        setIsLeaving(false);
      } else {
        toast.success('You have left the workspace');
        // Redirect happens in the action, so we don't close dialog
      }
    } catch {
      toast.error('An unexpected error occurred');
      setIsLeaving(false);
    }
  }

  function getRemoveErrorMessage(
    code: string,
    defaultMessage?: string
  ): string {
    const messages: Record<string, string> = {
      LAST_OWNER_PROTECTED:
        'Cannot remove the last owner. Transfer ownership first.',
      FORBIDDEN: 'You do not have permission to remove this member.',
      UNAUTHORIZED: 'Please sign in to continue.',
      INVALID_INPUT: 'Invalid member selection.',
    };
    return messages[code] ?? defaultMessage ?? 'Failed to remove member';
  }

  function getLeaveErrorMessage(code: string, defaultMessage?: string): string {
    const messages: Record<string, string> = {
      LAST_OWNER_PROTECTED:
        'You are the last owner. Transfer ownership before leaving.',
      FORBIDDEN: 'Cannot leave personal workspace.',
      UNAUTHORIZED: 'Please sign in to continue.',
    };
    return messages[code] ?? defaultMessage ?? 'Failed to leave workspace';
  }

  // Show nothing if no actions available
  if (!member._acl.canLeave && !member._acl.canRemove) {
    return <span className='text-sm text-muted-foreground'>—</span>;
  }

  return (
    <div className='flex items-center gap-2'>
      {/* Leave Button (for self) */}
      {member._acl.canLeave && (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setLeaveDialogOpen(true)}
                disabled={isLeaving}
              >
                <LogOut className='size-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Leave workspace</p>
            </TooltipContent>
          </Tooltip>

          <Dialog open={leaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Leave Workspace</DialogTitle>
                <DialogDescription>
                  Are you sure you want to leave this workspace?
                </DialogDescription>
              </DialogHeader>
              <div className='py-4'>
                <p className='text-sm text-muted-foreground'>
                  You will lose access to all workspace resources and projects.
                  {member._meta.isOwner && (
                    <span className='block mt-2 text-destructive font-medium'>
                      ⚠️ As an owner, you must transfer ownership to another
                      member before leaving.
                    </span>
                  )}
                </p>
              </div>
              <DialogFooter>
                <Button
                  variant='outline'
                  onClick={() => setLeaveDialogOpen(false)}
                  disabled={isLeaving}
                >
                  Cancel
                </Button>
                <Button
                  variant='destructive'
                  onClick={handleLeave}
                  disabled={isLeaving}
                >
                  {isLeaving ? (
                    <>
                      <Loader2 className='size-4 animate-spin' />
                      Leaving...
                    </>
                  ) : (
                    'Leave Workspace'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}

      {/* Remove Button (for others) */}
      {member._acl.canRemove && (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setRemoveDialogOpen(true)}
                disabled={isRemoving}
              >
                <UserMinus className='size-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Remove member</p>
            </TooltipContent>
          </Tooltip>

          <Dialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Remove Member</DialogTitle>
                <DialogDescription>
                  Are you sure you want to remove {member.user.name} from this
                  workspace?
                </DialogDescription>
              </DialogHeader>
              <div className='py-4'>
                <p className='text-sm text-muted-foreground'>
                  This member will immediately lose access to all workspace
                  resources. This action cannot be undone.
                  {member._meta.isOwner && (
                    <span className='block mt-2 text-destructive font-medium'>
                      ⚠️ This member is an owner. Ensure there are other owners
                      before removing.
                    </span>
                  )}
                </p>
              </div>
              <DialogFooter>
                <Button
                  variant='outline'
                  onClick={() => setRemoveDialogOpen(false)}
                  disabled={isRemoving}
                >
                  Cancel
                </Button>
                <Button
                  variant='destructive'
                  onClick={handleRemove}
                  disabled={isRemoving}
                >
                  {isRemoving ? (
                    <>
                      <Loader2 className='size-4 animate-spin' />
                      Removing...
                    </>
                  ) : (
                    'Remove Member'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
