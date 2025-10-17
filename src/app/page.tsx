import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className='flex w-full h-screen items-center justify-center'>
      <Button asChild>
        <Link href='/signin'>Sign In</Link>
      </Button>
    </div>
  );
}
