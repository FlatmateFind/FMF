import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

const faqs = {
  renter: {
    title: 'For Renters',
    id: 'renter',
    items: [
      {
        q: 'Is FlatmateFind free to use?',
        a: 'Yes — browsing, saving listings, and contacting hosts is completely free. We never charge renters a fee, a subscription, or a "contact unlock" fee.',
      },
      {
        q: 'Do I need an account to browse listings?',
        a: 'No — anyone can browse and view listing details without signing up. You only need an account to save listings, message hosts, or create a renter profile.',
      },
      {
        q: 'How do I find listings that welcome my nationality?',
        a: 'Use the "My Nationality" filter on the listings page. It shows listings where the host has indicated they welcome your background, plus all listings with no preference set.',
      },
      {
        q: 'How do I filter by short-term or long-term stays?',
        a: 'On the listings page, look for the stay type badge (Short term / Long term / Both) shown on each card. You can also set your own preferred stay type on your renter profile so hosts can find you.',
      },
      {
        q: 'How do I save a listing?',
        a: 'Click the heart icon on any listing card or detail page. You must be signed in as a renter. View all saved listings in your Dashboard under "Saved".',
      },
      {
        q: 'What is the Compare feature?',
        a: 'Select up to 3 listings using the compare toggle on each card, then view them side-by-side to compare rent, inclusions, location, and features. The compare bar appears at the bottom of the screen.',
      },
      {
        q: 'How do I contact a host?',
        a: 'Open any listing and click "Message Host". A chat window opens. You need to be signed in to send messages. The host will receive your message and can reply directly.',
      },
      {
        q: 'What does "Nearby Jobs" mean on a listing?',
        a: 'Each listing detail page shows jobs posted near the same suburb or city. This helps you find work close to where you plan to live — useful if you are new to the area.',
      },
      {
        q: 'Can I create a renter profile so hosts find me?',
        a: 'Yes. Go to My Profile and fill in your budget, preferred locations, lifestyle, and stay type. Your profile appears in the Find Renters section visible to subletters.',
      },
      {
        q: 'Are the listings verified?',
        a: 'Hosts with a green "Verified" badge have completed our basic check. We also run automated spam detection on all new posts. Always inspect a property in person before paying any money.',
      },
      {
        q: 'What should I watch out for to avoid scams?',
        a: 'Never transfer money before an in-person inspection. Be cautious of unusually low rent or requests to pay via wire transfer. Use the "Report listing" button on any suspicious post.',
      },
      {
        q: 'How do I report a suspicious listing?',
        a: 'On the listing detail page, scroll down past the contact card and click "Report this listing". Our team reviews all reports and removes posts that violate our guidelines.',
      },
    ],
  },
  subletter: {
    title: 'For Subletters / Hosts',
    id: 'subletter',
    items: [
      {
        q: 'How do I post a listing?',
        a: 'Sign up or sign in as a Subletter, then click "Post a Listing" in the header or dashboard. Fill in the property details across all sections and submit. Your listing goes live immediately.',
      },
      {
        q: 'How much does it cost to list?',
        a: 'Posting a listing is completely free. We do not charge commissions, listing fees, or featured placement fees.',
      },
      {
        q: 'What information should I include in my listing?',
        a: 'The more detail, the better. Include rent, inclusions (bills, WiFi), house rules, nearby places (station, supermarket, uni), room features, and your preferred tenant profile. Listings with photos and complete details get significantly more enquiries.',
      },
      {
        q: 'Can I add house rules to my listing?',
        a: 'Yes. The post form includes a House Rules section with common options (no smoking, quiet hours, no pets, etc.). You can select as many as apply to your property.',
      },
      {
        q: 'How do I add nearby places like the train station or supermarket?',
        a: 'In the Nearby Places section of the post form, enter the walking or driving time to each relevant place type. These appear as icons on your listing detail page to help renters assess the location.',
      },
      {
        q: 'Can I pause or remove my listing?',
        a: 'Yes. Go to your Dashboard, find the listing, and click Pause to temporarily hide it or the remove button to delete it permanently.',
      },
      {
        q: 'How do I mark a room as taken?',
        a: 'In your Dashboard, click "Mark as Taken" on the listing. It will be flagged as taken and removed from active search results so renters do not waste time enquiring.',
      },
      {
        q: 'What is the Shortlist renter feature?',
        a: 'When chatting with a renter, switch to Host View inside the chat window and tap "Shortlist renter" to save that enquiry. Review all shortlisted renters in your Dashboard.',
      },
      {
        q: 'Can I specify preferred tenants?',
        a: 'Yes — nationality preference, gender, pets policy, and smoking policy are all configurable when posting. You can also set a preferred stay type (short term, long term, or both).',
      },
      {
        q: 'How many listings can I have active at once?',
        a: 'Currently up to 5 active listings per account. This limit helps keep the board relevant and reduce spam.',
      },
    ],
  },
  jobs: {
    title: 'Jobs Board',
    id: 'jobs',
    items: [
      {
        q: 'Who is the jobs board for?',
        a: 'The jobs board is for anyone in the FlatmateFind community — renters looking for casual or part-time work, and employers (property owners, local businesses) wanting to hire people who live nearby.',
      },
      {
        q: 'How do I post a job?',
        a: 'Sign in, go to the Jobs Board page, and click "Post a Job". Fill in the role details, pay range, job type, and your contact email. The listing goes live instantly.',
      },
      {
        q: 'Is it free to post a job?',
        a: 'Yes. Posting a job is free. There are no charges for employers or job seekers.',
      },
      {
        q: 'How do applicants apply?',
        a: 'Applicants contact you directly at the email address you provide. There is no in-app application system — direct contact is faster and more personal.',
      },
      {
        q: 'Why do I see job listings on property pages?',
        a: 'Each listing detail page shows nearby job posts from the same suburb or city under "Jobs in this area". This helps renters find work close to where they plan to live.',
      },
      {
        q: 'How do I close a job once it is filled?',
        a: 'Go to your Dashboard, find the job post, and click "Mark as Filled". It will be removed from active results and show a "Position Filled" status.',
      },
    ],
  },
  platform: {
    title: 'Platform & Account',
    id: 'platform',
    items: [
      {
        q: 'What is the difference between a Renter and a Subletter account?',
        a: 'Renters are looking for a room. They can browse listings, save favourites, create a renter profile, and message hosts. Subletters have a room or property to fill. They can post listings, browse renter profiles, and manage enquiries.',
      },
      {
        q: 'Can I have both a renter and subletter account?',
        a: 'Currently each account is one type. If you need to switch roles, contact us and we can update your account type.',
      },
      {
        q: 'How does the sort feature work on listings?',
        a: 'Above the listings grid, use the sort dropdown to order results by: Newest first, Oldest first, Price (low to high), Price (high to low), Available soonest, or Available latest.',
      },
      {
        q: 'What is the Facebook Communities page?',
        a: 'The Communities page lists curated Australian Facebook groups for housing — organised by state and category (general, students, expats, subletters). It is a great way to find community support alongside your FlatmateFind search.',
      },
      {
        q: 'How do I advertise on FlatmateFind?',
        a: 'Ad placements are available across the homepage, listings grid, listing detail sidebar, and jobs page. Contact us via the About page to discuss pricing and availability.',
      },
      {
        q: 'Is my data private?',
        a: 'We take privacy seriously. Your profile and messages are only visible to logged-in users. We do not sell personal data to third parties. See our Privacy Policy for full details.',
      },
    ],
  },
};

function FAQSection({ section }: { section: (typeof faqs)[keyof typeof faqs] }) {
  return (
    <div id={section.id} className="mb-12">
      <h2 className="text-xl font-bold text-slate-900 mb-6 pb-3 border-b border-slate-200">
        {section.title}
      </h2>
      <div className="space-y-3">
        {section.items.map((item) => (
          <details
            key={item.q}
            className="group bg-white border border-slate-200 rounded-xl overflow-hidden"
          >
            <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none font-medium text-slate-800 hover:text-teal-700 transition-colors">
              {item.q}
              <ChevronDown className="w-4 h-4 shrink-0 text-slate-400 group-open:rotate-180 transition-transform duration-200" />
            </summary>
            <div className="px-5 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
              {item.a}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="mb-10 text-center">
        <span className="text-xs font-semibold tracking-widest text-teal-600 uppercase">Support</span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-2 mb-3">Frequently Asked Questions</h1>
        <p className="text-slate-500 text-sm">Everything you need to know about using FlatmateFind.</p>
      </div>

      {/* Jump links */}
      <div className="flex gap-2 mb-10 justify-center flex-wrap">
        {Object.values(faqs).map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="px-4 py-1.5 bg-white text-slate-600 text-sm font-medium rounded-full border border-slate-200 hover:border-teal-400 hover:text-teal-600 transition-colors"
          >
            {s.title}
          </a>
        ))}
      </div>

      {Object.values(faqs).map((section) => (
        <FAQSection key={section.id} section={section} />
      ))}

      <div className="bg-teal-50 border border-teal-200 rounded-2xl p-6 text-center">
        <p className="text-sm font-semibold text-slate-800 mb-1">Still have a question?</p>
        <p className="text-xs text-slate-500 mb-4">We are happy to help — reach out via the About page.</p>
        <Link
          href="/about#contact"
          className="inline-flex items-center gap-2 bg-teal-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-teal-700 transition-colors"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
