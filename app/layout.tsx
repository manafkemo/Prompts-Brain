import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'ZanZora — AI-Powered Prompt Brain',
  description:
    'Turn your prompts into a powerful AI brain. Analyze, improve, and organize your prompts with ZanZora.',
};

import { CookieConsent } from '@/components/ui/CookieConsent';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
