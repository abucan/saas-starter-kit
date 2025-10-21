import { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Home',
  description: 'A modern SaaS application built with Next.js',
};

export default function Home() {
  return (
    <div className='flex w-full h-screen items-center justify-center'>
      <Button asChild>
        <Link href='/signin'>Sign In</Link>
      </Button>
    </div>
  );
}
