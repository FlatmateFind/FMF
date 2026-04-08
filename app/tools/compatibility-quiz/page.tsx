'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ChevronLeft, ChevronRight, RotateCcw, Share2, Check,
  Moon, Sparkles, Users, Volume2, Wind, PawPrint,
  DollarSign, MapPin, Calendar, Home, Building2, Briefcase,
  UserPlus, BedDouble, Lock, User, AlertTriangle, ShieldCheck,
  Cigarette, Clock, Layers, ArrowRight, BarChart3,
} from 'lucide-react';
import clsx from 'clsx';
import ListingCard from '@/components/ListingCard';
import { listings } from '@/data/listings';
import type { Listing } from '@/lib/types';

// ─── Types ────────────────────────────────────────────────────────────────────

type Dims = Partial<Record<'noise' | 'social' | 'cleanliness' | 'schedule', number>>;

interface Question {
  id: string;
  question: string;
  hint?: string;
  Icon: React.ElementType;
  options: { label: string; sublabel?: string; value: string; dim?: Dims }[];
}

interface ProfileType {
  key: string;
  name: string;
  Icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  ringColor: string;
  tagline: string;
  description: string;
  traits: string[];
  lookFor: { icon: React.ElementType; text: string }[];
  watchOut: { icon: React.ElementType; text: string }[];
}

// ─── Questions ────────────────────────────────────────────────────────────────

const QUESTIONS: Question[] = [
  {
    id: 'state',
    question: 'Which state are you looking to live in?',
    hint: 'We\'ll only show listings available in your chosen state.',
    Icon: MapPin,
    options: [
      { label: 'New South Wales', sublabel: 'Sydney & surrounds', value: 'NSW' },
      { label: 'Victoria', sublabel: 'Melbourne & surrounds', value: 'VIC' },
      { label: 'Queensland', sublabel: 'Brisbane & Gold Coast', value: 'QLD' },
      { label: 'Western Australia', sublabel: 'Perth & surrounds', value: 'WA' },
      { label: 'South Australia', sublabel: 'Adelaide & surrounds', value: 'SA' },
      { label: 'Open to anywhere', sublabel: 'No preference', value: 'any' },
    ],
  },
  {
    id: 'budget',
    question: 'What is your weekly rent budget?',
    hint: 'Include your share of bills where listed.',
    Icon: DollarSign,
    options: [
      { label: 'Under $300 / week', sublabel: 'Budget-friendly', value: 'low' },
      { label: '$300 – $450 / week', sublabel: 'Mid-range', value: 'mid' },
      { label: '$450 – $600 / week', sublabel: 'Comfortable', value: 'upper' },
      { label: '$600+ / week', sublabel: 'Premium', value: 'luxury' },
    ],
  },
  {
    id: 'roomType',
    question: 'What type of accommodation are you after?',
    Icon: BedDouble,
    options: [
      { label: 'Private room in a share house', sublabel: 'Own bedroom, shared common areas', value: 'shared' },
      { label: 'Studio apartment', sublabel: 'Self-contained, no housemates', value: 'studio' },
      { label: 'Whole apartment or house', sublabel: 'Full property for yourself or a group', value: 'whole' },
      { label: 'No preference', sublabel: 'Open to any option', value: 'any' },
    ],
  },
  {
    id: 'furnished',
    question: 'Do you need the place to be furnished?',
    Icon: Home,
    options: [
      { label: 'Yes — fully furnished', sublabel: 'I need bed, desk and storage included', value: 'furnished' },
      { label: 'Prefer unfurnished', sublabel: 'I have my own furniture', value: 'unfurnished' },
      { label: 'No preference', sublabel: 'Either works for me', value: 'any' },
    ],
  },
  {
    id: 'stay',
    question: 'How long are you planning to stay?',
    Icon: Calendar,
    options: [
      { label: 'Short term', sublabel: '1–2 months', value: 'short' },
      { label: 'Medium term', sublabel: '3–6 months', value: 'medium' },
      { label: 'Long term', sublabel: '6 months or more', value: 'long' },
    ],
  },
  {
    id: 'smoking',
    question: 'What is your smoking preference?',
    Icon: Wind,
    options: [
      { label: 'I smoke regularly — indoors is fine', value: 'smoke-inside' },
      { label: 'I smoke, but only outside', value: 'smoke-outside' },
      { label: 'Non-smoker — fine if others smoke outside', value: 'ok-outside' },
      { label: 'Strongly prefer a smoke-free household', value: 'no-smoke' },
    ],
  },
  {
    id: 'pets',
    question: 'What is your pets situation?',
    Icon: PawPrint,
    options: [
      { label: 'I have pets and need to bring them', sublabel: 'Must be a pet-friendly property', value: 'have-pet' },
      { label: 'I love pets but don\'t have any', sublabel: 'Would enjoy a household with pets', value: 'love-pets' },
      { label: 'Fine either way', sublabel: 'No strong preference', value: 'neutral' },
      { label: 'Prefer no pets', sublabel: 'Allergy or personal preference', value: 'no-pets' },
    ],
  },
  {
    id: 'sleep',
    question: 'What time do you usually go to sleep?',
    hint: 'This helps match you with housemates on a similar schedule.',
    Icon: Moon,
    options: [
      { label: 'Before 10 PM', sublabel: 'Early riser', value: 'early', dim: { schedule: 0, noise: 0 } },
      { label: '10 PM – midnight', sublabel: 'Standard schedule', value: 'normal', dim: { schedule: 1, noise: 1 } },
      { label: 'Midnight – 2 AM', sublabel: 'Night person', value: 'late', dim: { schedule: 2, noise: 2 } },
      { label: 'After 2 AM', sublabel: 'True night owl', value: 'very-late', dim: { schedule: 3, noise: 3 } },
    ],
  },
  {
    id: 'clean',
    question: 'How do you keep shared spaces?',
    Icon: Sparkles,
    options: [
      { label: 'Spotless at all times', sublabel: 'I clean before things pile up', value: 'very-clean', dim: { cleanliness: 3 } },
      { label: 'Clean up the same day', sublabel: 'Dishes and benches done nightly', value: 'clean', dim: { cleanliness: 2 } },
      { label: 'Clean up within a few days', sublabel: 'It gets done, just not immediately', value: 'casual', dim: { cleanliness: 1 } },
      { label: 'Pretty relaxed about it', sublabel: 'Mess doesn\'t bother me much', value: 'messy', dim: { cleanliness: 0 } },
    ],
  },
  {
    id: 'noise',
    question: 'What is your relationship with noise at home?',
    Icon: Volume2,
    options: [
      { label: 'I need total quiet', sublabel: 'I work or study from home and can\'t handle distractions', value: 'silent', dim: { noise: 0 } },
      { label: 'Light background noise is fine', sublabel: 'Talking or music at low volume is ok', value: 'low', dim: { noise: 1 } },
      { label: 'Music and TV are always on', sublabel: 'Normal household noise doesn\'t bother me', value: 'medium', dim: { noise: 2 } },
      { label: 'I love a lively household', sublabel: 'The louder the better', value: 'loud', dim: { noise: 3 } },
    ],
  },
  {
    id: 'guests',
    question: 'How often do you have guests over?',
    Icon: UserPlus,
    options: [
      { label: 'Almost every day', sublabel: 'My place is always social', value: 'very-often', dim: { social: 3, noise: 2 } },
      { label: 'A few times a week', sublabel: 'Friends over regularly', value: 'often', dim: { social: 2, noise: 1 } },
      { label: 'A couple of times a month', sublabel: 'Occasional visitors', value: 'sometimes', dim: { social: 1, noise: 1 } },
      { label: 'Rarely or never', sublabel: 'I keep my home life private', value: 'rarely', dim: { social: 0, noise: 0 } },
    ],
  },
  {
    id: 'vibe',
    question: 'What household vibe suits you best?',
    hint: 'Be honest — compatibility is about finding the right match, not the "right" answer.',
    Icon: Users,
    options: [
      { label: 'Very communal', sublabel: 'Shared dinners, movie nights, always hanging out', value: 'communal', dim: { social: 3 } },
      { label: 'Friendly but independent', sublabel: 'We get along but everyone has their own life', value: 'friendly', dim: { social: 2 } },
      { label: 'Quiet and professional', sublabel: 'Respectful co-habitants, minimal interaction', value: 'professional', dim: { social: 1, noise: 0 } },
      { label: 'Fully independent', sublabel: 'I just need my own space, not housemates', value: 'independent', dim: { social: 0 } },
    ],
  },
];

// ─── Profiles ─────────────────────────────────────────────────────────────────

const PROFILES: Record<string, ProfileType> = {
  'Night Owl': {
    key: 'Night Owl',
    name: 'The Night Owl',
    Icon: Moon,
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
    ringColor: 'border-violet-200',
    tagline: 'Alive after midnight, asleep by noon.',
    description:
      'You thrive on a late schedule — whether that\'s late-night study sessions, gaming, socialising or working. You\'re at your most productive when the rest of the world has gone quiet. The right household gives you the freedom to keep your own hours without judgement.',
    traits: ['Late sleeper', 'Flexible schedule', 'Quiet mornings', 'Night productivity'],
    lookFor: [
      { icon: Moon, text: 'Fellow night owls or shift workers who keep similar hours' },
      { icon: Volume2, text: 'Housemates who won\'t complain about late-night noise' },
      { icon: Users, text: 'People with a relaxed, no-judgement household culture' },
    ],
    watchOut: [
      { icon: AlertTriangle, text: 'Early risers who need silence by 9 PM' },
      { icon: AlertTriangle, text: 'People with strict "quiet hours after 10 PM" rules' },
      { icon: AlertTriangle, text: 'Light sleepers who are sensitive to movement at night' },
    ],
  },
  'Clean Freak': {
    key: 'Clean Freak',
    name: 'The Clean Freak',
    Icon: Sparkles,
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
    ringColor: 'border-teal-200',
    tagline: 'A clean home is a happy home.',
    description:
      'You keep shared spaces immaculate and believe everyone in a household should pull their weight. You\'re organised, proactive about cleaning, and take pride in a tidy living environment. Your ideal housemates see cleanliness the same way — no roster needed because everyone just does it.',
    traits: ['Spotless standards', 'Proactive cleaner', 'Organised', 'Routine-driven'],
    lookFor: [
      { icon: ShieldCheck, text: 'Housemates who clean up after themselves without being asked' },
      { icon: ShieldCheck, text: 'People who value shared cleaning rosters' },
      { icon: ShieldCheck, text: 'Organised, responsible individuals' },
    ],
    watchOut: [
      { icon: AlertTriangle, text: 'Self-described "messy but fine" types' },
      { icon: AlertTriangle, text: 'People who leave dishes in the sink overnight' },
      { icon: AlertTriangle, text: 'Those who don\'t notice clutter building up' },
    ],
  },
  'Social Butterfly': {
    key: 'Social Butterfly',
    name: 'The Social Butterfly',
    Icon: Users,
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-600',
    ringColor: 'border-pink-200',
    tagline: 'The more the merrier.',
    description:
      'Your place is always buzzing. You love having people over, sharing meals, and turning the living room into a social hub. You make any house feel like a home — but you need housemates who are on board with a lively, open-door household culture.',
    traits: ['Very social', 'Loves guests', 'Communal mindset', 'High energy'],
    lookFor: [
      { icon: Users, text: 'Social, outgoing housemates who enjoy group hangs' },
      { icon: ShieldCheck, text: 'People who love communal meals and shared evenings' },
      { icon: ShieldCheck, text: 'Those who don\'t mind last-minute guests' },
    ],
    watchOut: [
      { icon: AlertTriangle, text: 'Introverts who need quiet, undisturbed evenings' },
      { icon: AlertTriangle, text: 'People who dislike unannounced guests or noise' },
      { icon: AlertTriangle, text: 'Those working from home who need a focused environment' },
    ],
  },
  'Quiet Professional': {
    key: 'Quiet Professional',
    name: 'The Quiet Professional',
    Icon: Briefcase,
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-600',
    ringColor: 'border-slate-200',
    tagline: 'Respectful, reliable, and low-drama.',
    description:
      'You work hard, value your personal space, and just need a peaceful base to recharge after a long day. You\'re considerate about noise and mess, reliable with rent, and a genuinely easy person to live with — just don\'t expect house parties on a Tuesday.',
    traits: ['Professional', 'Independent', 'Tidy', 'Respectful'],
    lookFor: [
      { icon: Briefcase, text: 'Other working professionals or serious students' },
      { icon: ShieldCheck, text: 'Housemates who value quiet evenings and personal space' },
      { icon: ShieldCheck, text: 'Reliable, considerate, drama-free people' },
    ],
    watchOut: [
      { icon: AlertTriangle, text: 'Frequent entertainers or party-lovers' },
      { icon: AlertTriangle, text: 'Messy or disorganised housemates' },
      { icon: AlertTriangle, text: 'People with very irregular or unpredictable schedules' },
    ],
  },
  'Homebody': {
    key: 'Homebody',
    name: 'The Homebody',
    Icon: Home,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    ringColor: 'border-amber-200',
    tagline: 'Home is where I recharge.',
    description:
      'You love being home — cooking meals, watching shows, puttering around. You\'re content, easy-going, and genuinely enjoy the domestic side of life. You want a house that feels warm and comfortable, with housemates who appreciate a calm, cosy atmosphere.',
    traits: ['Homey vibe', 'Enjoys cooking', 'Cosy atmosphere', 'Low-maintenance'],
    lookFor: [
      { icon: Home, text: 'Chill, low-key housemates who enjoy a peaceful home' },
      { icon: ShieldCheck, text: 'People who appreciate a warm, comfortable household' },
      { icon: Users, text: 'Those who enjoy an occasional shared dinner' },
    ],
    watchOut: [
      { icon: AlertTriangle, text: 'Very social types who constantly fill the house with guests' },
      { icon: AlertTriangle, text: 'Night owls with late-night habits that disrupt your wind-down time' },
      { icon: AlertTriangle, text: 'People who are rarely home and hard to coordinate with on shared tasks' },
    ],
  },
  'Independent': {
    key: 'Independent',
    name: 'The Independent',
    Icon: Lock,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    ringColor: 'border-blue-200',
    tagline: 'My space, my rules.',
    description:
      'You value your privacy above everything. The ideal living situation for you is one where everyone respects each other\'s space and keeps to themselves. You\'re not unfriendly — you just prefer a clear boundary between your personal life and your living arrangement.',
    traits: ['Very private', 'Self-sufficient', 'Minimal interaction', 'Boundary-aware'],
    lookFor: [
      { icon: Lock, text: 'Housemates who respect personal space and don\'t pry' },
      { icon: ShieldCheck, text: 'People with independent routines who keep to themselves' },
      { icon: Building2, text: 'A studio or self-contained option for maximum privacy' },
    ],
    watchOut: [
      { icon: AlertTriangle, text: 'Highly social or communal households' },
      { icon: AlertTriangle, text: 'People who treat the living room as a permanent gathering spot' },
      { icon: AlertTriangle, text: 'Households where group activities are expected' },
    ],
  },
  'Free Spirit': {
    key: 'Free Spirit',
    name: 'The Free Spirit',
    Icon: Wind,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    ringColor: 'border-emerald-200',
    tagline: 'Go with the flow.',
    description:
      'Rules are more like guidelines for you. You\'re spontaneous, adaptable, and genuinely easy-going about most things. You bring good energy to any household and make friends easily — but you need housemates who match your flexibility and won\'t sweat the small stuff.',
    traits: ['Spontaneous', 'Adaptable', 'Easy-going', 'Open-minded'],
    lookFor: [
      { icon: Wind, text: 'Flexible, laid-back housemates who don\'t over-schedule everything' },
      { icon: ShieldCheck, text: 'People who communicate openly rather than passively' },
      { icon: Users, text: 'Those who bring positive energy to shared spaces' },
    ],
    watchOut: [
      { icon: AlertTriangle, text: 'Very structured or detail-oriented people who need strict routines' },
      { icon: AlertTriangle, text: 'Anyone with rigid cleaning expectations or house rules' },
      { icon: AlertTriangle, text: 'People who get stressed when things aren\'t planned well in advance' },
    ],
  },
};

// ─── Scoring ──────────────────────────────────────────────────────────────────

const DIM_MAX = { schedule: 3, cleanliness: 3, noise: 8, social: 6 } as const;

function getDims(answers: Record<string, string>): Record<keyof typeof DIM_MAX, number> {
  const d: Record<string, number> = { noise: 0, social: 0, cleanliness: 0, schedule: 0 };
  for (const q of QUESTIONS) {
    const chosen = q.options.find((o) => o.value === answers[q.id]);
    if (chosen?.dim) {
      for (const [k, v] of Object.entries(chosen.dim)) {
        d[k] = (d[k] ?? 0) + (v as number);
      }
    }
  }
  return d as Record<keyof typeof DIM_MAX, number>;
}

function getProfile(dims: Record<keyof typeof DIM_MAX, number>): ProfileType {
  const { schedule, cleanliness, noise, social } = dims;
  if (schedule >= 3)                          return PROFILES['Night Owl'];
  if (cleanliness >= 3)                       return PROFILES['Clean Freak'];
  if (social >= 5)                            return PROFILES['Social Butterfly'];
  if (noise <= 1 && social <= 1)              return PROFILES['Quiet Professional'];
  if (social <= 1)                            return PROFILES['Independent'];
  if (noise <= 3 && social >= 2 && social <= 4) return PROFILES['Homebody'];
  return PROFILES['Free Spirit'];
}

// ─── Listing matcher ──────────────────────────────────────────────────────────

const ROOM_TYPE_MAP: Record<string, string[]> = {
  shared: ['private room', 'shared room', 'master room', 'second room', 'study room', 'sunny room', 'living room'],
  studio: ['studio', 'self-contained'],
  whole: ['whole apartment', 'whole house'],
};

function parseMinStayMonths(s: string): number {
  const m = s.match(/(\d+)/);
  return m ? parseInt(m[1]) : 12;
}

const BUDGET_MAX: Record<string, number> = {
  low: 300,
  mid: 450,
  upper: 600,
  luxury: Infinity,
};

function softScore(answers: Record<string, string>, l: Listing): number {
  let s = 0;
  const rules = l.rules ?? [];
  const hasQuietRule = rules.some((r) => /quiet/i.test(r));
  const hasNoGuestsRule = rules.some((r) => /guest|overnight/i.test(r));

  if (answers.noise === 'silent' && hasQuietRule) s += 2;
  if (answers.noise === 'loud' && !hasQuietRule) s += 2;
  if (answers.guests === 'rarely' && hasNoGuestsRule) s += 2;
  if ((answers.guests === 'very-often' || answers.guests === 'often') && !hasNoGuestsRule) s += 2;
  if (l.featured) s += 1;
  return s;
}

function matchListings(answers: Record<string, string>): Listing[] {
  return listings
    .filter((l) => {
      // State
      if (answers.state && answers.state !== 'any' && l.location.state !== answers.state) return false;

      // Budget
      if (answers.budget) {
        const max = BUDGET_MAX[answers.budget] ?? Infinity;
        if (l.rent.amount > max) return false;
      }

      // Room type
      if (answers.roomType && answers.roomType !== 'any') {
        const valid = ROOM_TYPE_MAP[answers.roomType];
        if (valid && !valid.includes(l.type)) return false;
      }

      // Furnished
      if (answers.furnished === 'furnished' && l.furnished !== 'furnished') return false;
      if (answers.furnished === 'unfurnished' && l.furnished !== 'unfurnished') return false;

      // Stay duration
      if (answers.stay) {
        const months = parseMinStayMonths(l.minimumStay);
        if (answers.stay === 'short' && months > 2) return false;
        if (answers.stay === 'medium' && months > 6) return false;
      }

      // Smoking — hard filter only if user smokes inside
      if (answers.smoking === 'smoke-inside' && !l.smokingAllowed) return false;

      // Pets — hard filter only if user has pets
      if (answers.pets === 'have-pet' && !l.petsAllowed) return false;

      return true;
    })
    .sort((a, b) => softScore(answers, b) - softScore(answers, a));
}

// ─── Trait bar data ───────────────────────────────────────────────────────────

const TRAIT_BARS = [
  { key: 'schedule' as const, label: 'Schedule', low: 'Early bird', high: 'Night owl', color: 'bg-violet-500' },
  { key: 'cleanliness' as const, label: 'Cleanliness', low: 'Relaxed', high: 'Spotless', color: 'bg-teal-500' },
  { key: 'noise' as const, label: 'Noise level', low: 'Silent', high: 'Lively', color: 'bg-amber-500' },
  { key: 'social' as const, label: 'Sociability', low: 'Very private', high: 'Very social', color: 'bg-rose-500' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function CompatibilityQuizPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const current = QUESTIONS[step - 1];
  const isResult = step > QUESTIONS.length;
  const progress = step === 0 ? 0 : Math.round((step / QUESTIONS.length) * 100);

  const dims = useMemo(() => (isResult ? getDims(answers) : null), [isResult, answers]);
  const profile = useMemo(() => (dims ? getProfile(dims) : null), [dims]);
  const matched = useMemo(() => (isResult ? matchListings(answers) : []), [isResult, answers]);

  function selectAnswer(value: string) {
    setAnswers((a) => ({ ...a, [current.id]: value }));
  }

  function next() {
    if (step === 0) { setStep(1); return; }
    if (step <= QUESTIONS.length) setStep((s) => s + 1);
  }

  function reset() {
    setStep(0);
    setAnswers({});
  }

  async function copyResult() {
    if (!profile) return;
    await navigator.clipboard.writeText(
      `My flatmate personality is "${profile.name}" — ${profile.tagline}\nFind your type: https://flatmatefind.vercel.app/tools/compatibility-quiz`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Boxed header */}
        <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-purple-800 text-white px-6 py-8 mb-8">
          <Link href="/tools" className="flex items-center gap-1.5 text-violet-300 hover:text-white text-xs mb-4 transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" /> Back to Tools
          </Link>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-1">Flatmate Compatibility Quiz</h1>
              <p className="text-violet-200 text-sm">
                12 questions about your lifestyle, budget and preferences — matched to real available listings.
              </p>
            </div>
          </div>
        </div>

        {/* ── Intro ─────────────────────────────────────────────────────────── */}
        {step === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
                <BarChart3 className="w-5 h-5 text-violet-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">What kind of housemate are you?</h2>
            </div>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Answer 12 questions about your lifestyle, budget and preferences. We&apos;ll identify your flatmate
              personality type and show you listings that genuinely match your answers — not just any random room.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
              {[
                { Icon: DollarSign, label: 'Budget match' },
                { Icon: MapPin, label: 'Location filter' },
                { Icon: Users, label: 'Vibe alignment' },
                { Icon: Home, label: 'Real listings' },
              ].map(({ Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <Icon className="w-5 h-5 text-violet-500" />
                  <span className="text-[11px] font-medium text-slate-600 text-center">{label}</span>
                </div>
              ))}
            </div>
            <button
              onClick={next}
              className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
            >
              Start Quiz
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── Question ──────────────────────────────────────────────────────── */}
        {step >= 1 && !isResult && current && (
          <div className="space-y-4">
            {/* Progress bar */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span>Question {step} of {QUESTIONS.length}</span>
                <span>{progress}% complete</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-violet-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              {/* Question header */}
              <div className="flex items-start gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center shrink-0 mt-0.5">
                  <current.Icon className="w-4.5 h-4.5 text-violet-600" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800 leading-snug">{current.question}</h2>
                  {current.hint && (
                    <p className="text-xs text-slate-400 mt-0.5">{current.hint}</p>
                  )}
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2">
                {current.options.map((opt) => {
                  const selected = answers[current.id] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => selectAnswer(opt.value)}
                      className={clsx(
                        'w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm text-left transition-all',
                        selected
                          ? 'bg-violet-50 border-violet-400 ring-1 ring-violet-300'
                          : 'bg-white border-slate-200 hover:border-violet-200 hover:bg-violet-50/40'
                      )}
                    >
                      <div className={clsx(
                        'w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center',
                        selected ? 'border-violet-600 bg-violet-600' : 'border-slate-300'
                      )}>
                        {selected && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={clsx('font-medium', selected ? 'text-violet-800' : 'text-slate-700')}>
                          {opt.label}
                        </span>
                        {opt.sublabel && (
                          <span className={clsx('block text-xs mt-0.5', selected ? 'text-violet-500' : 'text-slate-400')}>
                            {opt.sublabel}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="flex gap-2 mt-5">
                {step > 1 && (
                  <button
                    onClick={() => setStep((s) => s - 1)}
                    className="flex items-center gap-1 px-4 py-2 border border-slate-200 rounded-xl text-xs text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Back
                  </button>
                )}
                <button
                  onClick={next}
                  disabled={!answers[current.id]}
                  className="ml-auto flex items-center gap-1.5 px-5 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-xs transition-colors"
                >
                  {step === QUESTIONS.length ? 'See My Result' : 'Next'}
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Result ────────────────────────────────────────────────────────── */}
        {isResult && profile && dims && (
          <div className="space-y-5">

            {/* Profile card */}
            <div className={`bg-white border-2 ${profile.ringColor} rounded-2xl p-6 shadow-sm`}>
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-14 h-14 rounded-2xl ${profile.iconBg} flex items-center justify-center shrink-0`}>
                  <profile.Icon className={`w-7 h-7 ${profile.iconColor}`} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Your type</p>
                  <h2 className={`text-2xl font-bold ${profile.iconColor}`}>{profile.name}</h2>
                  <p className="text-sm text-slate-500 italic">{profile.tagline}</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{profile.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-4">
                {profile.traits.map((t) => (
                  <span key={t} className={`px-2.5 py-1 rounded-full text-xs font-semibold ${profile.iconBg} ${profile.iconColor}`}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Trait breakdown */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-4 h-4 text-slate-500" />
                <h3 className="text-sm font-bold text-slate-700">Your lifestyle profile</h3>
              </div>
              <div className="space-y-3.5">
                {TRAIT_BARS.map(({ key, label, low, high, color }) => {
                  const raw = dims[key];
                  const pct = Math.min(100, Math.round((raw / DIM_MAX[key]) * 100));
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-slate-600">{label}</span>
                        <span className="text-[10px] text-slate-400">{low} ↔ {high}</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${color} rounded-full transition-all duration-700`}
                          style={{ width: `${Math.max(pct, 4)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Look for / Watch out */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white border border-teal-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <h3 className="text-xs font-bold text-teal-700 uppercase tracking-widest">Look for housemates who are...</h3>
                </div>
                <ul className="space-y-2">
                  {profile.lookFor.map(({ icon: Icon, text }, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <Icon className="w-3.5 h-3.5 text-teal-500 mt-0.5 shrink-0" />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white border border-rose-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  <h3 className="text-xs font-bold text-rose-600 uppercase tracking-widest">Watch out for...</h3>
                </div>
                <ul className="space-y-2">
                  {profile.watchOut.map(({ icon: Icon, text }, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <Icon className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 bg-violet-50 border border-violet-100 rounded-2xl px-4 py-3">
              <p className="text-xs text-violet-700 font-medium">Share your result with future housemates</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyResult}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={reset}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-white transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Retake
                </button>
              </div>
            </div>

            {/* Matched listings */}
            <div className="pt-2">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-lg font-bold text-slate-900">
                  {matched.length > 0 ? 'Listings that match your answers' : 'No exact matches found'}
                </h3>
                {matched.length > 0 && (
                  <span className="px-2.5 py-1 bg-teal-600 text-white text-xs font-bold rounded-full">
                    {matched.length}
                  </span>
                )}
              </div>

              {matched.length > 0 ? (
                <>
                  <p className="text-xs text-slate-400 mb-4">
                    Sorted by compatibility based on your noise, guest and lifestyle preferences.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {matched.slice(0, 6).map((l) => (
                      <ListingCard key={l.id} listing={l} />
                    ))}
                  </div>
                  {matched.length > 6 && (
                    <div className="text-center mt-5">
                      <Link
                        href="/listings"
                        className="inline-flex items-center gap-1.5 text-sm text-violet-600 hover:text-violet-800 font-semibold transition-colors"
                      >
                        View all {matched.length} matching listings
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center mx-auto mb-3">
                    <Home className="w-5 h-5 text-slate-400" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700 mb-1">No listings match all your criteria right now</p>
                  <p className="text-xs text-slate-400 mb-4">
                    Try broadening your budget, location or room type preferences, or browse all listings below.
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <Link href="/listings" className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition-colors">
                      Browse all listings
                    </Link>
                    <button onClick={reset} className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg hover:bg-white transition-colors">
                      Adjust answers
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </main>
  );
}
