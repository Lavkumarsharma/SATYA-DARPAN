import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import './globals.css';
import '@/styles/googleTranslate.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: {
    template: '%s | SatyaDarpan',
    default: 'SatyaDarpan - Political Research & Evidence Publishing',
  },
  description: 'Premium investigative journalism and political evidence publishing platform.',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'SatyaDarpan',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${playfair.variable}`}>
      <body className="font-sans bg-background text-text selection:bg-accent/30 antialiased min-h-screen flex flex-col">
        <LanguageSwitcher />
        <Navbar />
        <main className="flex-grow pt-16 md:pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

