import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import CompareBar from '@/components/CompareBar';
import EmailVerificationBanner from '@/components/EmailVerificationBanner';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'FlatmateFind — Find Rooms & Flatmates in Australia',
  description: 'Browse rooms, apartments and share houses across Sydney, Melbourne, Brisbane, Perth, Adelaide and Gold Coast.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50">
        <AuthProvider>
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
