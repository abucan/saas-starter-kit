'use client';

import Link from 'next/link';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useBreadcrumbs } from '@/hooks/use-breadcrumbs';

export function AppBreadcrumbs() {
  const breadcrumbs = useBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <div key={item.href} className='flex items-center gap-2'>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : item.isClickable ? (
                  <BreadcrumbLink asChild>
                    <Link href={item.href as any}>{item.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <span className='font-medium text-muted-foreground'>
                    {item.label}
                  </span>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
