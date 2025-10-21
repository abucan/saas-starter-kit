'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';

export interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrentPage?: boolean;
  isClickable?: boolean;
}

export function useBreadcrumbs(): BreadcrumbItem[] {
  const pathname = usePathname();

  return useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);

    const breadcrumbs: BreadcrumbItem[] = [];
    let currentPath = '';

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;

      const label = segment
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      const unRoutablePaths = ['/workspace', '/account'];
      const isClickable = !unRoutablePaths.includes(currentPath) && !isLast;

      breadcrumbs.push({
        label,
        href: currentPath,
        isCurrentPage: isLast,
        isClickable,
      });
    });

    return breadcrumbs;
  }, [pathname]);
}
