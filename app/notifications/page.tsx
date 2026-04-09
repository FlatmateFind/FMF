'use client';
import { useState, useEffect } from 'react';
import {
  Bell, BellOff, Home, Briefcase, ShoppingBag, CalendarDays,
  Building2, Users, CheckCircle2, X, Plus, MapPin,
  DollarSign, Globe, Loader2, BellRing, Share, SquarePlus,
} from 'lucide-react';
import { subscribeToPush, unsubscribeFromPush, isSubscribed } from '@/components/PushNotificationManager';
import type { NotificationPreferences } from '@/lib/pushSubscriptions';
import { AUSTRALIAN_STATES, POST_LANGUAGES } from '@/lib/types';

const ROOM_TYPES = ['Private Room', 'Shared Room', 'Studio', 'Entire Apartment'];
const JOB_TYPES  = ['Full-time', 'Part-time', 'Casual', 'Contract'];

const DEFAULT_PREFS: NotificationPreferences = {
  suburbs: [], budgetMin: null, budgetMax: null,
  roomTypes: [], languages: [], states: [],
  enableJobs: true, jobTypes: [],
  enableBusiness: false, enableMarket: false, enableEvents: true,
  enableCommunity: true,
};

function Tag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="flex items-center gap-1 px-2.5 py-1 bg-teal-50 border border-teal-200 text-teal-700 text-xs font-medium rounded-full">
      {label}
      <button onClick={onRemove} className="hover:text-teal-900 transition-colors">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

function Toggle({ enabled, onChange, label, desc, icon: Icon, color }: {
  enabled: boolean; onChange: (v: boolean) => void;
  label: string; desc: string; icon: React.ElementType; color: string;
}) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`flex items-center gap-3 p-3 rounded-xl border text-left w-full transition-all ${
        enabled ? 'border-teal-300 bg-teal-50' : 'border-slate-200 bg-white hover:bg-slate-50'
      }`}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${enabled ? color : 'bg-slate-100 text-slate-400'}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${enabled ? 'text-teal-800' : 'text-slate-700'}`}>{label}</p>
        <p className="text-xs text-slate-400 leading-tight">{desc}</p>
      </div>
      <div className={`w-9 h-5 rounded-full transition-colors shrink-0 relative ${enabled ? 'bg-teal-500' : 'bg-slate-200'}`}>
        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${enabled ? 'left-4' : 'left-0.5'}`} />
      </div>
    </button>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
        active ? 'bg-teal-600 text-white border-transparent' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
      }`}
    >
      {label}
    </button>
  );
}

export default function NotificationsPage() {
  const [subscribed, setSubscribed] = useState(false);
  const [prefs, setPrefs] = useState<NotificationPreferences>(DEFAULT_PREFS);
  const [suburbInput, setSuburbInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  // 'loading' | 'ios-install' | 'supported' | 'unsupported'
  const [supportState, setSupportState] = useState<'loading' | 'ios-install' | 'supported' | 'unsupported'>('loading');

  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = ('standalone' in navigator) && (navigator as unknown as { standalone: boolean }).standalone;
    if (isIOS && !isStandalone) {
      setSupportState('ios-install');
    } else if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
      setSupportState('supported');
    } else {
      setSupportState('unsupported');
    }
    setSubscribed(isSubscribed());
    const saved = localStorage.getItem('push_preferences');
    if (saved) { try { setPrefs(JSON.parse(saved)); } catch {} }
  }, []);

  function addSuburb() {
    const v = suburbInput.trim();
    if (!v || prefs.suburbs.includes(v)) return;
    setPrefs((p) => ({ ...p, suburbs: [...p.suburbs, v] }));
    setSuburbInput('');
  }

  function toggleArr<K extends keyof NotificationPreferences>(key: K, val: string) {
    setPrefs((p) => {
      const arr = p[key] as string[];
      return { ...p, [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val] };
    });
  }

  async function handleSubscribe() {
    setStatus('saving');
    setErrorMsg('');
    const result = await subscribeToPush(prefs);
    if (result.success) {
      setSubscribed(true);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } else {
      setErrorMsg(result.error ?? 'Unknown error');
      setStatus('error');
    }
  }

  async function handleUnsubscribe() {
    setStatus('saving');
    await unsubscribeFromPush();
    setSubscribed(false);
    setStatus('idle');
  }

  async function handleUpdate() {
    setStatus('saving');
    const result = await subscribeToPush(prefs);
    if (result.success) { setStatus('success'); setTimeout(() => setStatus('idle'), 3000); }
    else { setErrorMsg(result.error ?? 'Unknown error'); setStatus('error'); }
  }

  if (supportState === 'loading') return null;

  if (supportState === 'ios-install') {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="max-w-sm mx-auto px-4 py-10 space-y-5">
          {/* Hero */}
          <div className="rounded-2xl bg-gradient-to-br from-teal-600 to-teal-800 text-white px-6 py-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-4">
              <BellRing className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Enable Notifications</h1>
            <p className="text-teal-200 text-sm">
              To get push notifications on iPhone, you need to add FlatmateFind to your Home Screen first.
            </p>
          </div>

          {/* Steps */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">3 quick steps</p>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 text-sm font-bold flex items-center justify-center shrink-0">1</div>
              <div>
                <p className="text-sm font-semibold text-slate-800 mb-0.5">Tap the Share button</p>
                <p className="text-xs text-slate-500">Tap <Share className="w-3.5 h-3.5 inline -mt-0.5" /> at the bottom of your Safari browser.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 text-sm font-bold flex items-center justify-center shrink-0">2</div>
              <div>
                <p className="text-sm font-semibold text-slate-800 mb-0.5">Add to Home Screen</p>
                <p className="text-xs text-slate-500">Scroll down and tap <SquarePlus className="w-3.5 h-3.5 inline -mt-0.5" /> <strong>&quot;Add to Home Screen&quot;</strong>, then tap <strong>Add</strong>.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 text-sm font-bold flex items-center justify-center shrink-0">3</div>
              <div>
                <p className="text-sm font-semibold text-slate-800 mb-0.5">Open from Home Screen</p>
                <p className="text-xs text-slate-500">Launch FlatmateFind from your Home Screen, then come back to this page to set up notifications.</p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800">
            Requires <strong>iOS 16.4 or later</strong>. Check Settings → General → Software Update.
          </div>
        </div>
      </main>
    );
  }

  if (supportState === 'unsupported') {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-sm w-full text-center shadow-sm">
          <BellOff className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h2 className="font-bold text-slate-800 mb-1">Not Supported</h2>
          <p className="text-sm text-slate-500">Push notifications aren&apos;t supported in this browser. Try Chrome on Android or Safari on iOS 16.4+.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-5">

        {/* Hero */}
        <div className="rounded-2xl bg-gradient-to-br from-teal-600 to-teal-800 text-white px-6 py-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
              <BellRing className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-1">Notifications</h1>
              <p className="text-teal-200 text-sm">
                Get notified only about what matters — new rooms, jobs, and events that match your preferences.
              </p>
            </div>
          </div>
        </div>

        {/* Status banner */}
        {subscribed && (
          <div className="flex items-center gap-3 bg-teal-50 border border-teal-200 rounded-xl px-4 py-3">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            <p className="text-sm text-teal-800 font-medium flex-1">Notifications are active on this device.</p>
            <button onClick={handleUnsubscribe} className="text-xs text-red-500 hover:text-red-700 font-semibold transition-colors">
              Turn off
            </button>
          </div>
        )}

        {/* ── Listings ─────────────────────────────────────────────────────── */}
        <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-100 flex items-center justify-center">
              <Home className="w-4 h-4 text-teal-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">New Rooms &amp; Listings</p>
              <p className="text-xs text-slate-400">Get notified when a listing matches your criteria</p>
            </div>
          </div>

          {/* Suburbs */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
              <MapPin className="w-3 h-3 inline mr-1" />Suburbs (leave empty for all)
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {prefs.suburbs.map((s) => (
                <Tag key={s} label={s} onRemove={() => setPrefs((p) => ({ ...p, suburbs: p.suburbs.filter((x) => x !== s) }))} />
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={suburbInput}
                onChange={(e) => setSuburbInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addSuburb()}
                placeholder="e.g. Bondi, Fitzroy, Newtown..."
                className="flex-1 text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300"
              />
              <button onClick={addSuburb} className="px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
              <DollarSign className="w-3 h-3 inline mr-1" />Weekly Rent Budget ($/wk)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number" min="0" placeholder="Min e.g. 150"
                value={prefs.budgetMin ?? ''}
                onChange={(e) => setPrefs((p) => ({ ...p, budgetMin: e.target.value ? Number(e.target.value) : null }))}
                className="text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300 w-full"
              />
              <input
                type="number" min="0" placeholder="Max e.g. 350"
                value={prefs.budgetMax ?? ''}
                onChange={(e) => setPrefs((p) => ({ ...p, budgetMax: e.target.value ? Number(e.target.value) : null }))}
                className="text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300 w-full"
              />
            </div>
          </div>

          {/* Room types */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Room Type</label>
            <div className="flex flex-wrap gap-2">
              {ROOM_TYPES.map((t) => (
                <Chip key={t} label={t} active={prefs.roomTypes.includes(t)} onClick={() => toggleArr('roomTypes', t)} />
              ))}
            </div>
          </div>

          {/* States */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">States</label>
            <div className="flex flex-wrap gap-2">
              {AUSTRALIAN_STATES.map((s) => (
                <Chip key={s.abbr} label={s.abbr} active={prefs.states.includes(s.abbr)} onClick={() => toggleArr('states', s.abbr)} />
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
              <Globe className="w-3 h-3 inline mr-1" />Language / Nationality Preference
            </label>
            <div className="flex flex-wrap gap-2">
              {POST_LANGUAGES.slice(0, 12).map(({ label }) => (
                <Chip key={label} label={label} active={prefs.languages.includes(label)} onClick={() => toggleArr('languages', label)} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Jobs ─────────────────────────────────────────────────────────── */}
        <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <Toggle
            enabled={prefs.enableJobs} onChange={(v) => setPrefs((p) => ({ ...p, enableJobs: v }))}
            label="Jobs Board" desc="New job listings near you"
            icon={Briefcase} color="bg-blue-100 text-blue-600"
          />
          {prefs.enableJobs && (
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Job Types</label>
              <div className="flex flex-wrap gap-2 pl-1">
                {JOB_TYPES.map((t) => (
                  <Chip key={t} label={t} active={prefs.jobTypes.includes(t)} onClick={() => toggleArr('jobTypes', t)} />
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ── Find More ────────────────────────────────────────────────────── */}
        <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Find More</p>
          <Toggle
            enabled={prefs.enableEvents} onChange={(v) => setPrefs((p) => ({ ...p, enableEvents: v }))}
            label="Events" desc="Markets, meetups &amp; activities near you"
            icon={CalendarDays} color="bg-rose-100 text-rose-600"
          />
          <Toggle
            enabled={prefs.enableBusiness} onChange={(v) => setPrefs((p) => ({ ...p, enableBusiness: v }))}
            label="Business for Sale" desc="New businesses listed near you"
            icon={Building2} color="bg-purple-100 text-purple-600"
          />
          <Toggle
            enabled={prefs.enableMarket} onChange={(v) => setPrefs((p) => ({ ...p, enableMarket: v }))}
            label="Market" desc="New products &amp; services posted"
            icon={ShoppingBag} color="bg-amber-100 text-amber-600"
          />
        </section>

        {/* ── Community ────────────────────────────────────────────────────── */}
        <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <Toggle
            enabled={prefs.enableCommunity} onChange={(v) => setPrefs((p) => ({ ...p, enableCommunity: v }))}
            label="Community Posts" desc="New Facebook group posts &amp; community updates"
            icon={Users} color="bg-cyan-100 text-cyan-600"
          />
        </section>

        {/* ── Action ───────────────────────────────────────────────────────── */}
        {status === 'error' && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs text-red-700">
            <X className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            {errorMsg}
          </div>
        )}

        {status === 'success' && (
          <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-xl px-4 py-3 text-xs text-teal-700 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            Preferences saved! You&apos;ll only be notified about what matters to you.
          </div>
        )}

        <button
          onClick={subscribed ? handleUpdate : handleSubscribe}
          disabled={status === 'saving'}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-semibold rounded-2xl transition-colors shadow-sm"
        >
          {status === 'saving' ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
          ) : subscribed ? (
            <><Bell className="w-4 h-4" /> Update Preferences</>
          ) : (
            <><Bell className="w-4 h-4" /> Enable Notifications</>
          )}
        </button>

        <p className="text-center text-xs text-slate-400 pb-4">
          Notifications are device-specific. You can turn them off at any time.
        </p>
      </div>
    </main>
  );
}
