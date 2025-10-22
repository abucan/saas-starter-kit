import { stripeClient } from '@better-auth/stripe/client';
import { createAuthClient } from 'better-auth/client';
import { emailOTPClient, organizationClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [
    emailOTPClient(),
    organizationClient(),
    stripeClient({ subscription: true }),
  ],
});

export const {
  signIn,
  signUp,
  signOut,
  deleteUser,
  useSession,
  getSession,
  revokeSessions,
  organization,
} = authClient;
