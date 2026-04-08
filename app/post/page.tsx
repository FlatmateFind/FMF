'use client';
import { useState, FormEvent } from 'react';
import { CheckCircle, AlertTriangle, Zap, Home as HomeIcon, ArrowLeftRight, ShoppingCart, Train, Bus, GraduationCap, School, Hospital, Dumbbell, Trees, ShoppingBag, Pill, Coffee, Plane, Umbrella, MapPinned, PlusCircle, type LucideIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AuthPromptModal from '@/components/AuthPromptModal';

const NEARBY_ICONS: Record<string, LucideIcon> = {
  'Supermarket':        ShoppingCart,
  'Train station':      Train,
  'Bus stop':           Bus,
  'Tram stop':          Train,
  'University / TAFE':  GraduationCap,
  'School':             School,
  'Hospital / Clinic':  Hospital,
  'Gym':                Dumbbell,
  'Park':               Trees,
  'Shopping centre':    ShoppingBag,
  'Pharmacy':           Pill,
  'Café / Restaurant':  Coffee,
  'Airport':            Plane,
  'Beach':              Umbrella,
};
import Link from 'next/link';
import { CITIES, PROPERTY_TYPES, ROOM_CATEGORIES_LIST, INCLUSIONS_LIST, FACILITIES_LIST, ROOM_FEATURES_LIST, ROOM_TERMS_LIST, HOUSE_RULES_LIST, NATIONALITIES, POST_LANGUAGES, NEARBY_PLACE_TYPES, NearbyPlace } from '@/lib/types';
import { usePostedListings } from '@/hooks/usePostedListings';
import { checkSpam, isValidAUPostcode, checkRateLimit } from '@/lib/spamGuard';
import CustomTagInput from '@/components/CustomTagInput';

interface FormData {
  type: string;
  furnished: string;
  bedrooms: string;
  bathrooms: string;
  city: string;
  suburb: string;
  postcode: string;
  address: string;
  rentAmount: string;
  currency: string;
  period: string;
  currentOccupants: string;
  totalCapacity: string;
  inclusions: string[];
  facilities: string[];
  roomFeatures: string[];
  roomCategories: string[];
  preferredNationalities: string[];
  postLanguage: string;
  preferredGender: string;
  petsAllowed: boolean;
  smokingAllowed: boolean;
  stayType: string;
  minimumStay: string;
  availableFrom: string;
  description: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

const initialForm: FormData = {
  type: '', furnished: '', bedrooms: '', bathrooms: '',
  city: '', suburb: '', postcode: '', address: '',
  rentAmount: '', currency: 'AUD', period: 'week',
  currentOccupants: '', totalCapacity: '',
  inclusions: [], facilities: [], roomFeatures: [], roomCategories: [], preferredNationalities: [], postLanguage: 'English',
  preferredGender: 'any', petsAllowed: false, smokingAllowed: false,
  stayType: '', minimumStay: '', availableFrom: '', description: '',
  contactName: '', contactEmail: '', contactPhone: '',
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-5">
      <h2 className="text-base font-semibold text-slate-900 mb-4 pb-3 border-b border-slate-100">{title}</h2>
      {children}
    </div>
  );
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-slate-700 mb-1.5">
      {children}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

const inputClass = 'w-full text-sm border border-slate-200 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none';
const selectClass = 'w-full text-sm border border-slate-200 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white';

export default function PostListingPage() {
  const { user } = useAuth();
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [blockError, setBlockError] = useState('');
  const [spamWarnings, setSpamWarnings] = useState<string[]>([]);
  const [customInclusions, setCustomInclusions] = useState<string[]>([]);
  const [customFacilities, setCustomFacilities] = useState<string[]>([]);
  const [customRoomFeatures, setCustomRoomFeatures] = useState<string[]>([]);
  const [rules, setRules] = useState<string[]>([]);
  const [customRules, setCustomRules] = useState<string[]>([]);
  const [customNationalities, setCustomNationalities] = useState<string[]>([]);
  const [nearbyDistances, setNearbyDistances] = useState<Record<string, string>>({});
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { add } = usePostedListings();

  function set(key: keyof FormData, value: FormData[keyof FormData]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function toggleList(key: 'inclusions' | 'facilities' | 'roomFeatures' | 'roomCategories' | 'preferredNationalities', value: string) {
    const arr = form[key] as string[];
    set(key, arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);
  }

  function validate(): boolean {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!form.type) errs.type = 'Required';
    if (!form.furnished) errs.furnished = 'Required';
    if (!form.bedrooms) errs.bedrooms = 'Required';
    if (!form.bathrooms) errs.bathrooms = 'Required';
    if (!form.city) errs.city = 'Required';
    if (!form.suburb) errs.suburb = 'Required';
    if (!form.address) errs.address = 'Required';
    if (!form.postcode) {
      errs.postcode = 'Required';
    } else if (!isValidAUPostcode(form.postcode)) {
      errs.postcode = 'Enter a valid 4-digit Australian postcode (e.g. 2042)';
    }
    if (!form.rentAmount) errs.rentAmount = 'Required';
    if (form.rentAmount && Number(form.rentAmount) < 50) errs.rentAmount = 'Rent must be at least $50/week';
    if (!form.totalCapacity) errs.totalCapacity = 'Required';
    if (!form.availableFrom) errs.availableFrom = 'Required';
    if (!form.description || form.description.trim().length < 100) {
      errs.description = `Please write at least 100 characters (${form.description.trim().length}/100)`;
    }
    if (!form.contactName) errs.contactName = 'Required';
    if (!form.contactEmail) errs.contactEmail = 'Required';
    if (form.contactEmail && !form.contactEmail.includes('@')) errs.contactEmail = 'Invalid email';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setBlockError('');
    setSpamWarnings([]);

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // ── Rate limit check ──────────────────────────────────────────────────
    const rateCheck = checkRateLimit();
    if (rateCheck.blocked) {
      setBlockError(rateCheck.reason!);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // ── Spam / fraud content check ────────────────────────────────────────
    const spamCheck = checkSpam(`${form.description} ${form.contactPhone}`);
    if (spamCheck.flagged) {
      setSpamWarnings(spamCheck.reasons);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!validate()) return;
    // Save to localStorage for dashboard
    add({
      id: `post-${Date.now()}`,
      title: `${form.type.charAt(0).toUpperCase() + form.type.slice(1)} in ${form.suburb}`,
      type: form.type,
      city: form.city,
      suburb: form.suburb,
      postcode: form.postcode,
      address: form.address,
      rentAmount: Number(form.rentAmount),
      currency: form.currency,
      period: form.period,
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      availableFrom: form.availableFrom,
      postedAt: new Date().toISOString(),
      status: 'active',
      contactName: form.contactName,
      stayType: form.stayType || undefined,
      rules: [...rules, ...customRules].length ? [...rules, ...customRules] : undefined,
      nearbyPlaces: Object.entries(nearbyDistances)
        .filter(([, d]) => d.trim())
        .map(([type, distance]) => ({ type, distance: distance.trim() })),
      inclusions: [...form.inclusions, ...customInclusions],
      facilities: [...form.facilities, ...customFacilities],
      roomFeatures: [...form.roomFeatures, ...customRoomFeatures],
      roomCategories: form.roomCategories,
      postLanguage: form.postLanguage !== 'English' ? form.postLanguage : undefined,
    });
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-10">
          <CheckCircle className="w-16 h-16 text-teal-500 mx-auto mb-5" />
          <h1 className="text-2xl font-bold text-slate-900 mb-3">Listing Submitted!</h1>
          <p className="text-slate-600 mb-6">
            Your listing has been submitted and saved to your dashboard.
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/dashboard" className="px-5 py-2.5 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors text-sm">
              View Dashboard
            </Link>
            <Link href="/listings" className="px-5 py-2.5 border border-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors text-sm">
              Browse Listings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    {showAuthModal && (
      <AuthPromptModal
        onClose={() => setShowAuthModal(false)}
        returnTo="/post"
        icon={<PlusCircle className="w-7 h-7 text-teal-600" />}
        title="Create an account to post"
        message="You're almost there! Sign up for free to publish your listing and start receiving enquiries."
      />
    )}
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Post a Listing</h1>
        <p className="text-slate-500 text-sm">Fill in your property details to reach thousands of potential tenants.</p>
      </div>

      {/* Rate limit / block error */}
      {blockError && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-4 mb-6">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-700 text-sm mb-0.5">Posting limit reached</p>
            <p className="text-red-600 text-sm">{blockError}</p>
          </div>
        </div>
      )}

      {/* Spam / fraud warnings */}
      {spamWarnings.length > 0 && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-6">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-800 text-sm mb-1">Your listing was flagged for review</p>
            <ul className="list-disc pl-4 space-y-0.5">
              {spamWarnings.map((w) => (
                <li key={w} className="text-amber-700 text-sm">{w}</li>
              ))}
            </ul>
            <p className="text-amber-600 text-xs mt-2">
              Please revise your listing to remove any suspicious content. Fraudulent listings are removed and accounts are banned.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* 1. Property Details */}
        <Section title="1. Property Details">
          {/* Room category pills */}
          <div className="mb-5">
            <Label>Room Category <span className="text-slate-400 font-normal">(select all that apply)</span></Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {ROOM_CATEGORIES_LIST.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleList('roomCategories', cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    form.roomCategories.includes(cat)
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-teal-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label required>Room Type</Label>
              <select value={form.type} onChange={(e) => set('type', e.target.value)} className={selectClass}>
                <option value="">Select type...</option>
                {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
              {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
            </div>
            <div>
              <Label required>Furnished Status</Label>
              <select value={form.furnished} onChange={(e) => set('furnished', e.target.value)} className={selectClass}>
                <option value="">Select...</option>
                <option value="furnished">Furnished</option>
                <option value="unfurnished">Unfurnished</option>
              </select>
              {errors.furnished && <p className="text-red-500 text-xs mt-1">{errors.furnished}</p>}
            </div>
            <div>
              <Label required>Bedrooms</Label>
              <input type="number" min="1" value={form.bedrooms} onChange={(e) => set('bedrooms', e.target.value)} placeholder="e.g. 3" className={inputClass} />
              {errors.bedrooms && <p className="text-red-500 text-xs mt-1">{errors.bedrooms}</p>}
            </div>
            <div>
              <Label required>Bathrooms</Label>
              <input type="number" min="1" value={form.bathrooms} onChange={(e) => set('bathrooms', e.target.value)} placeholder="e.g. 1" className={inputClass} />
              {errors.bathrooms && <p className="text-red-500 text-xs mt-1">{errors.bathrooms}</p>}
            </div>
          </div>
        </Section>

        {/* 2. Location */}
        <Section title="2. Location">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label required>Street Address</Label>
              <input type="text" value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="e.g. 14 King Street" className={inputClass} />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>
            <div>
              <Label required>Suburb</Label>
              <input type="text" value={form.suburb} onChange={(e) => set('suburb', e.target.value)} placeholder="e.g. Newtown" className={inputClass} />
              {errors.suburb && <p className="text-red-500 text-xs mt-1">{errors.suburb}</p>}
            </div>
            <div>
              <Label required>Postcode</Label>
              <input type="text" value={form.postcode} onChange={(e) => set('postcode', e.target.value)} placeholder="e.g. 2042" maxLength={4} className={inputClass} />
              {errors.postcode && <p className="text-red-500 text-xs mt-1">{errors.postcode}</p>}
            </div>
            <div>
              <Label required>City</Label>
              <select value={form.city} onChange={(e) => set('city', e.target.value)} className={selectClass}>
                <option value="">Select city...</option>
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>
          </div>
        </Section>

        {/* 3. Rent */}
        <Section title="3. Rent">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-3 sm:col-span-1">
              <Label required>Amount</Label>
              <input type="number" min="0" value={form.rentAmount} onChange={(e) => set('rentAmount', e.target.value)} placeholder="e.g. 350" className={inputClass} />
              {errors.rentAmount && <p className="text-red-500 text-xs mt-1">{errors.rentAmount}</p>}
            </div>
            <div>
              <Label>Currency</Label>
              <select value={form.currency} onChange={(e) => set('currency', e.target.value)} className={selectClass}>
                <option value="AUD">AUD</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <div>
              <Label>Period</Label>
              <select value={form.period} onChange={(e) => set('period', e.target.value)} className={selectClass}>
                <option value="week">Per week</option>
                <option value="month">Per month</option>
              </select>
            </div>
          </div>
        </Section>

        {/* 4. Occupants */}
        <Section title="4. Occupants">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Current Occupants</Label>
              <input type="number" min="0" value={form.currentOccupants} onChange={(e) => set('currentOccupants', e.target.value)} placeholder="e.g. 2" className={inputClass} />
            </div>
            <div>
              <Label required>Total Capacity</Label>
              <input type="number" min="1" value={form.totalCapacity} onChange={(e) => set('totalCapacity', e.target.value)} placeholder="e.g. 3" className={inputClass} />
              {errors.totalCapacity && <p className="text-red-500 text-xs mt-1">{errors.totalCapacity}</p>}
            </div>
          </div>
        </Section>

        {/* 5. Inclusions */}
        <Section title="5. What's Included in Rent">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {INCLUSIONS_LIST.map((inc) => (
              <label key={inc} className="flex items-center gap-2.5 cursor-pointer group">
                <input type="checkbox" checked={form.inclusions.includes(inc)} onChange={() => toggleList('inclusions', inc)} className="w-4 h-4 rounded text-teal-600 border-slate-300 focus:ring-teal-500" />
                <span className="text-sm text-slate-700 group-hover:text-teal-600 transition-colors">{inc}</span>
              </label>
            ))}
          </div>
          <CustomTagInput
            items={customInclusions}
            onChange={setCustomInclusions}
            existingSelected={form.inclusions}
            placeholder="e.g. Lawn maintenance, Pool heating…"
          />
        </Section>

        {/* 6. Facilities */}
        <Section title="6. Facilities">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {FACILITIES_LIST.map((f) => (
              <label key={f} className="flex items-center gap-2.5 cursor-pointer group">
                <input type="checkbox" checked={form.facilities.includes(f)} onChange={() => toggleList('facilities', f)} className="w-4 h-4 rounded text-teal-600 border-slate-300 focus:ring-teal-500" />
                <span className="text-sm text-slate-700 group-hover:text-teal-600 transition-colors">{f}</span>
              </label>
            ))}
          </div>
          <CustomTagInput
            items={customFacilities}
            onChange={setCustomFacilities}
            existingSelected={form.facilities}
            placeholder="e.g. EV charger, Rooftop terrace…"
          />
        </Section>

        {/* 7. Room Features */}
        <Section title="7. Room Features">
          <p className="text-xs text-slate-500 mb-3">Select all features that apply to the room being offered.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {ROOM_FEATURES_LIST.map((feat) => (
              <label key={feat} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={form.roomFeatures.includes(feat)}
                  onChange={() => toggleList('roomFeatures', feat)}
                  className="w-4 h-4 rounded text-teal-600 border-slate-300 focus:ring-teal-500"
                />
                <span className="text-sm text-slate-700 group-hover:text-teal-600 transition-colors">{feat}</span>
              </label>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Terms</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ROOM_TERMS_LIST.map((term) => (
                <label key={term} className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={form.roomFeatures.includes(term)}
                    onChange={() => toggleList('roomFeatures', term)}
                    className="w-4 h-4 rounded text-teal-600 border-slate-300 focus:ring-teal-500"
                  />
                  <span className="text-sm text-slate-700 group-hover:text-teal-600 transition-colors">{term}</span>
                </label>
              ))}
            </div>
          </div>
          <CustomTagInput
            items={customRoomFeatures}
            onChange={setCustomRoomFeatures}
            existingSelected={form.roomFeatures}
            placeholder="e.g. Walk-in wardrobe, Bay window…"
          />
        </Section>

        {/* 8. House Rules */}
        <Section title="8. House Rules">
          <p className="text-xs text-slate-500 mb-3">Let renters know the house expectations. Select all that apply.</p>
          {/* Group rules by category */}
          {[
            { label: 'Guests & Visitors', items: ['No overnight guests', 'Visitors by prior notice only', 'No parties or events'] },
            { label: 'Noise & Lifestyle',  items: ['Quiet hours after 10pm', 'No loud music', 'Study-friendly environment', 'Working professionals preferred'] },
            { label: 'Cleanliness',        items: ['Clean kitchen after use', 'Keep common areas tidy', 'Weekly cleaning rotation', 'No shoes inside'] },
            { label: 'Substances',         items: ['No smoking indoors', 'No drugs', 'No alcohol'] },
            { label: 'Household',          items: ['No food in bedrooms', 'No pets', 'Vegetarian household', 'Halal household', 'Bills split equally', '2 weeks notice to vacate', 'No subletting without permission'] },
          ].map(({ label, items }) => (
            <div key={label} className="mb-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">{label}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {items.map((rule) => (
                  <label key={rule} className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={rules.includes(rule)}
                      onChange={() => setRules((prev) => prev.includes(rule) ? prev.filter((r) => r !== rule) : [...prev, rule])}
                      className="w-4 h-4 rounded text-teal-600 border-slate-300 focus:ring-teal-500"
                    />
                    <span className="text-sm text-slate-700 group-hover:text-teal-600 transition-colors">{rule}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <CustomTagInput
            items={customRules}
            onChange={setCustomRules}
            existingSelected={rules}
            placeholder="e.g. No shoes in common areas, Quiet after 11pm…"
          />
        </Section>

        {/* 9. Tenant Preferences */}
        <Section title="9. Tenant Preferences">
          <div className="space-y-5">
            <div>
              <Label>Preferred Nationality (leave blank for any)</Label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 mt-2">
                {NATIONALITIES.map((nat) => (
                  <label key={nat} className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" checked={form.preferredNationalities.includes(nat)} onChange={() => toggleList('preferredNationalities', nat)} className="w-3.5 h-3.5 rounded text-teal-600 border-slate-300 focus:ring-teal-500" />
                    <span className="text-xs text-slate-700 group-hover:text-teal-600 transition-colors">{nat}</span>
                  </label>
                ))}
              </div>
              <CustomTagInput
                items={customNationalities}
                onChange={setCustomNationalities}
                existingSelected={form.preferredNationalities}
                placeholder="e.g. Tibetan, Uyghur, Punjabi…"
              />
            </div>
            <div>
              <Label>Post language</Label>
              <p className="text-xs text-slate-400 mb-2.5">What language is this listing written in? Renters can filter posts by this.</p>
              <div className="flex flex-wrap gap-2">
                {POST_LANGUAGES.map(({ label, native }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => set('postLanguage', label)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      form.postLanguage === label
                        ? 'bg-teal-600 border-teal-600 text-white'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-teal-300 hover:text-teal-600'
                    }`}
                  >
                    {label === native ? label : `${label} · ${native}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Stay type */}
            <div className="mb-4">
              <Label>Stay Type</Label>
              <div className="flex gap-2 flex-wrap">
                {(['short term', 'long term', 'both'] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => set('stayType', form.stayType === opt ? '' : opt)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all capitalize ${
                      form.stayType === opt
                        ? opt === 'short term' ? 'bg-blue-600 text-white border-blue-600'
                          : opt === 'long term' ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-violet-600 text-white border-violet-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-teal-400'
                    }`}
                  >
                    {opt === 'short term'
                      ? <><Zap className="w-3.5 h-3.5 inline mr-1" />Short term</>
                      : opt === 'long term'
                      ? <><HomeIcon className="w-3.5 h-3.5 inline mr-1" />Long term</>
                      : <><ArrowLeftRight className="w-3.5 h-3.5 inline mr-1" />Both</>
                    }
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-1.5">Short term = under 3 months · Long term = 3 months or more</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Gender Preference</Label>
                <select value={form.preferredGender} onChange={(e) => set('preferredGender', e.target.value)} className={selectClass}>
                  <option value="any">Any</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <Label>Minimum Stay</Label>
                <input type="text" value={form.minimumStay} onChange={(e) => set('minimumStay', e.target.value)} placeholder="e.g. 3 months" className={inputClass} />
              </div>
            </div>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.petsAllowed} onChange={(e) => set('petsAllowed', e.target.checked)} className="w-4 h-4 rounded text-teal-600 border-slate-300 focus:ring-teal-500" />
                <span className="text-sm text-slate-700 font-medium">Pets allowed</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.smokingAllowed} onChange={(e) => set('smokingAllowed', e.target.checked)} className="w-4 h-4 rounded text-teal-600 border-slate-300 focus:ring-teal-500" />
                <span className="text-sm text-slate-700 font-medium">Smoking allowed</span>
              </label>
            </div>
          </div>
        </Section>

        {/* 10. Availability */}
        <Section title="10. Availability">
          <div>
            <Label required>Available From</Label>
            <input type="date" value={form.availableFrom} onChange={(e) => set('availableFrom', e.target.value)} className={inputClass} />
            {errors.availableFrom && <p className="text-red-500 text-xs mt-1">{errors.availableFrom}</p>}
          </div>
        </Section>

        {/* 11. Nearby Places */}
        <Section title="11. Nearby Places">
          <p className="text-xs text-slate-500 mb-4">
            Enter walking/driving times or distances to help renters understand the location. Leave blank to skip any place type.
          </p>
          {/* 6-col shared grid: [icon][label][input] | [icon][label][input] — aligned across both columns */}
          <div className="grid grid-cols-1 sm:grid-cols-[28px_minmax(0,1fr)_minmax(0,1.4fr)_28px_minmax(0,1fr)_minmax(0,1.4fr)] gap-x-2 gap-y-2.5 items-center">
            {NEARBY_PLACE_TYPES.map(({ type }) => {
              const Icon = NEARBY_ICONS[type] ?? MapPinned;
              return (
                <div key={type} className="flex items-center gap-2 sm:contents">
                  <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-teal-600" />
                  </div>
                  <span className="text-sm text-slate-700 flex-1 min-w-0 truncate sm:w-auto">{type}</span>
                  <input
                    type="text"
                    value={nearbyDistances[type] ?? ''}
                    onChange={(e) => setNearbyDistances((prev) => ({ ...prev, [type]: e.target.value }))}
                    placeholder="e.g. 5 min walk"
                    className="w-32 sm:w-full text-sm border border-slate-200 rounded-lg py-1.5 px-2.5 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none shrink-0"
                  />
                </div>
              );
            })}
          </div>
          {/* Custom place */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs font-medium text-slate-600 mb-2">Other (optional)</p>
            <div className="space-y-2" id="custom-nearby">
              <CustomNearbyRow
                onAdd={(type, distance) =>
                  setNearbyDistances((prev) => ({ ...prev, [type]: distance }))
                }
              />
            </div>
          </div>
        </Section>

        {/* 12. Description */}
        <Section title="12. Description">
          <div>
            <Label required>Tell us about the property and what you&apos;re looking for in a tenant</Label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={5}
              placeholder="Describe the property, the current housemates, local area, what kind of tenant you're looking for..."
              className={`${inputClass} resize-none`}
            />
            <div className="flex justify-between mt-1">
              {errors.description
                ? <p className="text-red-500 text-xs">{errors.description}</p>
                : <p className="text-xs text-slate-400">Minimum 100 characters required</p>}
              <span className={`text-xs font-medium ${form.description.trim().length >= 100 ? 'text-green-600' : 'text-slate-400'}`}>
                {form.description.trim().length}/100
              </span>
            </div>
          </div>
        </Section>

        {/* 13. Contact Info */}
        <Section title="13. Contact Info">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label required>Your Name</Label>
              <input type="text" value={form.contactName} onChange={(e) => set('contactName', e.target.value)} placeholder="Full name" className={inputClass} />
              {errors.contactName && <p className="text-red-500 text-xs mt-1">{errors.contactName}</p>}
            </div>
            <div>
              <Label required>Email</Label>
              <input type="email" value={form.contactEmail} onChange={(e) => set('contactEmail', e.target.value)} placeholder="you@example.com" className={inputClass} />
              {errors.contactEmail && <p className="text-red-500 text-xs mt-1">{errors.contactEmail}</p>}
            </div>
            <div>
              <Label>Phone (optional)</Label>
              <input type="tel" value={form.contactPhone} onChange={(e) => set('contactPhone', e.target.value)} placeholder="+61 400 000 000" className={inputClass} />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">Your contact details will only be shown to registered users who enquire about your listing.</p>
        </Section>

        <div className="flex justify-end">
          <button type="submit" className="px-8 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors text-sm">
            Submit Listing
          </button>
        </div>
      </form>
    </div>
    </>
  );
}

function CustomNearbyRow({ onAdd }: { onAdd: (type: string, distance: string) => void }) {
  const [type, setType] = useState('');
  const [distance, setDistance] = useState('');
  function handleAdd() {
    if (type.trim() && distance.trim()) {
      onAdd(type.trim(), distance.trim());
      setType('');
      setDistance('');
    }
  }
  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        type="text"
        value={type}
        onChange={(e) => setType(e.target.value)}
        placeholder="Place name (e.g. Bunnings)"
        className="flex-1 min-w-0 text-sm border border-slate-200 rounded-lg py-1.5 px-2.5 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
      />
      <input
        type="text"
        value={distance}
        onChange={(e) => setDistance(e.target.value)}
        placeholder="Distance"
        className="w-24 text-sm border border-slate-200 rounded-lg py-1.5 px-2.5 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
      />
      <button
        type="button"
        onClick={handleAdd}
        className="shrink-0 px-3 py-1.5 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700 transition-colors"
      >
        Add
      </button>
    </div>
  );
}
