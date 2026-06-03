import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: 'Spurs Fan Hub',
  title: {
    default: 'Spurs Fan Hub',
    template: '%s',
  },
  description:
    'San Antonio Spurs game schedules, matchup analysis, player previews, and postseason stats.',
  keywords: ['San Antonio Spurs', 'Spurs', 'NBA', 'basketball', 'game day', 'fan hub'],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Spurs Fan Hub',
    title: 'Spurs Fan Hub',
    description:
      'San Antonio Spurs game schedules, matchup analysis, player previews, and postseason stats.',
  },
  twitter: {
    card: 'summary',
    title: 'Spurs Fan Hub',
    description:
      'San Antonio Spurs game schedules, matchup analysis, player previews, and postseason stats.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
