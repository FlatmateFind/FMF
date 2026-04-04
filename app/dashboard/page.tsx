'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart, Star, Home, PlusCircle, MapPin, Bed, Bath,
  Calendar, Pause, Play, Trash2, MessageCircle, ChevronRight,
  Users, LayoutDashboard, Search, Building2, Sparkles, DollarSign, CheckCircle,
  Briefcase, Eye, EyeOff,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useFavorites } from '@/hooks/useFavorites';
import { useShortlist } from '@/hooks/useShortlist';
import { usePostedListings } from '@/hooks/usePostedListings';
import { useRenterProfile } from '@/hooks/useRenterProfile';
import { usePostedJobs } from '@/hooks/usePostedJobs';
import { listings } from '@/data/listings';
import { Listing } from '@/lib/types';
import ListingCard from '@/components/ListingCard';
import { RenterAvatar } from '@/components/RenterCard';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect if not signed in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin?from=/dashboard');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return user.role === 'renter' ? <RenterDashboard /> : <SubletterDashboard />;
}

/* ── Renter Dashboard ────────────────────────────────────────────────────── */
function RenterDashboard() {
  const { user } = useAuth();
  const { favorites, loaded: favLoaded } = useFavorites();
  const { profile, loaded: profileLoaded, deactivate, clear } = useRenterProfile();
  const savedListings = listings.filter((l) => favorites.includes(l.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-teal-50 rounded-xl">
          <Search className="w-6 h-6 text-teal-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user?.name?.split(' ')[0]}!</h1>
          <p className="text-sm text-slate-500">Renter Dashboard</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon={<Heart className="w-5 h-5 text-rose-500" />} label="Saved listings" value={favorites.length} bg="bg-rose-50" />
        <StatCard icon={<MessageCircle className="w-5 h-5 text-teal-500" />} label="Active chats" value={favorites.length} bg="bg-teal-50" />
        <StatCard icon={<Search className="w-5 h-5 text-blue-500" />} label="Cities browsed" value={[...new Set(savedListings.map(l => l.location.city))].length} bg="bg-blue-50" />
      </div>

      {/* Profile card */}
      {profileLoaded && (
        <section className="mb-10">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-teal-500" />
            My Renter Profile
          </h2>
          {!profile ? (
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="p-3 bg-teal-100 rounded-xl shrink-0">
                <Sparkles className="w-7 h-7 text-teal-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 mb-1">Complete your renter profile</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Tell subletters who you are, what you&apos;re looking for, and your budget. A complete profile gets you noticed faster.
                </p>
              </div>
              <Link
                href="/profile"
                className="shrink-0 flex items-center gap-2 bg-teal-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-teal-700 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Build profile
              </Link>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start gap-5">
              <RenterAvatar profile={profile} size="lg" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-bold text-slate-900">{profile.name}</h3>
                  {profile.age && <span className="text-sm text-slate-400">Age {profile.age}</span>}
                  {profile.nationality && (
                    <span className="px-2 py-0.5 bg-teal-50 text-teal-700 text-xs font-medium rounded-full border border-teal-100">
                      {profile.nationality}
                    </span>
                  )}
                  {profile.status === 'inactive' && (
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-xs font-medium rounded-full border border-amber-100">
                      Deactivated
                    </span>
                  )}
                </div>
                {profile.aboutMe && (
                  <p className="text-sm text-slate-500 mb-3 line-clamp-2">{profile.aboutMe}</p>
                )}
                <div className="flex flex-wrap gap-3 text-xs text-slate-600">
                  {profile.preferredStates.length > 0 && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-teal-500" />
                      {profile.preferredStates.join(', ')}
                    </span>
                  )}
                  {profile.budgetMax && (
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-teal-500" />
                      Up to ${profile.budgetMax}/wk
                    </span>
                  )}
                  {profile.moveInDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-teal-500" />
                      From {new Date(profile.moveInDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={deactivate}
                  title={profile.status === 'inactive' ? 'Reactivate profile' : 'Deactivate profile'}
                  className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                    profile.status === 'inactive'
                      ? 'border-green-200 text-green-600 hover:bg-green-50'
                      : 'border-amber-200 text-amber-600 hover:bg-amber-50'
                  }`}
                >
                  {profile.status === 'inactive'
                    ? <><Eye className="w-3.5 h-3.5" />Reactivate</>
                    : <><EyeOff className="w-3.5 h-3.5" />Deactivate</>
                  }
                </button>
                <button
                  onClick={() => { if (confirm('Remove your profile permanently? This cannot be undone.')) clear(); }}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />Remove
                </button>
                <Link
                  href="/profile"
                  className="flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-800 transition-colors border border-teal-200 px-4 py-2 rounded-xl hover:bg-teal-50"
                >
                  Edit profile <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Saved listings */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-current" />
            Saved Listings
          </h2>
          <Link href="/listings" className="text-sm text-teal-600 hover:text-teal-800 flex items-center gap-1">
            Browse more <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {!favLoaded ? (
          <LoadingSpinner />
        ) : savedListings.length === 0 ? (
          <EmptyState
            icon={<Heart className="w-10 h-10 text-slate-300" />}
            title="No saved listings yet"
            description="Tap the ♡ heart on any listing card to save it here."
            action={{ label: 'Browse listings', href: '/listings' }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {savedListings.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        )}
      </section>
    </div>
  );
}

/* ── Subletter Dashboard ─────────────────────────────────────────────────── */
function SubletterDashboard() {
  const { user } = useAuth();
  const { shortlisted } = useShortlist();
  const { posted, toggleStatus, markTaken, remove, loaded: postLoaded } = usePostedListings();
  const { jobs: myJobs, loaded: jobsLoaded, toggleStatus: toggleJob, markFilled, remove: removeJob } = usePostedJobs(user?.id);
  const shortlistedListings = listings.filter((l) => shortlisted.includes(l.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-teal-50 rounded-xl">
            <Building2 className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user?.name?.split(' ')[0]}!</h1>
            <p className="text-sm text-slate-500">Subletter Dashboard</p>
          </div>
        </div>
        <Link href="/post" className="flex items-center gap-1.5 text-sm bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
          <PlusCircle className="w-4 h-4" />
          Post a listing
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
        <StatCard icon={<Home className="w-5 h-5 text-teal-500" />} label="My listings" value={posted.length} bg="bg-teal-50" />
        <StatCard icon={<Star className="w-5 h-5 text-amber-500" />} label="Shortlisted renters" value={shortlisted.length} bg="bg-amber-50" />
        <StatCard icon={<MessageCircle className="w-5 h-5 text-blue-500" />} label="Enquiries" value={shortlisted.length} bg="bg-blue-50" />
      </div>

      {/* My Listings */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Home className="w-5 h-5 text-teal-500" />
            My Listings
          </h2>
        </div>

        {!postLoaded ? (
          <LoadingSpinner />
        ) : posted.length === 0 ? (
          <EmptyState
            icon={<Home className="w-10 h-10 text-slate-300" />}
            title="No listings posted yet"
            description="Post your first listing to start receiving enquiries from renters."
            action={{ label: '+ Post a listing', href: '/post' }}
          />
        ) : (
          <div className="space-y-3">
            {posted.map((listing) => (
              <PostedListingRow
                key={listing.id}
                listing={listing}
                onToggle={() => toggleStatus(listing.id)}
                onMarkTaken={() => markTaken(listing.id)}
                onRemove={() => remove(listing.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* My Job Posts */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-500" />
            My Job Posts
          </h2>
          <Link href="/jobs/post" className="flex items-center gap-1.5 text-sm text-teal-600 hover:text-teal-800">
            + Post a job <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {!jobsLoaded ? (
          <LoadingSpinner />
        ) : myJobs.length === 0 ? (
          <EmptyState
            icon={<Briefcase className="w-10 h-10 text-slate-300" />}
            title="No job posts yet"
            description="Post a job listing to find workers from the community."
            action={{ label: '+ Post a job', href: '/jobs/post' }}
          />
        ) : (
          <div className="space-y-3">
            {myJobs.map((job) => (
              <PostedJobRow
                key={job.id}
                job={job}
                onToggle={() => toggleJob(job.id)}
                onMarkFilled={() => markFilled(job.id)}
                onRemove={() => removeJob(job.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Shortlisted Renters */}
      <section>
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-5">
          <Star className="w-5 h-5 text-amber-500 fill-current" />
          Shortlisted Renters
        </h2>

        {shortlistedListings.length === 0 ? (
          <EmptyState
            icon={<Star className="w-10 h-10 text-slate-300" />}
            title="No renters shortlisted yet"
            description='Open a listing → Message Host → switch to Host view → tap "Shortlist renter".'
          />
        ) : (
          <div className="space-y-3">
            {shortlistedListings.map((listing) => (
              <ShortlistedRenterRow key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* ── Shared sub-components ───────────────────────────────────────────────── */

function StatCard({ icon, label, value, bg, note }: {
  icon: React.ReactNode; label: string; value: number; bg: string; note?: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-start gap-4">
      <div className={`p-2.5 rounded-xl ${bg} shrink-0`}>{icon}</div>
      <div>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <div className="text-sm text-slate-500">{label}</div>
        {note && <div className="text-xs text-slate-400 mt-0.5">{note}</div>}
      </div>
    </div>
  );
}

function EmptyState({ icon, title, description, action }: {
  icon: React.ReactNode; title: string; description: string; action?: { label: string; href: string };
}) {
  return (
    <div className="text-center py-14 bg-white rounded-2xl border border-dashed border-slate-200">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="font-semibold text-slate-700 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 mb-5 max-w-xs mx-auto">{description}</p>
      {action && (
        <Link href={action.href} className="inline-flex items-center gap-2 bg-teal-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-teal-700 transition-colors">
          {action.label}
        </Link>
      )}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="py-10 flex justify-center">
      <div className="w-7 h-7 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function PostedListingRow({ listing, onToggle, onMarkTaken, onRemove }: {
  listing: import('@/hooks/usePostedListings').PostedListing;
  onToggle: () => void;
  onMarkTaken: () => void;
  onRemove: () => void;
}) {
  const isTaken = listing.status === 'taken';
  return (
    <div className={`bg-white border rounded-xl p-4 flex items-center gap-4 ${isTaken ? 'border-red-200 opacity-75' : 'border-slate-200'}`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-slate-900 truncate">{listing.title}</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 ${
            listing.status === 'active' ? 'bg-green-100 text-green-700' :
            listing.status === 'taken' ? 'bg-red-100 text-red-700' :
            'bg-slate-100 text-slate-500'
          }`}>
            {listing.status === 'active' ? 'Active' : listing.status === 'taken' ? 'Taken' : 'Paused'}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{listing.address}, {listing.suburb} {listing.postcode}, {listing.city}</span>
          <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" />{listing.bedrooms} bed</span>
          <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" />{listing.bathrooms} bath</span>
          <span className="font-semibold text-teal-600">{listing.currency} {listing.rentAmount}/{listing.period}</span>
        </div>
        <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          Posted {new Date(listing.postedAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {!isTaken && (
          <>
            <button onClick={onToggle} title={listing.status === 'active' ? 'Pause' : 'Activate'} className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:border-teal-300 hover:text-teal-600 transition-colors">
              {listing.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button onClick={onMarkTaken} title="Mark as taken" className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:border-red-300 hover:text-red-500 transition-colors">
              <CheckCircle className="w-4 h-4" />
            </button>
          </>
        )}
        <button onClick={onRemove} title="Remove" className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:border-red-300 hover:text-red-500 transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function PostedJobRow({ job, onToggle, onMarkFilled, onRemove }: {
  job: import('@/data/jobs').JobPost;
  onToggle: () => void;
  onMarkFilled: () => void;
  onRemove: () => void;
}) {
  const isFilled = job.status === 'filled';
  const isPaused = job.status === 'paused';

  return (
    <div className={`bg-white border rounded-xl p-4 flex items-center gap-4 ${isFilled ? 'border-green-200 opacity-75' : isPaused ? 'border-amber-200' : 'border-slate-200'}`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="font-semibold text-slate-900 truncate">{job.title}</span>
          {job.company && <span className="text-sm text-slate-400 truncate">{job.company}</span>}
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 ${
            isFilled ? 'bg-green-100 text-green-700' :
            isPaused ? 'bg-amber-100 text-amber-700' :
            'bg-blue-100 text-blue-700'
          }`}>
            {isFilled ? 'Filled' : isPaused ? 'Paused' : 'Active'}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{job.suburb}, {job.state}</span>
          <span className="flex items-center gap-1 capitalize">{job.type}</span>
          {job.salary && <span className="font-semibold text-teal-600">{job.salary}</span>}
        </div>
        <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          Posted {new Date(job.postedAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {!isFilled && (
          <>
            <button onClick={onToggle} title={isPaused ? 'Resume' : 'Pause'} className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:border-amber-300 hover:text-amber-600 transition-colors">
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
            <button onClick={onMarkFilled} title="Mark as filled" className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:border-green-300 hover:text-green-600 transition-colors">
              <CheckCircle className="w-4 h-4" />
            </button>
          </>
        )}
        <button
          onClick={() => { if (confirm('Remove this job post permanently?')) onRemove(); }}
          title="Remove"
          className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:border-red-300 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function ShortlistedRenterRow({ listing }: { listing: Listing }) {
  return (
    <div className="bg-white border border-amber-200 rounded-xl p-4 flex items-center gap-4">
      <div className="p-2.5 bg-amber-50 rounded-xl shrink-0">
        <Star className="w-5 h-5 text-amber-500 fill-current" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-900 truncate">{listing.title}</p>
        <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{listing.location.suburb} {listing.location.postcode}, {listing.location.city}</span>
          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />Renter enquiry</span>
        </div>
      </div>
      <Link href={`/listings/${listing.id}`} className="shrink-0 flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-800 transition-colors">
        View chat <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
