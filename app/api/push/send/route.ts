// Internal route to trigger push notifications (call from listing/job creation hooks)
import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';
import { getMatchingSubscriptions, removeSubscription } from '@/lib/pushSubscriptions';

webpush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

export async function POST(req: NextRequest) {
  try {
    const { type, meta, notification } = await req.json();
    // type: 'listing' | 'job' | 'business' | 'market' | 'event' | 'community'
    // meta: { suburb, state, price, roomType, language, jobType }
    // notification: { title, body, url, tag }

    const subs = getMatchingSubscriptions(type, meta ?? {});
    const results = await Promise.allSettled(
      subs.map((s) =>
        webpush.sendNotification(
          { endpoint: s.endpoint, keys: s.keys },
          JSON.stringify({
            title: notification.title ?? 'FlatmateFind',
            body: notification.body ?? 'New update available',
            url: notification.url ?? '/',
            tag: notification.tag ?? type,
          })
        ).catch((err) => {
          // Remove expired/invalid subscriptions
          if (err.statusCode === 410 || err.statusCode === 404) removeSubscription(s.endpoint);
          throw err;
        })
      )
    );

    const sent = results.filter((r) => r.status === 'fulfilled').length;
    return NextResponse.json({ sent, total: subs.length });
  } catch {
    return NextResponse.json({ error: 'Failed to send notifications' }, { status: 500 });
  }
}
