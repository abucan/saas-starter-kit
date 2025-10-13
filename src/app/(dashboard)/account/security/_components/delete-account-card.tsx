'use client';

import { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { deleteProfileAction } from '@/features/user/actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function DeleteAccountCard() {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleInitialClick = () => {
    setIsConfirming(true);
  };

  const handleCancel = () => {
    setIsConfirming(false);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);

    try {
      const result = await deleteProfileAction();

      if (!result.ok) {
        const errorMessage = getErrorMessage(result.code, result.message);
        toast.error(errorMessage);
        setIsDeleting(false);
        setIsConfirming(false);
      }
    } catch {
      toast.error('An unexpected error occurred');
      setIsDeleting(false);
      setIsConfirming(false);
    }
  };

  function getErrorMessage(code: string, defaultMessage?: string): string {
    const errorMessages: Record<string, string> = {
      FORBIDDEN:
        'You must transfer ownership of your workspaces before deleting your account.',
      UNAUTHORIZED: 'Please sign in to delete your account.',
      INTERNAL_ERROR: 'Something went wrong. Please try again later.',
    };

    return errorMessages[code] ?? defaultMessage ?? 'Failed to delete account.';
  }

  return (
    <Card className='border-destructive/50'>
      <CardHeader className='gap-0'>
        <CardTitle className='text-base font-bold font-bricolage-grotesque text-destructive'>
          Delete Account
        </CardTitle>
        <CardDescription className='text-sm font-bricolage-grotesque'>
          Permanently delete your account and all associated data
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='flex flex-row items-start gap-4'>
          <AlertTriangle className='size-6 text-destructive shrink-0 mt-0.5' />
          <div className='flex flex-col gap-2'>
            <p className='text-sm text-muted-foreground font-bricolage-grotesque'>
              This action{' '}
              <strong className='text-foreground'>cannot be undone</strong>.
              This will permanently delete your account and remove all your data
              from our servers.
            </p>
            {!isConfirming && (
              <p className='text-sm text-muted-foreground font-bricolage-grotesque'>
                If you are the{' '}
                <strong className='text-foreground'>sole owner</strong> of any
                workspaces, you must transfer ownership before deleting your
                account.
              </p>
            )}
          </div>
        </div>

        {isConfirming && (
          <>
            <Separator />
            <div className='bg-destructive/10 border border-destructive/20 rounded-lg p-4'>
              <p className='text-sm font-semibold text-destructive font-bricolage-grotesque mb-2'>
                ⚠️ Final Warning
              </p>
              <p className='text-sm text-muted-foreground font-bricolage-grotesque'>
                Are you absolutely sure you want to delete your account? All
                your data will be permanently lost.
              </p>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className='flex gap-2'>
        {!isConfirming ? (
          <Button
            variant='destructive'
            onClick={handleInitialClick}
            disabled={isDeleting}
          >
            Delete Account
          </Button>
        ) : (
          <>
            <Button
              variant='outline'
              onClick={handleCancel}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className='size-4 animate-spin' />
                  Deleting...
                </>
              ) : (
                'Confirm Deletion'
              )}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
