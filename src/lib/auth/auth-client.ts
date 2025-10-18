import { createAuthClient } from 'better-auth/client';
import { emailOTPClient, organizationClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  plugins: [emailOTPClient(), organizationClient()],
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
