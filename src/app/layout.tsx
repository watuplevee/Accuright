import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/layout/Providers';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ChatWidget } from '@/components/chat/ChatWidget';
import { LeadCaptureModal } from '@/components/marketing/LeadCaptureModal';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://accuright.com'
  ),
  title: {
    template: 'Accuright | %s',
    default: 'Accuright — Future-Forward Sneaker Culture',
  },
  description:
    'Accuright is the definitive destination for the most coveted sneakers of 2027. Exclusive drops, legendary silhouettes, and the culture that moves with them.',
  keywords: [
    'sneakers',
    'shoes',
    'nike',
    'adidas',
    'jordan',
    'limited edition',
    'sneaker culture',
    '2027',
  ],
  authors: [{ name: 'Accuright' }],
  creator: 'Accuright',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://accuright.com',
    siteName: 'Accuright',
    title: 'Accuright — Future-Forward Sneaker Culture',
    description:
      'The definitive destination for the most coveted sneakers of 2027.',
    images: [
      {
        url: '/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Accuright — Future-Forward Sneaker Culture',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@accuright',
    creator: '@accuright',
    title: 'Accuright — Future-Forward Sneaker Culture',
    description:
      'The definitive destination for the most coveted sneakers of 2027.',
    images: ['/og-default.jpg'],
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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="bg-brand-black text-brand-white font-body antialiased min-h-screen flex flex-col">
        <Providers>
          <AnnouncementBar />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <ChatWidget />
          <LeadCaptureModal />
        </Providers>
      </body>
    </html>
  );
}
