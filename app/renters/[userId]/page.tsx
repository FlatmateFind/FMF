'use client';
import { Suspense, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, MapPin, DollarSign, Calendar, Home, User,
  Zap, Home as HomeIcon, PawPrint, CigaretteOff, Cigarette,
  Phone, Mail, MessageCircle, Lock, UserPlus, LogIn, CheckCircle,
} from 'lucide-react';
import { RenterProfile } from '@/lib/types';
import { RenterAvatar } from '@/components/RenterCard';
import { useAuth } from '@/context/AuthContext';
import AuthPromptModal from '@/components/AuthPromptModal';

const STORAGE_KEY = 'flatmatefind_renter_profiles';

function readProfiles(): RenterProfile[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as RenterProfile[];
  } catch {
    return [];
  }
}

function InfoPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-3 text-sm text-slate-700">
      <span className="text-teal-500 shrink-0">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function RenterDetailInner() {
  const { userId } = useParams<{ userId: string }>();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<RenterProfile | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const profiles = readProfiles();
    const found = profiles.find((p) => p.userId === userId) ?? null;
    setProfile(found);
    setLoaded(true);

    // scroll to #chat if hash present
    if (window.location.hash === '#chat' && found) {
      setTimeout(() => {
        document.getElementById('chat-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }, [userId]);

  if (!loaded || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-xl font-semibold text-slate-700 mb-2">Profile not found</p>
        <p className="text-slate-400 mb-6">This renter profile may have been removed.</p>
        <Link href="/renters" className="text-teal-600 hover:underline text-sm">← Back to Browse Profiles</Link>
      </div>
    );
  }

  const stateLabel = profile.preferredStates.length > 0
    ? profile.preferredStates.join(', ')
    : 'Anywhere in Australia';

  const budgetLabel = profile.budgetMin && profile.budgetMax
    ? `$${profile.budgetMin}–$${profile.budgetMax}/wk`
    : profile.budgetMax ? `Up to $${profile.budgetMax}/wk`
    : profile.budgetMin ? `From $${profile.budgetMin}/wk`
    : 'Budget flexible';

  const moveInLabel = profile.moveInDate
    ? new Date(profile.moveInDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Flexible';

  const joinedLabel = new Date(profile.createdAt).toLocaleDateString('en-AU', { month: 'long', year: 'numeric' });

  const canSeeContact = !!user;

  return (
    <>
      {showAuthModal && (
        <AuthPromptModal
          onClose={() => setShowAuthModal(false)}
          returnTo={`/renters/${userId}#chat`}
          icon={<MessageCircle className="w-7 h-7 text-teal-600" />}
          title="Sign in to contact this renter"
          message="Create a free account or sign in to view contact details and message renters directly."
        />
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-teal-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Browse Profiles
        </button>

        {/* Hero card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-5">
          <div className="flex items-start gap-5">
            <RenterAvatar profile={profile} size="lg" />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <h1 className="text-xl font-bold text-slate-900">{profile.name}</h1>
                {profile.age && <span className="text-sm text-slate-400">Age {profile.age}</span>}
              </div>
              <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-1">
                <User className="w-3.5 h-3.5" />
                {profile.nationality}
              </div>
              <p className="text-xs text-slate-400">Joined {joinedLabel}</p>
            </div>
          </div>

          {profile.aboutMe && (
            <div className="mt-5 pt-5 border-t border-slate-100">
              <h2 className="text-sm font-semibold text-slate-700 mb-2">About me</h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{profile.aboutMe}</p>
            </div>
          )}
        </div>

        {/* What I'm looking for */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-5">
          <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Home className="w-4 h-4 text-teal-600" /> What I&apos;m Looking For
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <InfoPill icon={<MapPin className="w-4 h-4" />} label={stateLabel} />
            <InfoPill icon={<DollarSign className="w-4 h-4" />} label={budgetLabel} />
            <InfoPill icon={<Calendar className="w-4 h-4" />} label={`Move in: ${moveInLabel}`} />
            <InfoPill icon={<Home className="w-4 h-4" />} label={
              profile.preferredRoomTypes.length > 0
                ? profile.preferredRoomTypes.map((t) => t.charAt(0).toUpperCase() + t.slice(1)).join(', ')
                : 'Any type'
            } />
          </div>

          {profile.minimumStay && (
            <p className="text-sm text-slate-500 mb-3">Minimum stay: <span className="font-medium text-slate-700">{profile.minimumStay}</span></p>
          )}

          {profile.preferredCities.length > 0 && (
            <p className="text-sm text-slate-500 mb-3">Preferred cities: <span className="font-medium text-slate-700">{profile.preferredCities.join(', ')}</span></p>
          )}

          <div className="flex flex-wrap gap-2 mt-3">
            {profile.preferredStayType && profile.preferredStayType !== 'any' && (
              <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full border ${
                profile.preferredStayType === 'short term'
                  ? 'bg-blue-50 text-blue-700 border-blue-100'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-100'
              }`}>
                {profile.preferredStayType === 'short term'
                  ? <><Zap className="w-3 h-3" />Short term</>
                  : <><HomeIcon className="w-3 h-3" />Long term</>
                }
              </span>
            )}
            <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full border ${profile.petsOk ? 'bg-green-50 text-green-700 border-green-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
              <PawPrint className="w-3 h-3" />{profile.petsOk ? 'Pets OK' : 'No pets'}
            </span>
            <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full border ${profile.smokingOk ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
              {profile.smokingOk ? <><Cigarette className="w-3 h-3" />Smoking OK</> : <><CigaretteOff className="w-3 h-3" />Non-smoker</>}
            </span>
            {profile.furnishedPreference !== 'any' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full border border-slate-200 bg-slate-50 text-slate-600 capitalize">
                {profile.furnishedPreference}
              </span>
            )}
            {profile.houseGenderPreference !== 'any' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full border border-purple-100 bg-purple-50 text-purple-700 capitalize">
                {profile.houseGenderPreference === 'female' ? 'Female house' : 'Male house'}
              </span>
            )}
          </div>
        </div>

        {/* Preferred facilities */}
        {profile.preferredFacilities.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-5">
            <h2 className="font-bold text-slate-900 mb-4">Desired Facilities</h2>
            <div className="flex flex-wrap gap-2">
              {profile.preferredFacilities.map((f) => (
                <span key={f} className="px-3 py-1.5 text-sm bg-teal-50 text-teal-700 rounded-full border border-teal-100">
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Contact & Chat */}
        <div id="chat-section" className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-teal-600" /> Contact {profile.name.split(' ')[0]}
          </h2>

          {canSeeContact ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-green-600 mb-4">
                <CheckCircle className="w-4 h-4" />
                You&apos;re signed in — contact details are visible
              </div>

              {/* Phone */}
              {profile.phone ? (
                <a
                  href={`tel:${profile.phone}`}
                  className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50 transition-colors group"
                >
                  <div className="w-9 h-9 bg-teal-100 rounded-full flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-teal-700" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Phone</p>
                    <p className="text-sm font-semibold text-slate-800 group-hover:text-teal-700">{profile.phone}</p>
                  </div>
                </a>
              ) : (
                <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50 text-slate-400">
                  <Phone className="w-4 h-4 shrink-0" />
                  <span className="text-sm">No phone number provided</span>
                </div>
              )}

              {/* Email — always available to signed-in users via their account email */}
              <a
                href={`mailto:${profile.showEmail && profile.phone ? '' : ''}?subject=Hi from FlatmateFind — interested in connecting`}
                className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50 transition-colors group"
              >
                <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-blue-700" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Send a message</p>
                  <p className="text-sm font-semibold text-slate-800 group-hover:text-teal-700">Contact via platform</p>
                </div>
              </a>

              {/* Browse listings matching this renter */}
              <Link
                href={`/listings?state=${profile.preferredStates[0] ?? ''}&maxRent=${profile.budgetMax ?? ''}`}
                className="flex items-center justify-center gap-2 w-full py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors text-sm mt-2"
              >
                <Home className="w-4 h-4" />
                Show matching listings for this renter
              </Link>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-6 h-6 text-slate-400" />
              </div>
              <p className="font-semibold text-slate-700 mb-1">Sign in to see contact details</p>
              <p className="text-sm text-slate-400 mb-6">
                {profile.showPhone && profile.phone ? 'Phone number and more' : 'Contact info'} is available to signed-in members.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href={`/auth/signup?from=/renters/${userId}%23chat`}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors text-sm"
                >
                  <UserPlus className="w-4 h-4" />
                  Sign up — it&apos;s free
                </Link>
                <Link
                  href={`/auth/signin?from=/renters/${userId}%23chat`}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors text-sm"
                >
                  <LogIn className="w-4 h-4" />
                  Sign in
                </Link>
              </div>

              {/* Show publicly visible info */}
              {profile.showPhone && profile.phone && (
                <div className="mt-5 p-3 bg-teal-50 rounded-xl border border-teal-100 text-sm text-teal-700 flex items-center gap-2">
                  <Phone className="w-4 h-4 shrink-0" />
                  <span>Phone: <strong>{profile.phone}</strong></span>
                </div>
              )}
              {profile.showEmail && (
                <div className="mt-2 p-3 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 shrink-0" />
                  <span>Email is publicly shared by this renter</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function RenterDetailPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <RenterDetailInner />
    </Suspense>
  );
}
