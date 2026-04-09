import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import CompareBar from '@/components/CompareBar';
import EmailVerificationBanner from '@/components/EmailVerificationBanner';
import { AuthProvider } from '@/context/AuthContext';
import PushNotificationManager from '@/components/PushNotificationManager';

export const metadata: Metadata = {
  title: 'FlatmateFind — Find Rooms & Flatmates in Australia',
  description: 'Browse rooms, apartments and share houses across Sydney, Melbourne, Brisbane, Perth, Adelaide and Gold Coast.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'FlatmateFind',
  },
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#0d9488',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50">
        <AuthProvider>
          <PushNotificationManager />
          <Header />
          <EmailVerificationBanner />
          <main className="flex-1">{children}</main>
          <Footer />
          <CompareBar />
          <BackToTop />
        </AuthProvider>
      </body>
    </html>
  );
}
