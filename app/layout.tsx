import type { Metadata } from 'next';
import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import MotionProvider from '@/components/MotionProvider';
import AskHyunChat from '@/components/AskHyunChat';
import {
  HOME_SEO_DESCRIPTION,
  HOME_SEO_TITLE,
  SITE_NAME,
  SITE_URL,
} from '@/src/data/recipes';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-fraunces',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: HOME_SEO_TITLE,
  description: HOME_SEO_DESCRIPTION,
  openGraph: {
    title: HOME_SEO_TITLE,
    description: HOME_SEO_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: `${SITE_URL}/images/hyun-kitchen-hero.jpg`,
        width: 1408,
        height: 768,
        alt: 'Recipes by Hyun home kitchen comfort food spread',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: HOME_SEO_TITLE,
    description: HOME_SEO_DESCRIPTION,
    images: [`${SITE_URL}/images/hyun-kitchen-hero.jpg`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${plusJakartaSans.variable}`}
    >
      <body
        suppressHydrationWarning
        className="flex min-h-screen flex-col bg-[#FAF6F0] text-[#211915]"
      >
        <MotionProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <AskHyunChat />
        </MotionProvider>
      </body>
    </html>
  );
}
