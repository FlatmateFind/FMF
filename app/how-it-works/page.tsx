import Link from 'next/link';
import {
  Search, UserCircle, MessageCircle, CheckCircle,
  PlusCircle, Users, Eye, Star,
  Briefcase, FileText, Mail, Repeat,
  LayoutGrid, TrendingUp, DollarSign, ArrowRight,
} from 'lucide-react';

interface Step {
  icon: React.ElementType;
  title: string;
  description: string;
}

interface Section {
  id: string;
  audience: string;
  heading: string;
  tagline: string;
  color: string;
  iconBg: string;
  cta: { label: string; href: string };
  steps: Step[];
}

const SECTIONS: Section[] = [
  {
    id: 'renters',
    audience: 'For Renters',
    heading: 'How to find a room with FlatmateFind',
    tagline: 'Browse hundreds of listings, filter for your lifestyle, and contact the host directly — all for free.',
    color: 'border-teal-500',
    iconBg: 'bg-teal-50 text-teal-600',
    cta: { label: 'Browse listings', href: '/listings' },
    steps: [
      {
        icon: UserCircle,
        title: 'Create your renter profile',
        description: 'Sign up and build a profile with your budget, preferred locations, lifestyle preferences, and stay type. Hosts can find you too.',
      },
      {
        icon: Search,
        title: 'Search and filter listings',
        description: 'Filter by state, city, price, inclusions (bills, WiFi), furnished status, gender preference, pets, and availability date. Sort by newest or price.',
      },
      {
        icon: Star,
        title: 'Save and compare rooms',
        description: 'Heart listings you like, compare up to three side-by-side, and build a shortlist before reaching out.',
      },
      {
        icon: MessageCircle,
        title: 'Message the host directly',
        description: 'No middleman. Contact the owner or current tenant directly from the listing page and arrange a viewing or move-in date.',
      },
    ],
  },
  {
    id: 'subletters',
    audience: 'For Subletters',
    heading: 'How to list your room or property',
    tagline: 'Post your listing in minutes, reach thousands of renters across Australia, and find the right tenant — free.',
    color: 'border-violet-500',
    iconBg: 'bg-violet-50 text-violet-600',
    cta: { label: 'Post a listing', href: '/post' },
    steps: [
      {
        icon: PlusCircle,
        title: 'Post your listing',
        description: 'Fill in your property details — room type, rent, inclusions, house rules, nearby places, and tenant preferences. Takes under 5 minutes.',
      },
      {
        icon: Eye,
        title: 'Renters discover your listing',
        description: 'Your listing appears in search results immediately. Featured and well-described listings get significantly more views.',
      },
      {
        icon: Users,
        title: 'Browse renter profiles',
        description: 'Flip to the Find Renters page to proactively search renter profiles by budget, city, nationality, and lifestyle preferences.',
      },
      {
        icon: CheckCircle,
        title: 'Choose your tenant',
        description: 'Receive messages directly, shortlist candidates, and arrange inspections. Mark your listing as taken once filled.',
      },
    ],
  },
  {
    id: 'jobs',
    audience: 'For Job Posts',
    heading: 'How to post and find jobs',
    tagline: 'Whether you need casual work or are hiring for your property, the jobs board connects renters and employers in one place.',
    color: 'border-amber-500',
    iconBg: 'bg-amber-50 text-amber-600',
    cta: { label: 'Browse jobs', href: '/jobs' },
    steps: [
      {
        icon: Briefcase,
        title: 'Browse available jobs',
        description: 'Search jobs by type — full-time, part-time, casual, contract, remote or internship. Jobs are shown near your listing location automatically.',
      },
      {
        icon: FileText,
        title: 'Post a job for free',
        description: 'Hiring? Sign in, go to the Jobs Board and fill in the role details, salary range, and contact info. Goes live instantly.',
      },
      {
        icon: Mail,
        title: 'Apply directly by email',
        description: 'Applicants contact you directly at the email you provide — no third-party application portal, no delays.',
      },
      {
        icon: Repeat,
        title: 'Manage your posts',
        description: 'Edit, close or repost your job from your dashboard. Max 2 active posts per account to keep the board clean and relevant.',
      },
    ],
  },
  {
    id: 'ads',
    audience: 'For Advertisers',
    heading: 'How advertising on FlatmateFind works',
    tagline: 'Reach an engaged, highly targeted audience of people actively looking for housing, work, and services in Australia.',
    color: 'border-rose-500',
    iconBg: 'bg-rose-50 text-rose-600',
    cta: { label: 'Contact us', href: '/about#contact' },
    steps: [
      {
        icon: LayoutGrid,
        title: 'Choose your ad placement',
        description: 'Ad slots are available across the homepage (leaderboard), listing browse grid (inline), listing detail sidebar (rectangle), and jobs page sidebar.',
      },
      {
        icon: TrendingUp,
        title: 'Reach the right audience',
        description: 'Our users are renters, international students, working holiday visa holders, and property investors actively browsing accommodation in Australia.',
      },
      {
        icon: DollarSign,
        title: 'Flexible and affordable',
        description: 'Ad placements are sold directly — no auction, no minimum spend. Contact us to discuss pricing and available slots.',
      },
      {
        icon: CheckCircle,
        title: 'Get in touch',
        description: 'Email us with your campaign goals, target audience, and preferred placement. We will confirm availability and send a rate card.',
      },
    ],
  },
];

export default function HowItWorksPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      {/* Page header */}
      <div className="text-center mb-14">
        <span className="text-xs font-semibold tracking-widest text-teal-600 uppercase">Guide</span>
        <h1 className="text-4xl font-extrabold text-slate-900 mt-2 mb-3">How FlatmateFind Works</h1>
        <p className="text-slate-500 text-base max-w-xl mx-auto">
          Everything you need to know — whether you are renting, listing, hiring, or advertising.
        </p>
        {/* Jump links */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="px-4 py-1.5 rounded-full text-sm font-medium border border-slate-200 text-slate-600 hover:border-teal-400 hover:text-teal-600 transition-colors bg-white"
            >
              {s.audience}
            </a>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-16">
        {SECTIONS.map((section, si) => (
          <div key={section.id} id={section.id} className={`border-l-4 ${section.color} pl-6`}>
            <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase">{section.audience}</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1 mb-2">{section.heading}</h2>
            <p className="text-slate-500 text-sm mb-8 max-w-2xl">{section.tagline}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
              {section.steps.map((step, i) => (
                <div key={step.title} className="bg-white rounded-xl border border-slate-200 p-5 flex gap-4">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${section.iconBg}`}>
                    <step.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-[11px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                      <h3 className="font-semibold text-slate-900 text-sm">{step.title}</h3>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href={section.cta.href}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              {section.cta.label}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
