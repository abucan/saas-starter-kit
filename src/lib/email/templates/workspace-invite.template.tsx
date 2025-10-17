import { Heading, Link, Text } from '@react-email/components';

import EmailLayout from '@/lib/email/templates/email-layout';

type WorkspaceInviteEmailProps = {
  inviterName?: string;
  teamName: string;
  acceptUrl: string;
};

export default function WorkspaceInviteEmail({
  inviterName,
  teamName,
  acceptUrl,
}: WorkspaceInviteEmailProps) {
  const preview = `You&apos;re invited to join ${teamName} on Keyvaultify`;
  const description = inviterName
    ? `${inviterName} invited you to join ${teamName} on Keyvaultify. Click the button below to accept the invitation.`
    : `You&apos;ve been invited to join ${teamName} on Keyvaultify. Click the button below to accept the invitation.`;

  return (
    <EmailLayout title={preview} preview={preview}>
      <Heading style={h1}>You&apos;re invited to join {teamName}</Heading>
      <Text style={heroText}>{description}</Text>

      <Link href={acceptUrl} style={button}>
        Accept invitation
      </Link>

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
WorkspaceInviteEmail.PreviewProps = {
  inviterName: 'John Doe',
  teamName: 'Personal Workspace',
  acceptUrl: 'https://keyvaultify.app/accept-invite',
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

const button = {
  backgroundColor: '#000000',
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
