import 'server-only';

import { headers } from 'next/headers';

import { auth } from '@/lib/auth/auth';
import { redis } from '@/lib/redis/client';

const DASHBOARD_CACHE_KEY_PREFIX = 'dashboard';

export async function invalidateDashboardCache() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (session?.user?.id) {
      const cacheKey = `${DASHBOARD_CACHE_KEY_PREFIX}:${session.user.id}`;
      await redis.del(cacheKey);
      console.log('✅ Invalidated dashboard cache for user:', session.user.id);
    }
  } catch (error) {
    console.error('Failed to invalidate dashboard cache:', error);
    // Don't throw - cache invalidation shouldn't break the action
  }
}
