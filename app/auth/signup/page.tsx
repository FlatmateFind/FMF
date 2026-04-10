'use client';
import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Eye, EyeOff, Search, Building2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function SignUpPage() {
  const [role, setRole] = useState<'renter' | 'subletter' | ''>('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const { signUp } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!role) { setError('Please select whether you are a renter or subletter.'); return; }
    if (!name.trim()) { setError('Please enter your name.'); return; }
    if (!email || !email.includes('@')) { setError('Please enter a valid email.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    const result = await signUp(name.trim(), email.trim(), password, role);
    if (result.success) {
      router.push('/auth/verify-email');
    } else {
      setError(result.error ?? 'Sign up failed.');
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-5">
            <div className="bg-teal-600 p-1.5 rounded-lg">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-800">Flatmate<span className="text-teal-600">Find</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Create an account</h1>
          <p className="text-slate-500 mt-1 text-sm">Join FlatmateFind today — it&apos;s free</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
          {/* Role picker */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-slate-700 mb-3">I am a…</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('renter')}
                className={`flex flex-col items-center gap-2.5 p-5 rounded-xl border-2 transition-all ${
                  role === 'renter' ? 'border-teal-500 bg-teal-50' : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <Search className={`w-7 h-7 ${role === 'renter' ? 'text-teal-600' : 'text-slate-400'}`} />
                <div className="text-center">
                  <div className={`font-semibold text-sm ${role === 'renter' ? 'text-teal-700' : 'text-slate-700'}`}>Renter</div>
                  <div className="text-xs text-slate-500 mt-0.5">Looking for a place to rent</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setRole('subletter')}
                className={`flex flex-col items-center gap-2.5 p-5 rounded-xl border-2 transition-all ${
                  role === 'subletter' ? 'border-teal-500 bg-teal-50' : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <Building2 className={`w-7 h-7 ${role === 'subletter' ? 'text-teal-600' : 'text-slate-400'}`} />
                <div className="text-center">
                  <div className={`font-semibold text-sm ${role === 'subletter' ? 'text-teal-700' : 'text-slate-700'}`}>Subletter</div>
                  <div className="text-xs text-slate-500 mt-0.5">I have a place to rent out</div>
                </div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                autoComplete="name"
                className="w-full text-sm border border-slate-200 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full text-sm border border-slate-200 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                  className="w-full text-sm border border-slate-200 rounded-lg py-2.5 px-3 pr-10 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                />
                <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
            )}

            <button type="submit" className="w-full py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors">
              Create Account
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-teal-600 font-medium hover:text-teal-800">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
