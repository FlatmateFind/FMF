'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Session } from '@supabase/supabase-js';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'renter' | 'subletter';
  emailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (name: string, email: string, password: string, role: 'renter' | 'subletter') => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  markEmailVerified: (email: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function sessionToUser(session: Session): User {
  const meta = session.user.user_metadata ?? {};
  return {
    id: session.user.id,
    name: (meta.name as string) || session.user.email?.split('@')[0] || '',
    email: session.user.email ?? '',
    role: (meta.role as 'renter' | 'subletter') || 'renter',
    emailVerified: !!session.user.email_confirmed_at,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session ? sessionToUser(session) : null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session ? sessionToUser(session) : null);
    });
    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    return { success: true };
  }

  async function signUp(name: string, email: string, password: string, role: 'renter' | 'subletter') {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, role } },
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  // no-op — Supabase handles verification via email link
  function markEmailVerified(_email: string) {}

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, markEmailVerified }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
