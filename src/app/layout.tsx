import type { Metadata } from 'next';
import { Bricolage_Grotesque, Spectral } from 'next/font/google';
import './globals.css';

const fontBricolageGrotesque = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-bricolage-grotesque',
});

const fontSpectral = Spectral({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-spectral',
});

export const metadata: Metadata = {
  title: 'KeyVaultify App',
  description: 'Multi-Environment Secret Management',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${fontBricolageGrotesque.variable} ${fontSpectral.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
