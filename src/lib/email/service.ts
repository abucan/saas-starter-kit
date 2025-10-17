import React from 'react';
import { render } from '@react-email/render';
import type { CreateEmailResponse } from 'resend';

import { OtpType } from '@/features/auth/types';
import { OTPEmail, WorkspaceInviteEmail } from '@/lib/email/templates';

import { isValidEmail } from '../validation';

import { EMAIL_CONFIG, resend } from './client';

export interface SendOTPParams {
  email: string;
  otp: string;
  type: OtpType;
}

export interface SendWorkspaceInviteParams {
  email: string;
  teamName: string;
  acceptUrl: string;
  inviterName?: string;
}

const OTP_SUBJECTS: Record<OtpType, string> = {
  'sign-in': 'Your Keyvaultify sign-in code',
  'email-verification': 'Verify your Keyvaultify account',
  'forget-password': 'Reset your Keyvaultify password',
};

export async function sendOTPEmail(
  params: SendOTPParams
): Promise<CreateEmailResponse> {
  const { email, otp, type } = params;

  if (!isValidEmail(email)) {
    throw new Error('Invalid email address');
  }

  if (!/^\d{6}$/.test(otp)) {
    throw new Error('OTP must be 6 digits');
  }

  try {
    const emailHtml = await render(
      React.createElement(OTPEmail, { otp, type, email })
    );

    const result = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: email,
      subject: OTP_SUBJECTS[type],
      html: emailHtml,
      text: `Your Keyvaultify verification code is: ${otp}. This code will expire in ${EMAIL_CONFIG.otpExpiryMinutes} minutes.`,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result;
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to send verification code. Please try again.'
    );
  }
}

export async function sendWorkspaceInviteEmail(
  params: SendWorkspaceInviteParams
): Promise<CreateEmailResponse> {
  const { email, teamName, acceptUrl, inviterName } = params;

  if (!isValidEmail(email)) {
    throw new Error('Invalid email address');
  }

  if (!teamName.trim()) {
    throw new Error('Team name is required');
  }

  try {
    const emailHtml = await render(
      React.createElement(WorkspaceInviteEmail, {
        teamName,
        acceptUrl,
        inviterName,
      })
    );

    const result = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: email,
      subject: `You&apos;re invited to join ${teamName} on Keyvaultify`,
      html: emailHtml,
      text:
        `${
          inviterName ?? 'Someone'
        } invited you to join the team ${teamName}.\n\n` +
        `Accept the invitation: ${acceptUrl}\n\n` +
        `If you didn't expect this invitation, please ignore this message.`,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result;
  } catch (error) {
    console.error('Failed to send invitation email:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to send invitation. Please try again.'
    );
  }
}
