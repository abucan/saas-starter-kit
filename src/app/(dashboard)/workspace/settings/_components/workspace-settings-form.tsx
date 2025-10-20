'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Info, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  type UpdateWorkspaceInput,
  updateWorkspaceSchema,
} from '@/features/workspace/schemas/workspace.schema';
import type { Role } from '@/features/workspace/types';
import { useUploadThing } from '@/lib/utils/uploadthing';
import type { R } from '@/types/result';

type WorkspaceSettingsFormProps = {
  name: string;
  slug: string;
  logo: string | null;
  defaultRole: Role;
  isPersonal: boolean;
  canEdit: boolean;
  updateAction: (input: UpdateWorkspaceInput) => Promise<R>;
};

export function WorkspaceSettingsForm({
  name,
  slug,
  logo,
  defaultRole,
  isPersonal,
  canEdit,
  updateAction,
}: WorkspaceSettingsFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { startUpload, isUploading } = useUploadThing('avatarUploader');

  const form = useForm<UpdateWorkspaceInput>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      name,
      slug,
      logo: logo ?? undefined,
      defaultRole,
    },
  });

  const { isDirty, isValid } = form.formState;

  const handleChangeAvatar = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const uploadedFiles = await startUpload([file]);

      if (!uploadedFiles || uploadedFiles.length === 0) {
        toast.error('Failed to upload logo. Please try again.');
        return;
      }

      const uploadedFile = uploadedFiles[0];
      if (!uploadedFile?.ufsUrl) {
        toast.error('Upload completed but no URL received.');
        return;
      }

      form.setValue('logo', uploadedFile.ufsUrl, {
        shouldDirty: true,
        shouldValidate: true,
      });

      toast.success('Logo uploaded successfully');

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Logo upload error:', error);
      toast.error('Failed to upload logo. Please try again.');

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  async function onSubmit(values: UpdateWorkspaceInput) {
    setIsSubmitting(true);

    try {
      const result = await updateAction(values);

      if (result.ok) {
        toast.success('Workspace updated successfully');
        form.reset(values);
        router.refresh();
      } else {
        const errorMessage = getErrorMessage(result.code, result.message);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Workspace update error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function getErrorMessage(code: string, defaultMessage?: string): string {
    const errorMessages: Record<string, string> = {
      UNAUTHORIZED: 'Please sign in to update workspace settings.',
      FORBIDDEN: 'You do not have permission to update this workspace.',
      WORKSPACE_SLUG_TAKEN: 'This workspace slug is already in use.',
      ALREADY_EXISTS: 'This workspace slug is already in use.',
      CANNOT_MODIFY_PERSONAL_WORKSPACE:
        'Cannot modify slug or role settings for personal workspaces.',
      VALIDATION_ERROR: 'Please check your inputs and try again.',
      INVALID_INPUT: 'Please provide valid workspace details.',
    };

    return (
      errorMessages[code] ?? defaultMessage ?? 'Failed to update workspace.'
    );
  }

  function getWorkspaceInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  const currentLogo = form.watch('logo');
  const isFormDisabled = isSubmitting || isUploading || !canEdit;
  const isSlugDisabled = isFormDisabled || isPersonal;
  const isRoleDisabled = isFormDisabled || isPersonal;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full max-w-2xl'>
        <Card>
          <CardHeader>
            <CardTitle>Workspace Settings</CardTitle>
            <CardDescription>
              Manage your workspace name, identifier, and default member role
            </CardDescription>
          </CardHeader>

          <CardContent className='space-y-6'>
            <div className='flex items-center gap-4'>
              <Avatar className='size-20'>
                <AvatarImage
                  src={currentLogo ?? undefined}
                  alt={name}
                  className='object-cover'
                />
                <AvatarFallback className='text-lg'>
                  {getWorkspaceInitials(name)}
                </AvatarFallback>
              </Avatar>

              <div className='flex flex-col gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={handleChangeAvatar}
                  disabled={isFormDisabled}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className='mr-2 size-4 animate-spin' />
                      Uploading...
                    </>
                  ) : (
                    'Change logo'
                  )}
                </Button>
                <input
                  type='file'
                  ref={fileInputRef}
                  className='hidden'
                  accept='image/*'
                  onChange={handleFileChange}
                  disabled={isFormDisabled}
                  aria-label='Upload workspace logo'
                />
                <p className='text-xs text-muted-foreground'>
                  JPG, PNG or GIF. Max 2MB.
                </p>
              </div>
            </div>

            <FormField
              control={form.control}
              name='logo'
              render={({ field }) => (
                <FormItem className='hidden'>
                  <FormControl>
                    <Input type='hidden' {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter workspace name'
                      disabled={isFormDisabled}
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your workspace&apos;s display name. It will be
                    visible to all members.
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
                  <FormLabel className='flex items-center gap-2'>
                    Workspace Slug
                    {isPersonal && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className='size-4 text-muted-foreground cursor-help' />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className='max-w-xs'>
                            Personal workspace slugs cannot be changed. They are
                            automatically generated and tied to your account.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='workspace-slug'
                      disabled={isSlugDisabled}
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormDescription>
                    {isPersonal
                      ? 'Personal workspace slug is managed automatically.'
                      : 'A unique identifier for your workspace. Use lowercase letters, numbers, and hyphens only.'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <FormField
              control={form.control}
              name='defaultRole'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='flex items-center gap-2'>
                    Default Member Role
                    {isPersonal && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className='size-4 text-muted-foreground cursor-help' />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className='max-w-xs'>
                            Personal workspaces don&apos;t support inviting
                            members, so role settings are not applicable.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isRoleDisabled}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select default role' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='member'>Member</SelectItem>
                        <SelectItem value='admin'>Admin</SelectItem>
                        <SelectItem value='owner'>Owner</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    {isPersonal
                      ? 'Role management is not available for personal workspaces.'
                      : 'The default role assigned to new members when they accept an invitation to this workspace.'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className='flex items-center justify-between'>
            <div className='text-sm text-muted-foreground'>
              {!canEdit &&
                'You need owner or admin permissions to edit settings.'}
            </div>
            <Button
              type='submit'
              disabled={!isDirty || !isValid || isFormDisabled}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className='mr-2 size-4 animate-spin' />
                  Saving...
                </>
              ) : (
                'Save changes'
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
