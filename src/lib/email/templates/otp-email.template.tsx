import { Heading, Section, Text } from '@react-email/components';

import { OtpType } from '@/features/auth/types';
import EmailLayout from '@/lib/email/templates/email-layout.template';

type OTPEmailProps = {
  otp: string;
  type: OtpType;
  email: string;
};

const CONTENT = {
  'sign-in': {
    heading: 'Sign in to your account',
    preview: 'Your Keyvaultify sign-in code',
    description:
      'Your confirmation code is below - enter it in your open browser window to sign in.',
  },
  'email-verification': {
    heading: 'Verify your email address',
    preview: 'Verify your Keyvaultify account',
    description:
      'Your confirmation code is below - enter it in your open browser window to verify your email.',
  },
  'forget-password': {
    heading: 'Reset your password',
    preview: 'Reset your Keyvaultify password',
    description:
      'Your confirmation code is below - enter it in your open browser window to reset your password.',
  },
};

export default function OTPEmail({ otp, type }: OTPEmailProps) {
  const content = CONTENT[type];

  return (
    <EmailLayout title={content.preview} preview={content.preview}>
      <Heading style={h1}>{content.heading}</Heading>
      <Text style={heroText}>{content.description}</Text>

      <Section style={codeBox}>
        <Text style={confirmationCodeText}>{otp}</Text>
      </Section>

      <Text style={text}>
        If you didn&apos;t request this email, there&apos;s nothing to worry
        about, you can safely ignore it.
      </Text>
    </EmailLayout>
  );
}

/**
 * For email preview or testing
 */
OTPEmail.PreviewProps = {
  otp: '123456',
  type: 'sign-in' as const,
  email: 'user@example.com',
};

const h1 = {
  color: '#1d1c1d',
  fontSize: '36px',
  fontWeight: '700',
  margin: '30px 0',
  padding: '0',
  lineHeight: '42px',
};

const heroText = {
  fontSize: '20px',
  lineHeight: '28px',
  marginBottom: '30px',
};

const codeBox = {
  background: 'rgb(245, 244, 245)',
  borderRadius: '4px',
  marginBottom: '30px',
  padding: '40px 10px',
};

const confirmationCodeText = {
  fontSize: '30px',
  textAlign: 'center' as const,
  verticalAlign: 'middle',
};

const text = {
  color: '#000',
  fontSize: '14px',
  lineHeight: '24px',
};
