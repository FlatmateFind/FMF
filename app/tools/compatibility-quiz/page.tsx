'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, RotateCcw, Share2, Check } from 'lucide-react';
import clsx from 'clsx';

// ─── Quiz data ────────────────────────────────────────────────────────────────

const QUESTIONS = [
  {
    id: 'sleep',
    question: 'What time do you usually go to sleep?',
    emoji: '🌙',
    options: [
      { label: 'Before 10 PM',     value: 'early',     dim: { schedule: 0, noise: 0 } },
      { label: '10 PM – midnight', value: 'normal',    dim: { schedule: 1, noise: 1 } },
      { label: 'Midnight – 2 AM',  value: 'late',      dim: { schedule: 2, noise: 2 } },
      { label: 'After 2 AM',       value: 'very-late', dim: { schedule: 3, noise: 3 } },
    ],
  },
  {
    id: 'clean',
    question: 'How do you keep shared spaces?',
    emoji: '🧹',
    options: [
      { label: 'Spotless at all times',    value: 'very-clean', dim: { cleanliness: 3 } },
      { label: 'Clean up same day',        value: 'clean',      dim: { cleanliness: 2 } },
      { label: 'Clean up within a week',   value: 'casual',     dim: { cleanliness: 1 } },
      { label: 'Relaxed about it',         value: 'messy',      dim: { cleanliness: 0 } },
    ],
  },
  {
    id: 'guests',
    question: 'How often do you have guests over?',
    emoji: '🚪',
    options: [
      { label: 'Almost every day',     value: 'very-often',  dim: { social: 3, noise: 3 } },
      { label: 'A few times a week',   value: 'often',       dim: { social: 2, noise: 2 } },
      { label: 'A couple times/month', value: 'sometimes',   dim: { social: 1, noise: 1 } },
      { label: 'Rarely or never',      value: 'rarely',      dim: { social: 0, noise: 0 } },
    ],
  },
  {
    id: 'noise',
    question: 'What\'s your relationship with noise at home?',
    emoji: '🔊',
    options: [
      { label: 'I prefer total quiet',          value: 'silent',  dim: { noise: 0 } },
      { label: 'Light background noise is fine', value: 'low',    dim: { noise: 1 } },
      { label: 'Music / TV on is the norm',     value: 'medium',  dim: { noise: 2 } },
      { label: 'I like it lively',              value: 'loud',    dim: { noise: 3 } },
    ],
  },
  {
    id: 'cooking',
    question: 'How much do you cook at home?',
    emoji: '🍳',
    options: [
      { label: 'Every day — I love cooking',  value: 'daily',     dim: { cooking: 3 } },
      { label: 'A few times a week',          value: 'often',     dim: { cooking: 2 } },
      { label: 'Occasionally',               value: 'sometimes', dim: { cooking: 1 } },
      { label: 'Mostly takeaway/delivery',   value: 'rarely',    dim: { cooking: 0 } },
    ],
  },
  {
    id: 'schedule',
    question: 'What is your typical daily schedule?',
    emoji: '📅',
    options: [
      { label: 'Regular 9–5 (office)',     value: 'office',   dim: { schedule: 1 } },
      { label: 'Work/study from home',     value: 'wfh',      dim: { schedule: 2, noise: 0 } },
      { label: 'Shift work / irregular',   value: 'shift',    dim: { schedule: 3 } },
      { label: 'Student schedule',         value: 'student',  dim: { schedule: 1, social: 2 } },
    ],
  },
  {
    id: 'pets',
    question: 'How do you feel about pets in the house?',
    emoji: '🐾',
    options: [
      { label: 'Love them — I have one',         value: 'have-pet',  dim: { petFriendly: 3 } },
      { label: 'Love them, don\'t have one',     value: 'love-pets', dim: { petFriendly: 2 } },
      { label: 'Fine with it',                   value: 'neutral',   dim: { petFriendly: 1 } },
      { label: 'Prefer no pets (allergy/choice)', value: 'no-pets',  dim: { petFriendly: 0 } },
    ],
  },
  {
    id: 'smoking',
    question: 'What is your stance on smoking?',
    emoji: '🚬',
    options: [
      { label: 'I smoke (inside ok)',         value: 'smoke-inside',  dim: { smokeFriendly: 3 } },
      { label: 'I smoke (outside only)',      value: 'smoke-outside', dim: { smokeFriendly: 2 } },
      { label: 'Non-smoker, fine outside',    value: 'ok-outside',    dim: { smokeFriendly: 1 } },
      { label: 'Prefer completely smoke-free', value: 'no-smoke',     dim: { smokeFriendly: 0 } },
    ],
  },
  {
    id: 'social',
    question: 'How do you like to interact with housemates?',
    emoji: '🤝',
    options: [
      { label: 'Love hanging out in common areas', value: 'very-social', dim: { social: 3 } },
      { label: 'Friendly but respect each other',  value: 'social',      dim: { social: 2 } },
      { label: 'Mostly keep to myself',            value: 'private',     dim: { social: 1 } },
      { label: 'Strictly housemates only',         value: 'very-private', dim: { social: 0 } },
    ],
  },
  {
    id: 'budget',
    question: 'What is your weekly rent budget?',
    emoji: '💰',
    options: [
      { label: 'Under $200 / week',   value: 'low',    dim: { budget: 0 } },
      { label: '$200 – $350 / week',  value: 'mid',    dim: { budget: 1 } },
      { label: '$350 – $500 / week',  value: 'high',   dim: { budget: 2 } },
      { label: '$500+ / week',        value: 'luxury', dim: { budget: 3 } },
    ],
  },
];

// ─── Result types ─────────────────────────────────────────────────────────────

type ProfileType = {
  name: string;
  emoji: string;
  color: string;
  bg: string;
  tagline: string;
  description: string;
  lookFor: string[];
  watchOut: string[];
};

const PROFILE_TYPES: Record<string, ProfileType> = {
  'The Night Owl': {
    name: 'The Night Owl',
    emoji: '🦉',
    color: 'text-violet-700',
    bg: 'bg-violet-50 border-violet-200',
    tagline: 'Alive after midnight, asleep by noon.',
    description: 'You\'re a creature of the night — whether that\'s late-night gaming, study sessions, or socialising. You thrive when the world is quiet but you\'re still buzzing.',
    lookFor: ['Fellow night owls or shift workers', 'Housemates who won\'t complain about late-night noise', 'People with a relaxed schedule'],
    watchOut: ['Early risers who need silence by 9 PM', 'People with strict "quiet hours" rules', 'Light sleepers'],
  },
  'The Clean Freak': {
    name: 'The Clean Freak',
    emoji: '✨',
    color: 'text-teal-700',
    bg: 'bg-teal-50 border-teal-200',
    tagline: 'A clean house is a happy house.',
    description: 'You keep shared spaces spotless and believe everyone should pull their weight. You\'re organised, tidy, and proud of it — the house always looks ready for guests.',
    lookFor: ['People who clean up after themselves', 'Housemates who value a shared cleaning roster', 'Organised, responsible people'],
    watchOut: ['Self-described "messy but fine" types', 'People who leave dishes overnight', 'Those who don\'t notice clutter'],
  },
  'The Social Butterfly': {
    name: 'The Social Butterfly',
    emoji: '🦋',
    color: 'text-pink-700',
    bg: 'bg-pink-50 border-pink-200',
    tagline: 'The more the merrier.',
    description: 'Your place is always buzzing. You love having people over, sharing meals, and turning the living room into a party spot. You make any house feel like a home.',
    lookFor: ['Social, outgoing housemates', 'People who enjoy communal meals', 'Those who don\'t mind a lively household'],
    watchOut: ['Introverts who need quiet evenings', 'People who dislike unannounced guests', 'Those who work from home and need quiet'],
  },
  'The Homebody': {
    name: 'The Homebody',
    emoji: '🏠',
    color: 'text-amber-700',
    bg: 'bg-amber-50 border-amber-200',
    tagline: 'Home is my happy place.',
    description: 'You love being home — cooking meals, watching shows, relaxing. You\'re content, easy to live with, and find joy in the small things. Home truly is where the heart is.',
    lookFor: ['Low-key, chill housemates', 'People who appreciate a peaceful home', 'Those who enjoy shared dinners occasionally'],
    watchOut: ['Very social types who constantly have guests', 'Night owls with late-night habits', 'People who are rarely home (hard to coordinate cleaning)'],
  },
  'The Quiet Professional': {
    name: 'The Quiet Professional',
    emoji: '💼',
    color: 'text-slate-700',
    bg: 'bg-slate-50 border-slate-200',
    tagline: 'Respectful, reliable, low-drama.',
    description: 'You work hard, keep to yourself, and just need a peaceful place to recharge. You\'re considerate about noise, tidy, and a dream to live with — just don\'t expect a party.',
    lookFor: ['Other professionals or students', 'Respectful, independent housemates', 'People who value quiet evenings'],
    watchOut: ['Party-lovers or frequent entertainers', 'Messy or disorganised types', 'People with very irregular schedules'],
  },
  'The Free Spirit': {
    name: 'The Free Spirit',
    emoji: '🌊',
    color: 'text-blue-700',
    bg: 'bg-blue-50 border-blue-200',
    tagline: 'Go with the flow.',
    description: 'Rules are more like suggestions. You\'re spontaneous, relaxed about cleaning rosters, and easy-going about everything. Your vibe is contagious — but you need the right match.',
    lookFor: ['Laid-back, flexible housemates', 'People who communicate openly rather than passively', 'Those who match your spontaneous energy'],
    watchOut: ['Very structured or Type-A people', 'Anyone with strict cleaning expectations', 'People who need everything planned in advance'],
  },
};

function getProfile(answers: Record<string, string>): ProfileType {
  let score = { social: 0, noise: 0, schedule: 0, cleanliness: 0 };

  for (const q of QUESTIONS) {
    const chosen = q.options.find((o) => o.value === answers[q.id]);
    if (chosen) {
      for (const [k, v] of Object.entries(chosen.dim)) {
        score[k as keyof typeof score] = (score[k as keyof typeof score] || 0) + (v as number);
      }
    }
  }

  if (score.schedule >= 6) return PROFILE_TYPES['The Night Owl'];
  if (score.cleanliness >= 7) return PROFILE_TYPES['The Clean Freak'];
  if (score.social >= 7) return PROFILE_TYPES['The Social Butterfly'];
  if (score.noise <= 2 && score.social <= 2) return PROFILE_TYPES['The Quiet Professional'];
  if (score.social >= 4 && score.noise <= 3) return PROFILE_TYPES['The Homebody'];
  return PROFILE_TYPES['The Free Spirit'];
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CompatibilityQuizPage() {
  const [step, setStep] = useState(0); // 0 = intro, 1-10 = questions, 11 = result
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const current = QUESTIONS[step - 1];
  const isResult = step > QUESTIONS.length;
  const progress = step === 0 ? 0 : Math.round((step / QUESTIONS.length) * 100);
  const profile = isResult ? getProfile(answers) : null;

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
    await navigator.clipboard.writeText(`I'm "${profile.name}" ${profile.emoji} — ${profile.tagline}\nFind your flatmate type: https://flatmatefind.vercel.app/tools/compatibility-quiz`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-violet-50/60 to-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-violet-600 to-purple-800 text-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          <Link href="/tools" className="flex items-center gap-1.5 text-violet-300 hover:text-white text-xs mb-4 transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" /> Back to Tools
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">Flatmate Compatibility Quiz</h1>
          <p className="text-violet-200 text-sm">10 questions to discover your flatmate personality and who you'd live best with.</p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 sm:px-6 py-8">

        {/* Intro */}
        {step === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center">
            <div className="text-5xl mb-4">🏠</div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">What kind of housemate are you?</h2>
            <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
              Answer 10 quick questions about your lifestyle and we'll reveal your flatmate personality type — plus tips on who to look for.
            </p>
            <button onClick={next}
              className="px-8 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-2xl transition-colors text-sm">
              Start Quiz →
            </button>
          </div>
        )}

        {/* Question */}
        {step >= 1 && !isResult && current && (
          <div className="space-y-4">
            {/* Progress */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span>Question {step} of {QUESTIONS.length}</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-violet-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="text-3xl mb-3">{current.emoji}</div>
              <h2 className="text-base font-bold text-slate-800 mb-4">{current.question}</h2>

              <div className="space-y-2">
                {current.options.map((opt) => {
                  const selected = answers[current.id] === opt.value;
                  return (
                    <button key={opt.value} onClick={() => selectAnswer(opt.value)}
                      className={clsx(
                        'w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all',
                        selected
                          ? 'bg-violet-50 border-violet-400 text-violet-800 ring-1 ring-violet-300'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-violet-200 hover:bg-violet-50/40'
                      )}>
                      <div className={clsx(
                        'w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center',
                        selected ? 'border-violet-600 bg-violet-600' : 'border-slate-300'
                      )}>
                        {selected && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2 mt-5">
                {step > 1 && (
                  <button onClick={() => setStep((s) => s - 1)}
                    className="flex items-center gap-1 px-4 py-2 border border-slate-200 rounded-xl text-xs text-slate-600 hover:bg-slate-50 transition-colors">
                    <ChevronLeft className="w-3.5 h-3.5" /> Back
                  </button>
                )}
                <button
                  onClick={next}
                  disabled={!answers[current.id]}
                  className="ml-auto flex items-center gap-1 px-5 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-xs transition-colors">
                  {step === QUESTIONS.length ? 'See My Result' : 'Next'}
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Result */}
        {isResult && profile && (
          <div className="space-y-4">
            <div className={`border rounded-2xl p-6 shadow-sm ${profile.bg}`}>
              <div className="text-center mb-4">
                <div className="text-5xl mb-2">{profile.emoji}</div>
                <h2 className={`text-2xl font-bold mb-1 ${profile.color}`}>{profile.name}</h2>
                <p className="text-sm text-slate-500 italic">"{profile.tagline}"</p>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed text-center">{profile.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white border border-teal-100 rounded-2xl p-4 shadow-sm">
                <h3 className="text-xs font-bold text-teal-700 uppercase tracking-widest mb-3">✅ Look for housemates who are...</h3>
                <ul className="space-y-1.5">
                  {profile.lookFor.map((t, i) => (
                    <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                      <span className="text-teal-500 mt-0.5">•</span>{t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white border border-rose-100 rounded-2xl p-4 shadow-sm">
                <h3 className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-3">⚠️ Watch out for...</h3>
                <ul className="space-y-1.5">
                  {profile.watchOut.map((t, i) => (
                    <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                      <span className="text-rose-400 mt-0.5">•</span>{t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-center">
              <p className="text-xs text-indigo-700 font-medium mb-3">Share your result with future housemates!</p>
              <div className="flex items-center justify-center gap-3">
                <button onClick={copyResult}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-colors">
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy Result'}
                </button>
                <button onClick={reset}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl hover:bg-white transition-colors">
                  <RotateCcw className="w-3.5 h-3.5" /> Retake Quiz
                </button>
              </div>
            </div>

            <div className="text-center">
              <Link href="/listings" className="text-xs text-violet-600 hover:text-violet-800 font-medium transition-colors">
                Browse listings and find your match →
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
