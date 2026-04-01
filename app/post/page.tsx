'use client';
import { useState, FormEvent } from 'react';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { CITIES, PROPERTY_TYPES, INCLUSIONS_LIST, FACILITIES_LIST, NATIONALITIES } from '@/lib/types';
import { usePostedListings } from '@/hooks/usePostedListings';

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
  preferredNationalities: string[];
  preferredGender: string;
  petsAllowed: boolean;
  smokingAllowed: boolean;
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
  inclusions: [], facilities: [], preferredNationalities: [],
  preferredGender: 'any', petsAllowed: false, smokingAllowed: false,
  minimumStay: '', availableFrom: '', description: '',
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
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const { add } = usePostedListings();

  function set(key: keyof FormData, value: FormData[keyof FormData]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function toggleList(key: 'inclusions' | 'facilities' | 'preferredNationalities', value: string) {
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
    if (!form.postcode) errs.postcode = 'Required';
    if (!form.address) errs.address = 'Required';
    if (!form.rentAmount) errs.rentAmount = 'Required';
    if (!form.totalCapacity) errs.totalCapacity = 'Required';
    if (!form.availableFrom) errs.availableFrom = 'Required';
    if (!form.description || form.description.trim().length < 20) errs.description = 'Please write at least 20 characters';
    if (!form.contactName) errs.contactName = 'Required';
    if (!form.contactEmail) errs.contactEmail = 'Required';
    if (form.contactEmail && !form.contactEmail.includes('@')) errs.contactEmail = 'Invalid email';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Post a Listing</h1>
        <p className="text-slate-500 text-sm">Fill in your property details to reach thousands of potential tenants.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* 1. Property Details */}
        <Section title="1. Property Details">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label required>Property Type</Label>
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
                <option value="partially furnished">Partially furnished</option>
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
        </Section>

        {/* 7. Tenant Preferences */}
        <Section title="7. Tenant Preferences">
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

        {/* 8. Availability */}
        <Section title="8. Availability">
          <div>
            <Label required>Available From</Label>
            <input type="date" value={form.availableFrom} onChange={(e) => set('availableFrom', e.target.value)} className={inputClass} />
            {errors.availableFrom && <p className="text-red-500 text-xs mt-1">{errors.availableFrom}</p>}
          </div>
        </Section>

        {/* 9. Description */}
        <Section title="9. Description">
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
              {errors.description ? <p className="text-red-500 text-xs">{errors.description}</p> : <span />}
              <span className="text-xs text-slate-400">{form.description.length} characters</span>
            </div>
          </div>
        </Section>

        {/* 10. Contact Info */}
        <Section title="10. Contact Info">
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
  );
}
