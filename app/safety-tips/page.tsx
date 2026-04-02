import Link from 'next/link';
import {
  ShieldCheck, AlertTriangle, Eye, FileText,
  DollarSign, MessageCircle, Home, UserCheck, Phone, Lock,
} from 'lucide-react';

const sections = [
  {
    icon: AlertTriangle,
    color: 'bg-red-50 text-red-600',
    title: 'Spot a scam listing',
    tips: [
      'Rent is suspiciously low for the area — if it seems too good to be true, it usually is.',
      'The "owner" claims to be overseas and cannot show the property in person.',
      'You are asked to pay a deposit or bond before seeing the property.',
      'Communication is only via WhatsApp or email — no phone number provided.',
      'The listing photos appear on multiple platforms with different addresses.',
      'You are pressured to decide quickly or told "many others are interested".',
      'Requests for payment via wire transfer, gift cards, or cryptocurrency.',
    ],
  },
  {
    icon: Eye,
    color: 'bg-amber-50 text-amber-600',
    title: 'Before you inspect',
    tips: [
      'Verify the listing address on Google Maps Street View before attending.',
      "Search the landlord's name and phone number online to check for complaints.",
      'Tell a friend or family member where you are going and when to expect you back.',
      'Inspect during daylight hours, ideally with a friend.',
      'Check reviews or ratings of the landlord or agency if available.',
      'Use the in-app message to confirm the inspection — avoid switching to personal contact too early.',
    ],
  },
  {
    icon: Home,
    color: 'bg-blue-50 text-blue-600',
    title: 'During the inspection',
    tips: [
      'Inspect all rooms, including bathrooms, kitchen, and common areas yourself.',
      'Test taps, hot water, heating/cooling, and power points.',
      'Look for signs of mould, dampness, or pest damage.',
      'Check window and door locks work properly.',
      'Ask who currently lives in the property and how long they have been there.',
      'Confirm what furniture and appliances are included and their condition.',
      'Clarify which bills are included and how utilities are split.',
    ],
  },
  {
    icon: FileText,
    color: 'bg-violet-50 text-violet-600',
    title: 'Before signing anything',
    tips: [
      'Read every clause of the lease or subletting agreement carefully.',
      'Confirm the bond amount and ensure it will be lodged with the state bond authority.',
      'Get all verbal agreements (pets allowed, parking, storage) in writing.',
      'Clarify the notice period required to vacate.',
      'Understand the conditions under which the landlord can enter the property.',
      'Never sign a blank or partially completed agreement.',
      'Ask for a copy of the signed agreement immediately after signing.',
    ],
  },
  {
    icon: DollarSign,
    color: 'bg-emerald-50 text-emerald-600',
    title: 'Money and payments',
    tips: [
      'Never pay a bond or advance rent before signing a written agreement.',
      'Use bank transfer (not cash) and keep all payment receipts.',
      'Confirm the bond will be lodged with your state\'s bond authority (e.g. NSW Fair Trading, RTBA in VIC).',
      'Do not pay more than 2 weeks rent in advance for a periodic (week-to-week) tenancy.',
      'Be cautious of landlords who request extra fees for "admin", "key cutting", or "credit checks".',
      'Document the condition of the property with photos and timestamps on move-in day.',
    ],
  },
  {
    icon: MessageCircle,
    color: 'bg-teal-50 text-teal-600',
    title: 'Safe communication',
    tips: [
      'Keep early communications inside the FlatmateFind platform before trusting a landlord.',
      'Do not share your home address, ID, or financial details over chat before meeting in person.',
      'Be cautious if a landlord avoids video calls or in-person meetings.',
      'If you feel unsafe during communication at any time, stop and report the listing.',
      'Legitimate landlords will never ask you to verify your identity via unusual links or forms.',
    ],
  },
  {
    icon: UserCheck,
    color: 'bg-sky-50 text-sky-600',
    title: 'Know your rights',
    tips: [
      'In Australia, renters have strong legal protections under state and territory tenancy laws.',
      'Landlords cannot enter without proper notice (usually 24–48 hours, state dependent).',
      'You are entitled to a safe and habitable property — landlords must fix urgent repairs promptly.',
      'Bonds must be lodged with the relevant state authority, not held by the landlord.',
      'You can dispute unfair bond deductions through your state\'s tenancy tribunal.',
      'Discrimination based on race, nationality, gender, or religion in renting is illegal.',
    ],
  },
  {
    icon: Phone,
    color: 'bg-orange-50 text-orange-600',
    title: 'Useful contacts',
    tips: [
      'NSW: Fair Trading — 13 32 20 | nswfairtrading.com.au',
      'VIC: Consumer Affairs Victoria — 1300 55 81 81 | consumer.vic.gov.au',
      'QLD: Residential Tenancies Authority — 1300 366 311 | rta.qld.gov.au',
      'WA: Department of Mines, Industry Regulation & Safety — 1300 30 40 54',
      'SA: Consumer and Business Services — 131 882 | cbs.sa.gov.au',
      'ACT: Access Canberra — 13 22 81 | accesscanberra.act.gov.au',
      'Scamwatch (ACCC) — scamwatch.gov.au | Report rental scams here.',
    ],
  },
];

export default function SafetyTipsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-100 rounded-xl mb-4">
          <ShieldCheck className="w-6 h-6 text-teal-600" />
        </div>
        <span className="block text-xs font-semibold tracking-widest text-teal-600 uppercase mb-2">Safety</span>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-3">Renter Safety Tips</h1>
        <p className="text-slate-500 text-sm max-w-xl mx-auto">
          Renting a room in a new city can be stressful. Use these practical tips to protect yourself, avoid scams, and rent with confidence.
        </p>
      </div>

      {/* Alert banner */}
      <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-4 mb-10">
        <Lock className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        <p className="text-sm text-red-700">
          <span className="font-semibold">Golden rule:</span> Never transfer money or pay a bond before viewing the property in person and signing a written agreement.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-10">
        {sections.map((section) => (
          <div key={section.title}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${section.color}`}>
                <section.icon className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">{section.title}</h2>
            </div>
            <ul className="space-y-2.5">
              {section.tips.map((tip) => (
                <li key={tip} className="flex items-start gap-3 text-sm text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0 mt-2" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Report CTA */}
      <div className="mt-12 bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
        <p className="text-sm font-semibold text-slate-800 mb-1">See something suspicious?</p>
        <p className="text-xs text-slate-500 mb-4">
          Use the "Report this listing" button on any listing page, or contact us directly.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/listings"
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Browse listings safely
          </Link>
          <Link
            href="/faq#renter"
            className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 text-sm font-semibold rounded-lg border border-slate-200 transition-colors"
          >
            Renter FAQ
          </Link>
        </div>
      </div>
    </div>
  );
}
