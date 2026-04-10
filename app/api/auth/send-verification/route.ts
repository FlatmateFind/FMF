import { NextResponse } from 'next/server';

// Supabase handles email verification automatically via its own email system.
// This endpoint is kept as a no-op for backwards compatibility.
export async function POST() {
  return NextResponse.json({ ok: true });
}
