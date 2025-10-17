import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error(
    'RESEND_API_KEY environment variable is required for email functionality'
  );
}

export const resend = new Resend(process.env.RESEND_API_KEY);

export const EMAIL_CONFIG = {
  from: process.env.EMAIL_FROM || 'Keyvaultify <noreply@keyvaultify.app>',
  replyTo: process.env.EMAIL_REPLY_TO || 'support@keyvaultify.app',
  otpExpiryMinutes: 10,
} as const;

export type EmailConfig = typeof EMAIL_CONFIG;
