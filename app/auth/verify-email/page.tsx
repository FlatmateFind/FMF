'use client';
import Link from 'next/link';
import { Mail, Home } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function VerifyEmailPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-8 justify-center">
          <div className="bg-teal-600 p-1.5 rounded-lg">
            <Home className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-slate-800">Flatmate<span className="text-teal-600">Find</span></span>
        </Link>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
          <div className="w-14 h-14 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <Mail className="w-7 h-7 text-teal-600" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Check your inbox</h1>
          <p className="text-sm text-slate-500 mb-1">
            We sent a verification link to
          </p>
          {user && (
            <p className="text-sm font-semibold text-slate-800 mb-5">{user.email}</p>
          )}
          <p className="text-xs text-slate-400 mb-6">
            Click the link in the email to verify your account. The link is sent by Supabase and expires in 24 hours.
          </p>

          <div className="border-t border-slate-100 mt-6 pt-5">
            <Link href="/dashboard" className="text-sm text-teal-600 font-medium hover:text-teal-800">
              Skip for now →
            </Link>
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-5">
          Wrong email?{' '}
          <Link href="/auth/signup" className="text-teal-600 hover:underline">Sign up again</Link>
        </p>
      </div>
    </div>
  );
}
