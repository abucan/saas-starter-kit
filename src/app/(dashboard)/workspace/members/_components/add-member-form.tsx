'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
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
import type { Role } from '@/types/auth';
import { inviteMemberAction } from '@/features/workspace/invitations/actions';
import {
  inviteMemberSchema,
  type InviteMemberInput,
} from '@/features/workspace/invitations/schemas/invitations.schema';

type AddMemberFormProps = {
  defaultRole: Role;
  onSuccess: () => void;
};

export function AddMemberForm({ defaultRole, onSuccess }: AddMemberFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<InviteMemberInput>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      email: '',
      role: defaultRole,
    },
    mode: 'onSubmit',
  });

  async function onSubmit(values: InviteMemberInput) {
    startTransition(async () => {
      const result = await inviteMemberAction(values);

      if (result.ok) {
        toast.success(`Invitation sent to ${result.data?.email}`);
        form.reset();
        onSuccess();
      } else {
        const errorMessage = getErrorMessage(result.code, result.message);
        toast.error(errorMessage);
      }
    });
  }

  function getErrorMessage(code: string, defaultMessage?: string): string {
    const messages: Record<string, string> = {
      FORBIDDEN: 'You do not have permission to invite members.',
      UNAUTHORIZED: 'Please sign in to continue.',
      INVALID_INPUT: 'Please provide a valid email and role.',
    };
    return messages[code] ?? defaultMessage ?? 'Failed to send invitation';
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        {/* Email Field */}
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type='email'
                  placeholder='john@example.com'
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Role Field */}
        <FormField
          control={form.control}
          name='role'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isPending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select a role' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='member'>Member</SelectItem>
                    <SelectItem value='admin'>Admin</SelectItem>
                    <SelectItem value='owner'>Owner</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type='submit' disabled={isPending} className='w-full'>
          {isPending ? (
            <>
              <Loader2 className='size-4 animate-spin' />
              <span className='font-bricolage-grotesque'>Sending...</span>
            </>
          ) : (
            <span className='font-bricolage-grotesque'>Send Invitation</span>
          )}
        </Button>
      </form>
    </Form>
  );
}
