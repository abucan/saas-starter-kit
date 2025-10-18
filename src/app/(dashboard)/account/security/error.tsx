'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function SecurityError({ error, reset }: ErrorProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Security page error:', error);
    }
  }, [error]);

  return (
    <div className='container w-full max-w-sm'>
      <Card role='alert'>
        <CardHeader className='text-center'>
          <div className='mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10'>
            <AlertCircle className='h-6 w-6 text-destructive' />
          </div>
          <CardTitle>Something went wrong</CardTitle>
          <CardDescription>
            We encountered an error while loading the security page.
          </CardDescription>
        </CardHeader>

        <CardContent className='text-center'>
          {process.env.NODE_ENV === 'development' && (
            <details className='mt-4 text-left'>
              <summary className='cursor-pointer text-sm text-muted-foreground'>
                Error details
              </summary>
              <pre className='mt-2 overflow-auto rounded-md bg-muted p-4 text-xs'>
                {error.message}
                {error.digest && `\nDigest: ${error.digest}`}
              </pre>
            </details>
          )}
        </CardContent>

        <CardFooter className='flex flex-col gap-2'>
          <Button onClick={reset} className='w-full'>
            Try again
          </Button>
          <Button variant='outline' asChild className='w-full'>
            <Link href='/'>Go to home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
