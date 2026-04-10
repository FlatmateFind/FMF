import { NextResponse } from 'next/server';

// Supabase handles email verification via its own secure token flow.
// This endpoint is kept as a no-op for backwards compatibility.
export async function POST() {
  return NextResponse.json({ ok: true });
}
