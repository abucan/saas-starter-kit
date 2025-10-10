'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth/auth-client';
import Image from 'next/image';

type OAuthButtonProps = {
  provider: 'google' | 'github';
  label: string;
};

export function OAuthButton({ provider, label }: OAuthButtonProps) {
  const [pending, setPending] = useState(false);
  const searchParams = useSearchParams();

  const handleClick = async () => {
    try {
      setPending(true);

      const next = searchParams.get('next') || '/dashboard';
      const redirectUrl =
        next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard';
      const callbackURL = `${window.location.origin}${redirectUrl}`;

      await authClient.signIn.social({
        provider,
        callbackURL,
      });
    } catch (error) {
      console.error(`${provider} sign-in error:`, error);
      setPending(false);
    }
  };

  const icons = {
    google: (
      <Image
        src='/icons/google.svg'
        alt='Google'
        width={16}
        height={16}
        className='w-4 h-4'
      />
    ),
    github: (
      <>
        <Image
          src='/icons/github_light.svg'
          alt='GitHub'
          width={16}
          height={16}
          className='w-4 h-4 dark:hidden'
        />
        <Image
          src='/icons/github_dark.svg'
          alt='GitHub'
          width={16}
          height={16}
          className='w-4 h-4 hidden dark:block'
        />
      </>
    ),
  };

  return (
    <Button
      type='button'
      variant='outline'
      onClick={handleClick}
      disabled={pending}
      className='w-full'
      aria-label={label}
      aria-busy={pending}
    >
      <span className='mr-2'>{icons[provider]}</span>
      {pending ? 'Redirecting...' : label}
    </Button>
  );
}
