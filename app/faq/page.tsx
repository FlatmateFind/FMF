'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronDown, Search, PlusCircle, Briefcase, LayoutDashboard, HelpCircle,
} from 'lucide-react';

const FAQ_SECTIONS = [
  {
    id: 'renter',
    label: 'For Renters',
    icon: Search,
    activeBg: 'bg-teal-600',
    items: [
      { q: 'Is FlatmateFind free to use?', a: 'Yes — browsing, saving listings, and contacting hosts is completely free. We never charge renters a fee, a subscription, or a "contact unlock" fee.' },
      { q: 'Do I need an account to browse listings?', a: 'No — anyone can browse and view listing details without signing up. You only need an account to save listings, message hosts, or create a renter profile.' },
      { q: 'How do I find listings that welcome my nationality?', a: 'Use the "My Nationality" filter on the listings page. It shows listings where the host has indicated they welcome your background, plus all listings with no preference set.' },
      { q: 'How do I filter by short-term or long-term stays?', a: 'On the listings page, look for the stay type badge (Short term / Long term / Both) shown on each card. You can also set your own preferred stay type on your renter profile so hosts can find you.' },
      { q: 'How do I save a listing?', a: 'Click the heart icon on any listing card or detail page. You must be signed in as a renter. View all saved listings in your Dashboard under "Saved".' },
      { q: 'What is the Compare feature?', a: 'Select up to 3 listings using the compare toggle on each card, then view them side-by-side to compare rent, inclusions, location, and features. The compare bar appears at the bottom of the screen.' },
      { q: 'How do I contact a host?', a: 'Open any listing and click "Message Host". A chat window opens. You need to be signed in to send messages. The host will receive your message and can reply directly.' },
      { q: 'What does "Nearby Jobs" mean on a listing?', a: 'Each listing detail page shows jobs posted near the same suburb or city. This helps you find work close to where you plan to live — useful if you are new to the area.' },
      { q: 'Can I create a renter profile so hosts find me?', a: 'Yes. Go to My Profile and fill in your budget, preferred locations, lifestyle, and stay type. Your profile appears in the Find Renters section visible to subletters.' },
      { q: 'Are the listings verified?', a: 'Hosts with a green "Verified" badge have completed our basic check. We also run automated spam detection on all new posts. Always inspect a property in person before paying any money.' },
      { q: 'What should I watch out for to avoid scams?', a: 'Never transfer money before an in-person inspection. Be cautious of unusually low rent or requests to pay via wire transfer. Use the "Report listing" button on any suspicious post.' },
      { q: 'How do I report a suspicious listing?', a: 'On the listing detail page, scroll down past the contact card and click "Report this listing". Our team reviews all reports and removes posts that violate our guidelines.' },
    ],
  },
  {
    id: 'subletter',
    label: 'For Subletters',
    icon: PlusCircle,
    activeBg: 'bg-amber-500',
    items: [
      { q: 'How do I post a listing?', a: 'Sign up or sign in as a Subletter, then click "Post a Listing" in the header or dashboard. Fill in the property details across all sections and submit. Your listing goes live immediately.' },
      { q: 'How much does it cost to list?', a: 'Posting a listing is completely free. We do not charge commissions, listing fees, or featured placement fees.' },
      { q: 'What information should I include in my listing?', a: 'The more detail, the better. Include rent, inclusions (bills, WiFi), house rules, nearby places (station, supermarket, uni), room features, and your preferred tenant profile. Listings with photos and complete details get significantly more enquiries.' },
      { q: 'Can I add house rules to my listing?', a: 'Yes. The post form includes a House Rules section with common options (no smoking, quiet hours, no pets, etc.). You can select as many as apply to your property.' },
      { q: 'How do I add nearby places like the train station or supermarket?', a: 'In the Nearby Places section of the post form, enter the walking or driving time to each relevant place type. These appear as icons on your listing detail page to help renters assess the location.' },
      { q: 'Can I pause or remove my listing?', a: 'Yes. Go to your Dashboard, find the listing, and click Pause to temporarily hide it or the remove button to delete it permanently.' },
      { q: 'How do I mark a room as taken?', a: 'In your Dashboard, click "Mark as Taken" on the listing. It will be flagged as taken and removed from active search results so renters do not waste time enquiring.' },
      { q: 'What is the Shortlist renter feature?', a: 'When chatting with a renter, switch to Host View inside the chat window and tap "Shortlist renter" to save that enquiry. Review all shortlisted renters in your Dashboard.' },
      { q: 'Can I specify preferred tenants?', a: 'Yes — nationality preference, gender, pets policy, and smoking policy are all configurable when posting. You can also set a preferred stay type (short term, long term, or both).' },
      { q: 'How many listings can I have active at once?', a: 'Currently up to 5 active listings per account. This limit helps keep the board relevant and reduce spam.' },
    ],
  },
  {
    id: 'jobs',
    label: 'Jobs Board',
    icon: Briefcase,
    activeBg: 'bg-blue-600',
    items: [
      { q: 'Who is the jobs board for?', a: 'The jobs board is for anyone in the FlatmateFind community — renters looking for casual or part-time work, and employers (property owners, local businesses) wanting to hire people who live nearby.' },
      { q: 'How do I post a job?', a: 'Sign in, go to the Jobs Board page, and click "Post a Job". Fill in the role details, pay range, job type, and your contact email. The listing goes live instantly.' },
      { q: 'Is it free to post a job?', a: 'Yes. Posting a job is free. There are no charges for employers or job seekers.' },
      { q: 'How do applicants apply?', a: 'Applicants contact you directly at the email address you provide. There is no in-app application system — direct contact is faster and more personal.' },
      { q: 'Why do I see job listings on property pages?', a: 'Each listing detail page shows nearby job posts from the same suburb or city under "Jobs in this area". This helps renters find work close to where they plan to live.' },
      { q: 'How do I close a job once it is filled?', a: 'Go to your Dashboard, find the job post, and click "Mark as Filled". It will be removed from active results and show a "Position Filled" status.' },
    ],
  },
  {
    id: 'platform',
    label: 'Account & Platform',
    icon: LayoutDashboard,
    activeBg: 'bg-slate-700',
    items: [
      { q: 'What is the difference between a Renter and a Subletter account?', a: 'Renters are looking for a room. They can browse listings, save favourites, create a renter profile, and message hosts. Subletters have a room or property to fill. They can post listings, browse renter profiles, and manage enquiries.' },
      { q: 'Can I have both a renter and subletter account?', a: 'Currently each account is one type. If you need to switch roles, contact us and we can update your account type.' },
      { q: 'How does the sort feature work on listings?', a: 'Above the listings grid, use the sort dropdown to order results by: Newest first, Oldest first, Price (low to high), Price (high to low), Available soonest, or Available latest.' },
      { q: 'What is the Facebook Communities page?', a: 'The Communities page lists curated Australian Facebook groups for housing — organised by state and category (general, students, expats, subletters). A great way to find community support alongside your FlatmateFind search.' },
      { q: 'How do I advertise on FlatmateFind?', a: 'Ad placements are available across the homepage, listings grid, listing detail sidebar, and jobs page. Contact us via the About page to discuss pricing and availability.' },
      { q: 'Is my data private?', a: 'We take privacy seriously. Your profile and messages are only visible to logged-in users. We do not sell personal data to third parties. See our Privacy Policy for full details.' },
    ],
  },
];

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between gap-4 w-full px-5 py-4 text-left font-medium text-slate-800 hover:text-teal-700 transition-colors"
      >
        <span className="text-sm">{q}</span>
        <ChevronDown className={`w-4 h-4 shrink-0 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
          {a}
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [activeId, setActiveId] = useState('renter');
  const section = FAQ_SECTIONS.find((s) => s.id === activeId)!;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-teal-100 flex items-center justify-center shrink-0">
          <HelpCircle className="w-5 h-5 text-teal-600" />
        </div>
        <div>
          <p className="text-xs font-semibold text-teal-600 uppercase tracking-widest">Support</p>
          <h1 className="text-2xl font-bold text-slate-900 leading-tight">FAQ</h1>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {FAQ_SECTIONS.map((s) => {
          const active = s.id === activeId;
          return (
            <button
              key={s.id}
              onClick={() => setActiveId(s.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                active
                  ? `${s.activeBg} text-white border-transparent shadow-sm`
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <s.icon className="w-3 h-3" />
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Questions */}
      <div key={activeId} className="space-y-2.5 mb-8">
        {section.items.map((item) => (
          <AccordionItem key={item.q} q={item.q} a={item.a} />
        ))}
      </div>

      {/* Still need help */}
      <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-9 h-9 rounded-xl bg-teal-100 flex items-center justify-center shrink-0">
          <HelpCircle className="w-4 h-4 text-teal-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-teal-900 mb-0.5">Still have a question?</p>
          <p className="text-xs text-teal-700">We are happy to help — reach out via the contact page.</p>
        </div>
        <Link
          href="/contact"
          className="text-xs font-semibold px-4 py-2 rounded-xl bg-teal-600 text-white hover:bg-teal-700 transition-colors shrink-0"
        >
          Contact Us
        </Link>
      </div>

    </div>
  );
}
