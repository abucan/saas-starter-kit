import { toNextJsHandler } from 'better-auth/next-js';

import { bAuth } from '@/lib/auth/auth';

export const { GET, POST } = toNextJsHandler(bAuth.handler);
