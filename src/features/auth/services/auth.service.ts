import 'server-only';

import { headers } from 'next/headers';

import { auth } from '@/lib/auth/auth';

import {
  type ResendOtpInput,
  resendOtpSchema,
  type SignInWithEmailInput,
  signInWithEmailSchema,
  type VerifyOtpInput,
  verifyOtpSchema,
} from '../schemas/auth.schema';

export const authService = {
  async sendSignInOtp(input: SignInWithEmailInput): Promise<void> {
    const validated = signInWithEmailSchema.parse(input);

    await auth.api.sendVerificationOTP({
      headers: await headers(),
      body: {
        email: validated.email,
        type: 'sign-in',
      },
    });
  },

  async verifySignInOtp(input: VerifyOtpInput): Promise<void> {
    const validated = verifyOtpSchema.parse(input);

    await auth.api.signInEmailOTP({
      headers: await headers(),
      body: {
        email: validated.email,
        otp: validated.otp,
      },
    });
  },

  async resendSignInOtp(input: ResendOtpInput): Promise<void> {
    const validated = resendOtpSchema.parse(input);

    await auth.api.sendVerificationOTP({
      headers: await headers(),
      body: {
        email: validated.email,
        type: 'sign-in',
      },
    });
  },
};
