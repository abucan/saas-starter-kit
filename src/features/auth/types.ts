export type {
  ResendOtpInput,
  SignInWithEmailInput,
  VerifyOtpInput,
} from './schemas/auth.schema';

export type AuthStep = 'email' | 'otp';

export type OAuthProvider = 'google' | 'github';

export type OtpType = 'sign-in' | 'email-verification' | 'forget-password';

export type SignInResult = {
  success: true;
  redirectUrl: string;
};

export type OtpState = {
  timeRemaining: number;
  canResend: boolean;
  isCountingDown: boolean;
  email: string | null;
};
