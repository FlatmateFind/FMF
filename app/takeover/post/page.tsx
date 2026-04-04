'use client';
import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { Home, CheckCircle, AlertTriangle, PlusCircle, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AuthPromptModal from '@/components/AuthPromptModal';
import { usePostedTakeovers } from '@/hooks/usePostedTakeovers';
import { TakeoverPropertyType, TakeoverFurnished } from '@/data/takeovers';
import { AUSTRALIAN_STATES, POST_LANGUAGES } from '@/lib/types';
import { checkSpam } from '@/lib/spamGuard';

const PROPERTY_TYPES: { value: TakeoverPropertyType; label: string }[] = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'unit',      label: 'Unit' },
  { value: 'house',     label: 'House' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'studio',    label: 'Studio' },
  { value: 'villa',     label: 'Villa' },
];

const FURNISHED_OPTIONS: { value: TakeoverFurnished; label: string; desc: string }[] = [
  { value: 'furnished',   label: 'Furnished',      desc: 'All furniture included' },
  { value: 'unfurnished', label: 'Unfurnished',    desc: 'Empty — bring your own' },
  { value: 'partial',     label: 'Semi-furnished', desc: 'Some items included' },
];

const INCLUSION_OPTIONS = [
  'Parking', 'Fridge', 'Washing machine', 'Dryer', 'Dishwasher',
  'Microwave', 'Air conditioning', 'Heating', 'Sofa', 'Dining set',
  'Bed frame & mattress', 'Gym access', 'Pool access', 'Storage cage',
  'Internet ready', 'Balcony', 'Private courtyard', 'Internal laundry',
];

const inputClass = 'w-full text-sm border border-slate-200 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none';
const selectClass = `${inputClass} bg-white`;

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-slate-700 mb-1.5">{children}</label>;
}

function Section({ num, title, children }: { num: number; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-4">
      <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100">
        <span className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center shrink-0">{num}</span>
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function PostTakeoverPage() {
  const { user, loading } = useAuth();
  const { add } = usePostedTakeovers();
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [spamWarnings, setSpamWarnings] = useState<string[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Form fields
  const [propertyType, setPropertyType] = useState<TakeoverPropertyType | ''>('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [suburb, setSuburb] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postcode, setPostcode] = useState('');
  const [rent, setRent] = useState('');
  const [bond, setBond] = useState('');
  const [availableFrom, setAvailableFrom] = useState('');
  const [leaseEndDate, setLeaseEndDate] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [agentOpenToNew, setAgentOpenToNew] = useState<boolean | null>(null);
  const [furnished, setFurnished] = useState<TakeoverFurnished | ''>('');
  const [inclusions, setInclusions] = useState<string[]>([]);
  const [customInclusion, setCustomInclusion] = useState('');
  const [description, setDescription] = useState('');
  const [reasonForLeaving, setReasonForLeaving] = useState('');
  const [postLanguage, setPostLanguage] = useState('English');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  useEffect(() => {
    if (user) {
      setContactName(user.name);
      setContactEmail(user.email);
    }
  }, [user]);

  function toggleInclusion(item: string) {
    setInclusions((prev) => prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]);
  }

  function addCustomInclusion() {
    const val = customInclusion.trim();
    if (val && !inclusions.includes(val)) {
      setInclusions((prev) => [...prev, val]);
      setCustomInclusion('');
    }
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!propertyType) errs.propertyType = 'Required';
    if (!suburb.trim()) errs.suburb = 'Required';
    if (!state) errs.state = 'Required';
    if (!postcode.trim() || postcode.length < 4) errs.postcode = 'Valid postcode required';
    if (!rent || isNaN(Number(rent)) || Number(rent) <= 0) errs.rent = 'Valid rent required';
    if (!bond || isNaN(Number(bond)) || Number(bond) <= 0) errs.bond = 'Valid bond amount required';
    if (!availableFrom) errs.availableFrom = 'Required';
    if (agentOpenToNew === null) errs.agentOpenToNew = 'Required';
    if (!furnished) errs.furnished = 'Required';
    if (!description.trim() || description.trim().length < 80) errs.description = `At least 80 characters required (${description.trim().length}/80)`;
    if (!contactName.trim()) errs.contactName = 'Required';
    if (!contactEmail.trim() || !contactEmail.includes('@')) errs.contactEmail = 'Valid email required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSpamWarnings([]);

    if (!user) { setShowAuthModal(true); return; }

    const spam = checkSpam(`${suburb} ${description}`);
    if (spam.flagged) { setSpamWarnings(spam.reasons); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }

    if (!validate()) { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }

    add({
      id: `to-${user.id}-${Date.now()}`,
      suburb: suburb.trim(),
      city: city.trim() || suburb.trim(),
      state,
      postcode: postcode.trim(),
      propertyType: propertyType as TakeoverPropertyType,
      bedrooms: propertyType === 'studio' ? 0 : Number(bedrooms) || 1,
      bathrooms: Number(bathrooms) || 1,
      rent: Number(rent),
      bond: Number(bond),
      availableFrom,
      leaseEndDate: leaseEndDate || undefined,
      agencyName: agencyName.trim() || undefined,
      agentOpenToNew: agentOpenToNew as boolean,
      furnished: furnished as TakeoverFurnished,
      inclusions: inclusions.length ? inclusions : undefined,
      description: description.trim(),
      reasonForLeaving: reasonForLeaving.trim() || undefined,
      postLanguage: postLanguage !== 'English' ? postLanguage : undefined,
      contactName: contactName.trim(),
      contactEmail: contactEmail.trim(),
      postedAt: new Date().toISOString(),
      status: 'active',
      postedByUserId: user.id,
      images: [],
    });

    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (submitted) return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-8 h-8 text-orange-500" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Takeover Listed!</h1>
      <p className="text-slate-500 text-sm mb-6">Your unit takeover is now visible to renters looking to take over a lease.</p>
      <div className="flex justify-center gap-3">
        <Link href="/takeover" className="px-5 py-2.5 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 text-sm transition-colors">
          Browse Takeovers
        </Link>
        <Link href="/dashboard" className="px-5 py-2.5 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 text-sm transition-colors">
          Dashboard
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {showAuthModal && (
        <AuthPromptModal
          onClose={() => setShowAuthModal(false)}
          returnTo="/takeover/post"
          icon={<Home className="w-7 h-7 text-orange-500" />}
          title="Sign up to post a takeover"
          message="Create a free account to list your unit and find someone to take over your lease."
        />
      )}

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
            <Home className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Post a Unit Takeover</h1>
            <p className="text-slate-500 text-sm">Hand your lease to the next tenant — free to post</p>
          </div>
        </div>

        {/* Info banner */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 mb-6 text-sm text-orange-800 leading-relaxed">
          <strong>How this works:</strong> You're leaving your rental and want someone to take over your lease. Post the details here — interested renters will contact you, then apply directly to your real estate agent to become the new head tenant.
        </div>

        {/* Warnings */}
        {spamWarnings.length > 0 && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-5">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-800 text-sm mb-1">Post flagged for review</p>
              <ul className="list-disc pl-4 space-y-0.5">
                {spamWarnings.map((w) => <li key={w} className="text-amber-700 text-sm">{w}</li>)}
              </ul>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* 1. Property details */}
          <Section num={1} title="Property Details">
            <div className="mb-4">
              <Label>Property Type <span className="text-red-500">*</span></Label>
              <div className="flex flex-wrap gap-2">
                {PROPERTY_TYPES.map(({ value, label }) => (
                  <button key={value} type="button" onClick={() => setPropertyType(value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                      propertyType === value
                        ? 'bg-orange-500 border-orange-500 text-white'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-orange-300 hover:text-orange-600'
                    }`}>
                    {label}
                  </button>
                ))}
              </div>
              {errors.propertyType && <p className="text-red-500 text-xs mt-1">{errors.propertyType}</p>}
            </div>

            {propertyType !== 'studio' && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label>Bedrooms <span className="text-red-500">*</span></Label>
                  <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className={selectClass}>
                    <option value="">Select...</option>
                    {[1,2,3,4,5].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <Label>Bathrooms <span className="text-red-500">*</span></Label>
                  <select value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} className={selectClass}>
                    <option value="">Select...</option>
                    {[1,2,3].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>
            )}

            <div className="mb-4">
              <Label>Furnished Status <span className="text-red-500">*</span></Label>
              <div className="grid grid-cols-3 gap-2">
                {FURNISHED_OPTIONS.map(({ value, label, desc }) => (
                  <button key={value} type="button" onClick={() => setFurnished(value)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      furnished === value
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-slate-200 hover:border-orange-200'
                    }`}>
                    <p className={`text-xs font-semibold ${furnished === value ? 'text-orange-700' : 'text-slate-700'}`}>{label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{desc}</p>
                  </button>
                ))}
              </div>
              {errors.furnished && <p className="text-red-500 text-xs mt-1">{errors.furnished}</p>}
            </div>
          </Section>

          {/* 2. Location */}
          <Section num={2} title="Location">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label>Suburb <span className="text-red-500">*</span></Label>
                <input value={suburb} onChange={(e) => setSuburb(e.target.value)} placeholder="e.g. Fitzroy" className={inputClass} />
                {errors.suburb && <p className="text-red-500 text-xs mt-1">{errors.suburb}</p>}
              </div>
              <div>
                <Label>City <span className="text-slate-400 font-normal">(optional)</span></Label>
                <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Melbourne" className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>State <span className="text-red-500">*</span></Label>
                <select value={state} onChange={(e) => setState(e.target.value)} className={selectClass}>
                  <option value="">Select state...</option>
                  {AUSTRALIAN_STATES.map((s) => <option key={s.abbr} value={s.abbr}>{s.name}</option>)}
                </select>
                {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
              </div>
              <div>
                <Label>Postcode <span className="text-red-500">*</span></Label>
                <input value={postcode} onChange={(e) => setPostcode(e.target.value)} placeholder="e.g. 3065" maxLength={4} className={inputClass} />
                {errors.postcode && <p className="text-red-500 text-xs mt-1">{errors.postcode}</p>}
              </div>
            </div>
          </Section>

          {/* 3. Rent & Bond */}
          <Section num={3} title="Rent & Bond">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Weekly Rent (AUD) <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                  <input type="number" min="1" value={rent} onChange={(e) => setRent(e.target.value)}
                    placeholder="520" className={`${inputClass} pl-7`} />
                </div>
                {errors.rent && <p className="text-red-500 text-xs mt-1">{errors.rent}</p>}
              </div>
              <div>
                <Label>Total Bond (AUD) <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                  <input type="number" min="1" value={bond} onChange={(e) => setBond(e.target.value)}
                    placeholder="2080" className={`${inputClass} pl-7`} />
                </div>
                {errors.bond && <p className="text-red-500 text-xs mt-1">{errors.bond}</p>}
                <p className="text-[11px] text-slate-400 mt-1">Typically 4 weeks rent</p>
              </div>
            </div>
          </Section>

          {/* 4. Dates & Lease */}
          <Section num={4} title="Dates & Lease">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label>Available From <span className="text-red-500">*</span></Label>
                <input type="date" value={availableFrom} onChange={(e) => setAvailableFrom(e.target.value)} className={inputClass} />
                {errors.availableFrom && <p className="text-red-500 text-xs mt-1">{errors.availableFrom}</p>}
              </div>
              <div>
                <Label>Lease End Date <span className="text-slate-400 font-normal">(optional)</span></Label>
                <input type="date" value={leaseEndDate} onChange={(e) => setLeaseEndDate(e.target.value)} className={inputClass} />
                <p className="text-[11px] text-slate-400 mt-1">When the current lease expires</p>
              </div>
            </div>
          </Section>

          {/* 5. Agent & Agency */}
          <Section num={5} title="Agent & Agency">
            <div className="mb-4">
              <Label>Real Estate Agency <span className="text-slate-400 font-normal">(optional)</span></Label>
              <input value={agencyName} onChange={(e) => setAgencyName(e.target.value)}
                placeholder="e.g. Ray White Fitzroy, McGrath Newtown" className={inputClass} />
            </div>
            <div>
              <Label>Is the agent open to new applicants? <span className="text-red-500">*</span></Label>
              <p className="text-xs text-slate-400 mb-2.5">This helps renters understand if the lease transfer is confirmed or still being negotiated</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { val: true, label: 'Yes — confirmed', desc: 'Agent has agreed to accept new applicants', color: 'border-green-400 bg-green-50' },
                  { val: false, label: 'Not yet confirmed', desc: 'Renter will need to apply via normal process', color: 'border-slate-300 bg-white' },
                ].map(({ val, label, desc, color }) => (
                  <button key={String(val)} type="button" onClick={() => setAgentOpenToNew(val)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      agentOpenToNew === val ? color : 'border-slate-200 hover:border-slate-300'
                    }`}>
                    <p className={`text-xs font-semibold ${agentOpenToNew === val && val ? 'text-green-700' : 'text-slate-700'}`}>{label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{desc}</p>
                  </button>
                ))}
              </div>
              {errors.agentOpenToNew && <p className="text-red-500 text-xs mt-1">{errors.agentOpenToNew}</p>}
            </div>
          </Section>

          {/* 6. Inclusions */}
          <Section num={6} title="What's Included">
            <p className="text-xs text-slate-400 mb-3">Select anything that comes with the unit (furniture, appliances, extras)</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mb-3">
              {INCLUSION_OPTIONS.map((item) => (
                <label key={item} className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" checked={inclusions.includes(item)} onChange={() => toggleInclusion(item)}
                    className="w-3.5 h-3.5 rounded text-orange-500 border-slate-300 focus:ring-orange-400" />
                  <span className="text-xs text-slate-700 group-hover:text-orange-600 transition-colors">{item}</span>
                </label>
              ))}
            </div>
            {/* Custom inclusions */}
            <div className="flex gap-2 mt-2">
              <input value={customInclusion} onChange={(e) => setCustomInclusion(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomInclusion(); }}}
                placeholder="Add custom item..." className={`${inputClass} flex-1`} />
              <button type="button" onClick={addCustomInclusion}
                className="px-3 py-2 bg-orange-100 text-orange-600 hover:bg-orange-200 rounded-lg text-xs font-medium transition-colors">
                <PlusCircle className="w-4 h-4" />
              </button>
            </div>
            {inclusions.filter((i) => !INCLUSION_OPTIONS.includes(i)).length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {inclusions.filter((i) => !INCLUSION_OPTIONS.includes(i)).map((i) => (
                  <span key={i} className="flex items-center gap-1 px-2.5 py-1 bg-orange-50 border border-orange-200 text-orange-700 text-xs rounded-full">
                    {i}
                    <button type="button" onClick={() => setInclusions((prev) => prev.filter((x) => x !== i))}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </Section>

          {/* 7. Description */}
          <Section num={7} title="Description">
            <div className="mb-4">
              <Label>Describe the property & situation <span className="text-red-500">*</span></Label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5}
                placeholder="Describe the property, the neighbourhood, why you're leaving, what the agent is like to deal with, and any other relevant info for potential tenants..."
                className={`${inputClass} resize-none`} />
              <div className="flex justify-between mt-1">
                {errors.description
                  ? <p className="text-red-500 text-xs">{errors.description}</p>
                  : <p className="text-xs text-slate-400">Minimum 80 characters</p>}
                <span className={`text-xs font-medium ${description.trim().length >= 80 ? 'text-green-600' : 'text-slate-400'}`}>
                  {description.trim().length}/80
                </span>
              </div>
            </div>
            <div>
              <Label>Reason for leaving <span className="text-slate-400 font-normal">(optional)</span></Label>
              <input value={reasonForLeaving} onChange={(e) => setReasonForLeaving(e.target.value)}
                placeholder="e.g. Relocating interstate, buying a property, returning overseas..." className={inputClass} />
            </div>
          </Section>

          {/* 8. Post language */}
          <Section num={8} title="Post Language">
            <p className="text-xs text-slate-400 mb-3">What language is this post written in?</p>
            <div className="flex flex-wrap gap-2">
              {POST_LANGUAGES.map(({ label, native }) => (
                <button key={label} type="button" onClick={() => setPostLanguage(label)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    postLanguage === label
                      ? 'bg-orange-500 border-orange-500 text-white'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-orange-300 hover:text-orange-600'
                  }`}>
                  {label === native ? label : `${label} · ${native}`}
                </button>
              ))}
            </div>
          </Section>

          {/* 9. Contact */}
          <Section num={9} title="Your Contact Details">
            <p className="text-xs text-slate-400 mb-3">Only shown to signed-in users who click "Contact subletter".</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Your name <span className="text-red-500">*</span></Label>
                <input value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="e.g. Jessica T." className={inputClass} />
                {errors.contactName && <p className="text-red-500 text-xs mt-1">{errors.contactName}</p>}
              </div>
              <div>
                <Label>Contact email <span className="text-red-500">*</span></Label>
                <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="your@email.com" className={inputClass} />
                {errors.contactEmail && <p className="text-red-500 text-xs mt-1">{errors.contactEmail}</p>}
              </div>
            </div>
          </Section>

          <button type="submit"
            className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors text-sm shadow-sm">
            Post Unit Takeover
          </button>
          <p className="text-xs text-slate-400 text-center mt-3">
            By posting you agree to our <Link href="/terms" className="hover:underline text-orange-500">Terms of Service</Link>. Free to post, always.
          </p>
        </form>
      </div>
    </>
  );
}
