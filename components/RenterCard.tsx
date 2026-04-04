'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  MapPin, DollarSign, Calendar, Home, User, Zap, Home as HomeIcon,
  PawPrint, CigaretteOff, Cigarette, MessageCircle,
  Phone, Mail, Lock, LogIn, UserPlus, X,
} from 'lucide-react';
import { RenterProfile } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';

function Avatar({ profile, size = 'md' }: { profile: RenterProfile; size?: 'sm' | 'md' | 'lg' }) {
  const dim = size === 'lg' ? 'w-20 h-20 text-2xl' : size === 'md' ? 'w-14 h-14 text-xl' : 'w-10 h-10 text-sm';
  if (profile.photo) {
    return (
      <img
        src={profile.photo}
        alt={profile.name}
        className={`${dim} rounded-full object-cover border-2 border-white shadow-sm shrink-0`}
      />
    );
  }
  const initials = profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className={`${dim} rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-bold shrink-0 border-2 border-white shadow-sm`}>
      {initials}
    </div>
  );
}

export { Avatar as RenterAvatar };

function ChatPopover({ profile, onClose }: { profile: RenterProfile; onClose: () => void }) {
  const { user } = useAuth();
  const firstName = profile.name.split(' ')[0];

  return (
    <div className="absolute bottom-full left-0 right-0 mb-2 z-30">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-teal-600" />
            <span className="font-semibold text-slate-800 text-sm">Contact {firstName}</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {user ? (
          /* Signed in — show contact options */
          <div className="space-y-2.5">
            {profile.phone ? (
              <a
                href={`tel:${profile.phone}`}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50 transition-colors group"
              >
                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center shrink-0">
                  <Phone className="w-3.5 h-3.5 text-teal-700" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400">Phone</p>
                  <p className="text-sm font-semibold text-slate-800 group-hover:text-teal-700">{profile.phone}</p>
                </div>
              </a>
            ) : (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <Phone className="w-4 h-4 text-slate-300 shrink-0" />
                <span className="text-sm text-slate-400">No phone provided</span>
              </div>
            )}

            <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50 transition-colors">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                <Mail className="w-3.5 h-3.5 text-blue-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-slate-400">Message</p>
                <p className="text-sm font-semibold text-slate-700 truncate">Via FlatmateFind profile</p>
              </div>
            </div>

            <Link
              href={`/renters/${profile.userId}#chat`}
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors mt-1"
            >
              View full contact details
            </Link>
          </div>
        ) : (
          /* Not signed in — auth prompt */
          <div className="text-center">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Lock className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-700 mb-1">Sign in to contact {firstName}</p>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              {profile.showPhone && profile.phone
                ? `Phone & contact info visible after sign-in.`
                : 'Contact details are available to signed-in members.'}
            </p>

            {/* Show public info if any */}
            {profile.showPhone && profile.phone && (
              <div className="mb-3 p-2.5 bg-teal-50 rounded-xl border border-teal-100 text-sm text-teal-700 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <span className="font-semibold">{profile.phone}</span>
              </div>
            )}

            <div className="flex gap-2">
              <Link
                href={`/auth/signup?from=/renters/${profile.userId}%23chat`}
                onClick={onClose}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-teal-600 text-white text-xs font-semibold rounded-xl hover:bg-teal-700 transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Sign up free
              </Link>
              <Link
                href={`/auth/signin?from=/renters/${profile.userId}%23chat`}
                onClick={onClose}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign in
              </Link>
            </div>
          </div>
        )}
      </div>
      {/* Caret */}
      <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-slate-200 rotate-45" />
    </div>
  );
}

export default function RenterCard({ profile }: { profile: RenterProfile }) {
  const [chatOpen, setChatOpen] = useState(false);

  const stateLabel = profile.preferredStates.length > 0
    ? profile.preferredStates.join(', ')
    : 'Anywhere in Australia';

  const budgetLabel = profile.budgetMin && profile.budgetMax
    ? `$${profile.budgetMin}–$${profile.budgetMax}/wk`
    : profile.budgetMax
    ? `Up to $${profile.budgetMax}/wk`
    : profile.budgetMin
    ? `From $${profile.budgetMin}/wk`
    : 'Budget flexible';

  const moveInLabel = profile.moveInDate
    ? new Date(profile.moveInDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Flexible';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-shadow flex flex-col gap-4">
      {/* Header row */}
      <div className="flex items-start gap-4">
        <Avatar profile={profile} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-slate-900 text-base">{profile.name}</h3>
            {profile.age && (
              <span className="text-xs text-slate-400">Age {profile.age}</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
            <User className="w-3 h-3" />
            {profile.nationality}
          </div>
          {profile.aboutMe && (
            <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed">{profile.aboutMe}</p>
          )}
        </div>
      </div>

      {/* Key info pills */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1.5 bg-slate-50 rounded-lg px-3 py-2 text-slate-600">
          <MapPin className="w-3.5 h-3.5 text-teal-500 shrink-0" />
          <span className="truncate">{stateLabel}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-50 rounded-lg px-3 py-2 text-slate-600">
          <DollarSign className="w-3.5 h-3.5 text-teal-500 shrink-0" />
          <span className="truncate font-semibold text-teal-700">{budgetLabel}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-50 rounded-lg px-3 py-2 text-slate-600">
          <Calendar className="w-3.5 h-3.5 text-teal-500 shrink-0" />
          <span className="truncate">Move in {moveInLabel}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-50 rounded-lg px-3 py-2 text-slate-600">
          <Home className="w-3.5 h-3.5 text-teal-500 shrink-0" />
          <span className="truncate capitalize">
            {profile.preferredRoomTypes.length > 0
              ? profile.preferredRoomTypes[0] + (profile.preferredRoomTypes.length > 1 ? ` +${profile.preferredRoomTypes.length - 1}` : '')
              : 'Any type'}
          </span>
        </div>
      </div>

      {/* Tags row */}
      <div className="flex flex-wrap gap-1.5">
        {profile.preferredStayType && profile.preferredStayType !== 'any' && (
          <span className={`px-2 py-0.5 text-[11px] font-medium rounded-full border ${
            profile.preferredStayType === 'short term'
              ? 'bg-blue-50 text-blue-700 border-blue-100'
              : 'bg-emerald-50 text-emerald-700 border-emerald-100'
          }`}>
            {profile.preferredStayType === 'short term'
              ? <><Zap className="w-3 h-3 inline mr-1" />Short term</>
              : <><HomeIcon className="w-3 h-3 inline mr-1" />Long term</>
            }
          </span>
        )}
        {profile.minimumStay && (
          <span className="px-2 py-0.5 bg-teal-50 text-teal-700 text-[11px] font-medium rounded-full border border-teal-100">
            Min. {profile.minimumStay}
          </span>
        )}
        <span className={`px-2 py-0.5 text-[11px] font-medium rounded-full border ${profile.petsOk ? 'bg-green-50 text-green-700 border-green-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
          {profile.petsOk ? <><PawPrint className="w-3 h-3 inline mr-1" />Pets ok</> : 'No pets'}
        </span>
        <span className={`px-2 py-0.5 text-[11px] font-medium rounded-full border ${profile.smokingOk ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
          {profile.smokingOk ? <><Cigarette className="w-3 h-3 inline mr-1" />Smoking ok</> : <><CigaretteOff className="w-3 h-3 inline mr-1" />Non-smoker</>}
        </span>
        {profile.furnishedPreference !== 'any' && (
          <span className="px-2 py-0.5 bg-slate-50 text-slate-600 text-[11px] font-medium rounded-full border border-slate-200 capitalize">
            {profile.furnishedPreference}
          </span>
        )}
      </div>

      {/* CTA — relative container for the popover */}
      <div className="relative mt-auto pt-1">
        {chatOpen && (
          <ChatPopover profile={profile} onClose={() => setChatOpen(false)} />
        )}
        <div className="flex gap-2">
          <Link
            href={`/renters/${profile.userId}`}
            className="flex-1 text-center py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors"
          >
            View Profile
          </Link>
          <button
            type="button"
            onClick={() => setChatOpen((v) => !v)}
            className={`flex items-center justify-center gap-1.5 px-4 py-2.5 border text-sm font-semibold rounded-xl transition-colors ${
              chatOpen
                ? 'bg-teal-600 border-teal-600 text-white'
                : 'border-teal-600 text-teal-700 hover:bg-teal-50'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            Chat
          </button>
        </div>
      </div>
    </div>
  );
}
