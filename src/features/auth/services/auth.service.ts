import 'server-only';
import { headers } from 'next/headers';
import { bAuth } from '@/lib/auth/auth';
import {
  signInWithEmailSchema,
  verifyOtpSchema,
  resendOtpSchema,
  type SignInWithEmailInput,
  type VerifyOtpInput,
  type ResendOtpInput,
} from '../schemas/auth.schema';

export const authService = {
  async sendSignInOtp(input: SignInWithEmailInput): Promise<void> {
    const validated = signInWithEmailSchema.parse(input);

    await bAuth.api.sendVerificationOTP({
      headers: await headers(),
      body: {
        email: validated.email,
        type: 'sign-in',
      },
    });
  },

  async verifySignInOtp(input: VerifyOtpInput): Promise<void> {
    const validated = verifyOtpSchema.parse(input);

    await bAuth.api.signInEmailOTP({
      headers: await headers(),
      body: {
        email: validated.email,
        otp: validated.otp,
      },
    });
  },

  async resendSignInOtp(input: ResendOtpInput): Promise<void> {
    const validated = resendOtpSchema.parse(input);

    await bAuth.api.sendVerificationOTP({
      headers: await headers(),
      body: {
        email: validated.email,
        type: 'sign-in',
      },
    });
  },
};
