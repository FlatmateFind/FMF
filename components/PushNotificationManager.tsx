'use client';
import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = window.atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

export async function subscribeToPush(
  preferences: object
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return { success: false, error: 'Push notifications not supported in this browser.' };
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return { success: false, error: 'Notification permission denied.' };
    }

    const reg = await navigator.serviceWorker.ready;
    const existing = await reg.pushManager.getSubscription();
    if (existing) await existing.unsubscribe();

    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    const subJson = sub.toJSON() as { endpoint: string; keys: { auth: string; p256dh: string } };

    // Store subscription in Supabase
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      await supabase.from('push_subscriptions').upsert(
        {
          user_id: session?.user?.id ?? null,
          endpoint: subJson.endpoint,
          p256dh: subJson.keys.p256dh,
          auth_key: subJson.keys.auth,
          preferences,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'endpoint' }
      );
    } catch (dbErr) {
      console.warn('Failed to save push subscription to DB:', dbErr);
    }

    // Also call the existing API route for backward compatibility
    const res = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription: subJson, preferences }),
    });

    if (!res.ok) return { success: false, error: 'Server error saving subscription.' };

    // Keep endpoint in localStorage for unsubscribe reference
    localStorage.setItem('push_endpoint', subJson.endpoint);
    localStorage.setItem('push_preferences', JSON.stringify(preferences));
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

export async function unsubscribeFromPush(): Promise<boolean> {
  try {
    const endpoint = localStorage.getItem('push_endpoint');
    if (endpoint) {
      // Remove from Supabase
      try {
        const supabase = createClient();
        await supabase.from('push_subscriptions').delete().eq('endpoint', endpoint);
      } catch { /* ignore */ }

      await fetch('/api/push/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint }),
      });
      localStorage.removeItem('push_endpoint');
      localStorage.removeItem('push_preferences');
    }
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) await sub.unsubscribe();
    }
    return true;
  } catch {
    return false;
  }
}

export function isSubscribed(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('push_endpoint');
}

// Registers the service worker silently on mount
export default function PushNotificationManager() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .catch((err) => console.warn('SW registration failed:', err));
    }
  }, []);
  return null;
}
