import './globals.css';
import StoreProvider from '../components/StoreProvider.jsx';
import { PermissionProvider } from '../context/PermissionContext.jsx';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'MailMetric — Verify Every Email Before You Send',
  description:
    'Catch invalid, disposable, and risky email addresses in real time with AI-powered validation. Protect your sender reputation and boost deliverability.',
  icons: { icon: '/favicon.ico' },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Sora:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <StoreProvider>
          <PermissionProvider>
            {children}
          </PermissionProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
