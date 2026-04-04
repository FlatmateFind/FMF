import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createVerificationToken } from '@/lib/verificationTokens';

export async function POST(req: NextRequest) {
  const { email, name } = await req.json();
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

  const token = createVerificationToken(email);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? `http://localhost:3000`;
  const verifyUrl = `${baseUrl}/auth/verify-email/${token}`;

  if (!process.env.RESEND_API_KEY) {
    // Dev fallback — log the link so you can test without a real API key
    console.log(`\n[DEV] Verification link for ${email}:\n${verifyUrl}\n`);
    return NextResponse.json({ ok: true, devLink: verifyUrl });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: 'FlatmateFind <noreply@flatmatefind.com>',
    to: email,
    subject: 'Verify your FlatmateFind email',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px 24px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:24px">
          <div style="background:#0d9488;padding:8px;border-radius:8px">
            <span style="color:#fff;font-size:18px">⌂</span>
          </div>
          <span style="font-weight:700;font-size:20px;color:#1e293b">Flatmate<span style="color:#0d9488">Find</span></span>
        </div>
        <h1 style="font-size:22px;font-weight:700;color:#1e293b;margin:0 0 8px">Confirm your email</h1>
        <p style="color:#64748b;font-size:15px;margin:0 0 24px">Hi ${name ?? 'there'}, click the button below to verify your email address. The link expires in 24 hours.</p>
        <a href="${verifyUrl}" style="display:inline-block;background:#0d9488;color:#fff;font-weight:600;font-size:15px;padding:14px 28px;border-radius:8px;text-decoration:none">Verify my email</a>
        <p style="color:#94a3b8;font-size:13px;margin-top:28px">Or copy this link: ${verifyUrl}</p>
        <p style="color:#cbd5e1;font-size:12px;margin-top:16px">If you didn't create a FlatmateFind account, you can ignore this email.</p>
      </div>
    `,
  });

  if (error) {
    console.error('Resend error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
