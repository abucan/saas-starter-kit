import { Bricolage_Grotesque, Spectral } from 'next/font/google';
import type { Metadata } from 'next';

import ProgressBarProvider from '@/components/shared/progress-bar-provider';
import { ThemeProvider } from '@/components/shared/theme-provider';
import { Toaster } from '@/components/ui/sonner';

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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  ),
  title: {
    default: 'SaaS Starter',
    template: '%s | SaaS Starter',
  },
  description: 'A modern SaaS application built with Next.js',
  keywords: ['saas', 'next.js', 'react', 'typescript'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Company',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'SaaS Starter',
    description: 'A modern SaaS application built with Next.js',
    siteName: 'SaaS Starter',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SaaS Starter',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SaaS Starter',
    description: 'A modern SaaS application built with Next.js',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${fontBricolageGrotesque.variable} ${fontSpectral.variable} antialiased`}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='light'
          enableSystem
          disableTransitionOnChange
        >
          <ProgressBarProvider>
            <main>{children}</main>
            <Toaster position='top-center' />
          </ProgressBarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
