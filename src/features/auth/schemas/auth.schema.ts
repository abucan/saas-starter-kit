import { z } from 'zod';

export const signInSchema = z.object({
  email: z.email('Please enter a valid email address'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export const signInWithEmailSchema = z.object({
  email: z
    .email('Please enter a valid email address')
    .transform((val) => val.trim().toLowerCase()),
});

export const verifyOtpSchema = z.object({
  email: z
    .email('Please enter a valid email address')
    .transform((val) => val.trim().toLowerCase()),
  otp: z
    .string()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d{6}$/, 'OTP must contain only numbers'),
});

export const resendOtpSchema = z.object({
  email: z
    .email('Please enter a valid email address')
    .transform((val) => val.trim().toLowerCase()),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignInWithEmailInput = z.infer<typeof signInWithEmailSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type ResendOtpInput = z.infer<typeof resendOtpSchema>;
