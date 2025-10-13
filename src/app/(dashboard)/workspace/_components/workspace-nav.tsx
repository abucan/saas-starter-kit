'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, Settings, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';

const settings = [
  {
    title: 'Members',
    description: 'Manage your workspace members and permissions.',
    href: '/workspace/members',
    icon: Users,
  },
  {
    title: 'Invitations',
    description: 'Manage your workspace invitations and permissions.',
    href: '/workspace/invitations',
    icon: Mail,
  },
  {
    title: 'Settings',
    description: 'Manage your workspace settings and preferences.',
    href: '/workspace/settings',
    icon: Settings,
  },
];

export function WorkspaceNav() {
  const pathname = usePathname();

  return (
    <Card className='py-2 px-2 h-52'>
      <div className='flex flex-col justify-between h-full'>
        {settings.map((setting) => (
          <Link
            href={setting.href}
            key={setting.title}
            className={`${
              pathname === setting.href ? 'bg-primary/10' : 'hover:bg-muted'
            } py-2.5 pl-2 pr-10 rounded-xl transition-colors`}
          >
            <div className='flex flex-row items-center gap-2'>
              <setting.icon
                className={`${
                  pathname === setting.href
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground bg-muted'
                } p-1.5 rounded-md mr-1`}
                width={30}
                height={30}
              />
              <div className='flex flex-col'>
                <p
                  className={`text-base font-bold font-bricolage-grotesque ${
                    pathname === setting.href
                      ? 'text-primary-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  {setting.title}
                </p>
                <p
                  className={`text-xs font-bricolage-grotesque ${
                    pathname === setting.href
                      ? 'text-primary-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  {setting.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}
