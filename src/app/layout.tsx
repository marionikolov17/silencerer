import type { Metadata } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Silencerer - Free Silence Detection and Removal',
  description:
    'Free and Open-Source Audio & Video Silence Detection and Removal',
  creator: 'Mario Nikolov',
  keywords: [
    'silence detection',
    'silence removal',
    'silence detection and removal',
    'silence detection and removal tool',
    'silence detection and removal software',
    'silence detection and removal app',
    'silence detection and removal online',
    'silence detection and removal free',
    'silence detection and removal tool free',
    'silence detection and removal software free',
    'silence detection and removal app free',
    'silence detection and removal online free',
    'silence detection and removal free online',
  ],
  icons: {
    icon: '/favicon.ico',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Silencerer - Free Silence Detection and Removal',
    siteName: 'Silencerer',
    description:
      'Free and Open-Source Audio & Video Silence Detection and Removal',
    url: 'https://silencerer.com',
    images: [
      {
        url: '/opengraph.png',
        width: 1200,
        height: 630,
        alt: 'Silencerer - Free Silence Detection and Removal',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>{children}</body>
      <GoogleAnalytics gaId="G-TFXDG3CQNZ" />
    </html>
  );
}
