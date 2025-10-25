'use client';

import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createWorkspaceAction } from '@/features/workspace/actions/create-workspace.action';
import {
  type CreateWorkspaceInput,
  createWorkspaceSchema,
} from '@/features/workspace/schemas/workspace.schema';

type CreateWorkspaceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreateWorkspaceDialog({
  open,
  onOpenChange,
}: CreateWorkspaceDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateWorkspaceInput>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: '',
      slug: '',
    },
  });

  const watchName = form.watch('name');
  useEffect(() => {
    if (watchName && !form.formState.dirtyFields.slug) {
      const generatedSlug = watchName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      form.setValue('slug', generatedSlug, { shouldValidate: false });
    }
  }, [watchName, form]);

  async function onSubmit(values: CreateWorkspaceInput) {
    setIsSubmitting(true);

    try {
      const result = await createWorkspaceAction(values);

      if (result.ok) {
        toast.success('Workspace created successfully');
        form.reset();
        onOpenChange(false);
        // router.push('/workspace/settings');
        // router.refresh();
      } else {
        const errorMessage = getErrorMessage(result.code, result.message);
        toast.error(errorMessage);

        if (
          result.code === 'WORKSPACE_SLUG_TAKEN' ||
          result.code === 'ALREADY_EXISTS'
        ) {
          form.setError('slug', {
            type: 'manual',
            message: 'This slug is already in use. Please choose another.',
          });
        }
      }
    } catch (error) {
      console.error('Workspace creation error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function getErrorMessage(code: string, defaultMessage?: string): string {
    const errorMessages: Record<string, string> = {
      UNAUTHORIZED: 'Please sign in to create a workspace.',
      VALIDATION_ERROR: 'Please check your inputs and try again.',
      INVALID_INPUT: 'Please provide a valid workspace name and slug.',
      WORKSPACE_SLUG_TAKEN:
        'This slug is already in use. Please choose another.',
      ALREADY_EXISTS: 'A workspace with this slug already exists.',
    };

    return (
      errorMessages[code] ?? defaultMessage ?? 'Failed to create workspace.'
    );
  }

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const isFormDisabled = isSubmitting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>Create Workspace</DialogTitle>
          <DialogDescription>
            Create a new workspace to collaborate with your team.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Acme Inc.'
                      disabled={isFormDisabled}
                      autoFocus
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your workspace&apos;s display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='slug'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace Slug</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='acme-inc'
                      disabled={isFormDisabled}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A unique identifier for your workspace. Only lowercase
                    letters, numbers, and hyphens.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
                disabled={isFormDisabled}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isFormDisabled}>
                {isSubmitting ? (
                  <>
                    <Loader2 className='mr-2 size-4 animate-spin' />
                    Creating...
                  </>
                ) : (
                  'Create Workspace'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
