import Link from 'next/link';
import { Mail, MessageCircle, Flag, Megaphone, Clock, ArrowRight, HelpCircle, Home } from 'lucide-react';

const channels = [
  {
    icon: MessageCircle,
    title: 'General enquiries',
    desc: 'Questions about FlatmateFind, feedback, or anything else on your mind.',
    email: 'hello@flatmatefind.com',
    cta: 'Say hello',
    color: 'teal',
  },
  {
    icon: Flag,
    title: 'Report a listing or scam',
    desc: 'Spotted a suspicious or fraudulent listing? Let us know and we\'ll act quickly.',
    email: 'support@flatmatefind.com',
    cta: 'Report now',
    color: 'rose',
  },
  {
    icon: Megaphone,
    title: 'Advertising & partnerships',
    desc: 'Interested in reaching our growing community of renters and subletters?',
    email: 'ads@flatmatefind.com',
    cta: 'Partner with us',
    color: 'violet',
  },
];

const colorMap: Record<string, { bg: string; icon: string; border: string; btn: string; btnHover: string }> = {
  teal:   { bg: 'bg-teal-50',   icon: 'text-teal-600',   border: 'border-teal-100',   btn: 'bg-teal-600',   btnHover: 'hover:bg-teal-700' },
  rose:   { bg: 'bg-rose-50',   icon: 'text-rose-500',   border: 'border-rose-100',   btn: 'bg-rose-500',   btnHover: 'hover:bg-rose-600' },
  violet: { bg: 'bg-violet-50', icon: 'text-violet-600', border: 'border-violet-100', btn: 'bg-violet-600', btnHover: 'hover:bg-violet-700' },
};

const faqs = [
  {
    q: 'How quickly will you respond?',
    a: 'We aim to reply within 1–2 business days. Scam reports are prioritised and usually handled within a few hours.',
  },
  {
    q: 'I can\'t log into my account — what do I do?',
    a: 'Email support@flatmatefind.com with your registered email address and we\'ll get you back in.',
  },
  {
    q: 'Can I request a listing be removed?',
    a: 'Yes. Email support with the listing link and reason. We review all removal requests within 24 hours.',
  },
  {
    q: 'Do you offer phone support?',
    a: 'We\'re currently email-only, which lets us keep FlatmateFind free. We try to make every email count.',
  },
];

export default function ContactPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 mb-5">
            <div className="bg-white/10 p-2 rounded-xl">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-300 uppercase tracking-widest">Contact us</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
            We&apos;d love to<br className="hidden sm:block" /> hear from you
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-lg mx-auto">
            Whether you have a question, found a scam listing, or want to work with us — we&apos;re just an email away.
          </p>
          <div className="flex items-center justify-center gap-2 mt-6 text-sm text-slate-400">
            <Clock className="w-4 h-4 text-teal-400" />
            Typical response time: 1–2 business days
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Contact cards */}
        <section className="mb-16">
          <div className="grid grid-cols-1 gap-5">
            {channels.map((c) => {
              const col = colorMap[c.color];
              return (
                <a
                  key={c.title}
                  href={`mailto:${c.email}`}
                  className={`group flex items-start sm:items-center gap-5 p-6 rounded-2xl border ${col.bg} ${col.border} hover:shadow-md transition-all`}
                >
                  <div className={`p-3 bg-white rounded-xl shadow-sm shrink-0`}>
                    <c.icon className={`w-6 h-6 ${col.icon}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 text-base mb-0.5">{c.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed mb-2">{c.desc}</p>
                    <p className="text-sm font-medium text-slate-700">{c.email}</p>
                  </div>
                  <div className={`hidden sm:flex items-center gap-1.5 shrink-0 text-white text-sm font-semibold px-4 py-2 rounded-lg ${col.btn} ${col.btnHover} transition-colors`}>
                    {c.cta}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* FAQs */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-0.5 bg-teal-500 rounded-full" />
            <span className="text-xs font-semibold text-teal-600 uppercase tracking-widest">Common questions</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Before you write</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900 mb-1.5">{faq.q}</p>
                    <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-500 mt-4">
            More answers in our{' '}
            <Link href="/faq" className="text-teal-600 hover:underline font-medium">
              FAQ page →
            </Link>
          </p>
        </section>

        {/* Back to site */}
        <div className="text-center border-t border-slate-100 pt-10">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-teal-600 text-sm font-medium transition-colors">
            <Home className="w-4 h-4" />
            Back to FlatmateFind
          </Link>
        </div>
      </div>
    </div>
  );
}
