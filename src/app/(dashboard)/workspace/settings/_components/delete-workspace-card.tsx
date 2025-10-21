'use client';

import { useState } from 'react';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { R } from '@/types/result';

export function DeleteWorkspaceCard({ action }: { action: () => Promise<R> }) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleInitialClick = () => {
    setIsConfirming(true);
    setIsDeleting(true);
  };

  const handleCancel = () => {
    setIsConfirming(false);
    setIsDeleting(false);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);

    try {
      const result = await action();

      if (result.ok) {
        toast.success('Workspace deleted successfully');
        setIsDeleting(false);
        setIsConfirming(false);
      }

      if (!result.ok) {
        const errorMessage = getErrorMessage(result.code, result.message);
        toast.error(errorMessage);
        setIsDeleting(false);
        setIsConfirming(false);
      }
    } catch (error) {
      if (isRedirectError(error)) {
        throw error;
      }

      toast.error('An unexpected error occurred');
      setIsDeleting(false);
      setIsConfirming(false);
    }
  };

  function getErrorMessage(code: string, defaultMessage?: string): string {
    const errorMessages: Record<string, string> = {
      FORBIDDEN:
        'You must transfer ownership of your workspace before deleting it',
      UNAUTHORIZED: 'Please sign in to delete your workspace',
      INTERNAL_ERROR: 'Something went wrong. Please try again later',
    };

    return (
      errorMessages[code] ?? defaultMessage ?? 'Failed to delete workspace'
    );
  }

  return (
    <>
      <AlertDialog open={isConfirming} onOpenChange={setIsConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this workspace, all projects, remove
              all members, and all associated data. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className='bg-destructive text-white hover:bg-destructive/90'
              onClick={handleConfirmDelete}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Card className='w-full max-w-2xl'>
        <CardHeader>
          <CardTitle>Delete Workspace</CardTitle>
          <CardDescription>
            Permanently delete this workspace and all associated data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-row items-center gap-4'>
            <AlertTriangle className='size-6 text-destructive shrink-0' />
            <p className='text-sm text-muted-foreground'>
              This action{' '}
              <strong className='text-foreground'>cannot be undone</strong>.
              This workspace and all data will be permanently deleted.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant='destructive'
            onClick={handleInitialClick}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className='size-4 animate-spin' />
                Please wait...
              </>
            ) : (
              'Delete Workspace'
            )}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
