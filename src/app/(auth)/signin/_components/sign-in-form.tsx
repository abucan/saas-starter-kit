'use client';

import { useEffect, useRef } from 'react';
import { Control } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { OAuthButton } from './oauth-button';

type SignInFormProps = {
  control: Control<{ email: string; otp: string }>;
  loading: boolean;
  onSubmit: () => void;
};

export function SignInForm({ control, loading, onSubmit }: SignInFormProps) {
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className='container max-w-sm space-y-8'>
      <div className='text-center space-y-2'>
        <h1 className='text-2xl font-bold tracking-tight'>Welcome back</h1>
        <p className='text-sm text-muted-foreground'>Sign in to your account</p>
      </div>

      <div className='space-y-3'>
        <OAuthButton provider='google' label='Continue with Google' />
        <OAuthButton provider='github' label='Continue with GitHub' />
      </div>

      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-background px-2 text-muted-foreground'>
            or continue with email
          </span>
        </div>
      </div>

      <div className='space-y-4'>
        <FormField
          control={control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  ref={emailInputRef}
                  type='email'
                  placeholder='name@example.com'
                  autoComplete='email'
                  disabled={loading}
                  onKeyDown={handleKeyPress}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type='button'
          onClick={onSubmit}
          disabled={loading}
          className='w-full'
        >
          {loading ? 'Sending code...' : 'Continue'}
        </Button>
      </div>

      <p className='text-center text-xs text-muted-foreground'>
        By continuing, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
}
