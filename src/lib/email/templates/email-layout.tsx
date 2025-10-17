import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

type EmailLayoutProps = {
  children: React.ReactNode;
  title: string;
  preview: string;
};

export default function EmailLayout({ children, preview }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>{preview}</Preview>
        <Container style={container}>
          <Section style={logoContainer}>
            <Text style={logo}>Keyvaultify</Text>
          </Section>
          {children}
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Helvetica Neue', sans-serif",
};

const container = {
  margin: '0 auto',
  padding: '0px 20px',
  maxWidth: '560px',
};

const logoContainer = {
  marginTop: '32px',
};

const logo = {
  fontSize: '20px',
  fontWeight: '600',
  color: '#000000',
  margin: 0,
};
