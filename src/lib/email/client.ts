import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error(
    'RESEND_API_KEY environment variable is required for email functionality'
  );
}

export const resend = new Resend(process.env.RESEND_API_KEY);

export const emailConfig = {
  from: process.env.EMAIL_FROM || 'KeyVaultify <noreply@keyvaultify.app>',
  replyTo: process.env.EMAIL_REPLY_TO || 'support@keyvaultify.app',
} as const;
