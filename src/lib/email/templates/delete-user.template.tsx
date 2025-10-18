import { Heading, Link, Section, Text } from '@react-email/components';

import EmailLayout from '@/lib/email/templates/email-layout.template';

type DeleteAccountEmailProps = {
  userName?: string;
  email: string;
  verifyUrl: string;
};

export default function DeleteAccountEmail({
  email,
  verifyUrl,
}: DeleteAccountEmailProps) {
  const preview = 'Confirm account deletion for Keyvaultify';

  return (
    <EmailLayout title={preview} preview={preview}>
      <Heading style={h1}>Delete your account?</Heading>
      <Text style={heroText}>
        We received a request to delete your Keyvaultify account ({email}).
        Click the button below to confirm this action.
      </Text>

      <Section style={warningBox}>
        <Text style={warningText}>
          ⚠️ This action is permanent and cannot be undone. All your data will
          be deleted.
        </Text>
      </Section>

      <Link href={verifyUrl} style={button}>
        Confirm deletion
      </Link>

      <Text style={text}>
        If you didn&apos;t request this email, there&apos;s nothing to worry
        about, you can safely ignore it. Your account will remain active.
      </Text>
    </EmailLayout>
  );
}

// For email preview/testing
DeleteAccountEmail.PreviewProps = {
  userName: 'John Doe',
  email: 'user@example.com',
  verifyUrl: 'https://keyvaultify.app/verify-delete',
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

const warningBox = {
  background: '#fef3c7',
  border: '1px solid #f59e0b',
  borderRadius: '4px',
  padding: '16px',
  marginBottom: '30px',
};

const warningText = {
  fontSize: '14px',
  color: '#92400e',
  margin: 0,
  fontWeight: '500',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#dc2626',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '200px',
  padding: '12px 0',
  marginBottom: '30px',
};

const text = {
  color: '#000',
  fontSize: '14px',
  lineHeight: '24px',
};
