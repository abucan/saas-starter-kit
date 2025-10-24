'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Card } from '@/components/ui/card';
import { accountNavConfig } from '@/config/account';

export function AccountNav() {
  const pathname = usePathname();

  return (
    <Card className='py-2 px-2 self-start'>
      <div className='flex flex-col gap-2'>
        {accountNavConfig.map((nav) => (
          <Link
            href={nav.href as any}
            key={nav.title}
            className={`${
              pathname === nav.href ? 'bg-primary/20' : 'hover:bg-muted'
            } py-2.5 pl-2 pr-10 rounded-xl transition-colors`}
          >
            <div className='flex flex-row items-center gap-2'>
              <nav.icon
                className={`${
                  pathname === nav.href
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground bg-muted'
                } p-1.5 rounded-md mr-1`}
                width={30}
                height={30}
              />
              <div className='flex flex-col'>
                <p
                  className={`text-base font-bold ${
                    pathname === nav.href
                      ? 'text-primary-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  {nav.title}
                </p>
                <p
                  className={`text-xs ${
                    pathname === nav.href
                      ? 'text-primary-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  {nav.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}
