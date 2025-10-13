'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

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
import { Separator } from '@/components/ui/separator';
import { useUploadThing } from '@/lib/utils/uploadthing';
import { updateProfileAction } from '@/features/user/actions';
import { updateProfileSchema, type UpdateProfileInput } from '@/features/user';

type ProfileFormProps = {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
};

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { startUpload, isUploading } = useUploadThing('avatarUploader');

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name,
      image: user.image ?? undefined,
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
        toast.error('Failed to upload avatar. Please try again.');
        return;
      }

      const uploadedFile = uploadedFiles[0];
      if (!uploadedFile?.ufsUrl) {
        toast.error('Upload completed but no URL received.');
        return;
      }

      form.setValue('image', uploadedFile.ufsUrl, {
        shouldDirty: true,
        shouldValidate: true,
      });

      toast.success('Avatar uploaded successfully');
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast.error('Failed to upload avatar. Please try again.');
    }
  };

  async function onSubmit(values: UpdateProfileInput) {
    setIsSubmitting(true);

    try {
      const result = await updateProfileAction(values);

      if (result.ok) {
        toast.success('Profile updated successfully');
        form.reset(values);
        router.refresh();
      } else {
        const errorMessage = getErrorMessage(result.code, result.message);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function getErrorMessage(code: string, defaultMessage?: string): string {
    const errorMessages: Record<string, string> = {
      UNAUTHORIZED: 'Please sign in to update your profile.',
      VALIDATION_ERROR: 'Please check your inputs and try again.',
      INVALID_INPUT: 'Please provide valid name and image.',
    };

    return errorMessages[code] ?? defaultMessage ?? 'Failed to update profile.';
  }

  function getUserInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  const currentImage = form.watch('image');
  const isFormDisabled = isSubmitting || isUploading;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full max-w-2xl'>
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your personal details and profile picture
            </CardDescription>
          </CardHeader>

          <CardContent className='space-y-6'>
            <div className='flex items-center gap-4'>
              <Avatar className='size-20'>
                <AvatarImage src={currentImage ?? undefined} alt={user.name} />
                <AvatarFallback className='text-lg'>
                  {getUserInitials(user.name)}
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
                    'Change avatar'
                  )}
                </Button>
                <input
                  type='file'
                  ref={fileInputRef}
                  className='hidden'
                  accept='image/*'
                  onChange={handleFileChange}
                  disabled={isFormDisabled}
                  aria-label='Upload avatar image'
                />
                <p className='text-xs text-muted-foreground'>
                  JPG, PNG or GIF. Max 2MB.
                </p>
              </div>
            </div>

            <FormField
              control={form.control}
              name='image'
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
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter your name'
                      disabled={isFormDisabled}
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your display name. It will be visible to other
                    users.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <div className='space-y-2'>
              <FormLabel>Email</FormLabel>
              <Input value={user.email} disabled className='bg-muted' />
              <p className='text-sm text-muted-foreground'>
                Your email address is managed by your authentication provider.
              </p>
            </div>
          </CardContent>

          <CardFooter>
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
