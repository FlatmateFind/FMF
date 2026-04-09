import { NextRequest, NextResponse } from 'next/server';
import { saveSubscription, DEFAULT_PREFERENCES, type StoredSubscription } from '@/lib/pushSubscriptions';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { subscription, preferences } = await req.json();

    if (!subscription?.endpoint || !subscription?.keys?.auth || !subscription?.keys?.p256dh) {
      return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 });
    }

    const stored: StoredSubscription = {
      id: randomUUID(),
      endpoint: subscription.endpoint,
      keys: subscription.keys,
      preferences: { ...DEFAULT_PREFERENCES, ...(preferences ?? {}) },
      createdAt: new Date().toISOString(),
    };

    saveSubscription(stored);
    return NextResponse.json({ success: true, id: stored.id });
  } catch {
    return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 });
  }
}
