'use client';
import { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  Camera, Save, Trash2, CheckCircle, MapPin, DollarSign,
  Calendar, Home, User, Sparkles,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRenterProfile } from '@/hooks/useRenterProfile';
import {
  AUSTRALIAN_STATES, NATIONALITIES, PROPERTY_TYPES,
  FACILITIES_LIST, MIN_STAY_OPTIONS, RoomType,
} from '@/lib/types';
import { RenterAvatar } from '@/components/RenterCard';
import CustomTagInput from '@/components/CustomTagInput';

// ── helpers ──────────────────────────────────────────────────────────────────

function resizeToDataURL(file: File, maxPx = 300): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = reject;
      img.src = ev.target!.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ── page ─────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { profile, loaded, save, clear } = useRenterProfile();
  const fileRef = useRef<HTMLInputElement>(null);
  const [saved, setSaved] = useState(false);

  // Form state
  const [photo, setPhoto] = useState<string | null>(null);
  const [age, setAge] = useState('');
  const [nationality, setNationality] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [preferredRoomTypes, setPreferredRoomTypes] = useState<RoomType[]>([]);
  const [preferredStates, setPreferredStates] = useState<string[]>([]);
  const [preferredCities, setPreferredCities] = useState<string[]>([]);
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [moveInDate, setMoveInDate] = useState('');
  const [minimumStay, setMinimumStay] = useState('');
  const [preferredStayType, setPreferredStayType] = useState<'short term' | 'long term' | 'any'>('any');
  const [preferredFacilities, setPreferredFacilities] = useState<string[]>([]);
  const [customFacilities, setCustomFacilities] = useState<string[]>([]);
  const [furnishedPreference, setFurnishedPreference] = useState<'furnished' | 'unfurnished' | 'any'>('any');
  const [houseGenderPreference, setHouseGenderPreference] = useState<'male' | 'female' | 'any'>('any');
  const [petsOk, setPetsOk] = useState(false);
  const [smokingOk, setSmokingOk] = useState(false);

  // Redirect if not a renter
  useEffect(() => {
    if (!loading && !user) router.push('/auth/signin?from=/profile');
    if (!loading && user && user.role !== 'renter') router.push('/dashboard');
  }, [loading, user, router]);

  // Pre-fill form from existing profile
  useEffect(() => {
    if (!loaded || !profile) return;
    setPhoto(profile.photo);
    setAge(profile.age?.toString() ?? '');
    setNationality(profile.nationality);
    setAboutMe(profile.aboutMe);
    setPreferredRoomTypes(profile.preferredRoomTypes);
    setPreferredStates(profile.preferredStates);
    setPreferredCities(profile.preferredCities);
    setBudgetMin(profile.budgetMin?.toString() ?? '');
    setBudgetMax(profile.budgetMax?.toString() ?? '');
    setMoveInDate(profile.moveInDate ?? '');
    setMinimumStay(profile.minimumStay);
    setPreferredStayType(profile.preferredStayType ?? 'any');
    setPreferredFacilities(profile.preferredFacilities.filter((f) => FACILITIES_LIST.includes(f)));
    setCustomFacilities(profile.preferredFacilities.filter((f) => !FACILITIES_LIST.includes(f)));
    setFurnishedPreference(profile.furnishedPreference);
    setHouseGenderPreference(profile.houseGenderPreference);
    setPetsOk(profile.petsOk);
    setSmokingOk(profile.smokingOk);
  }, [loaded, profile]);

  async function handlePhoto(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await resizeToDataURL(file, 300);
      setPhoto(dataUrl);
    } catch {
      alert('Could not process image. Please try another file.');
    }
  }

  function toggleArray<T>(arr: T[], item: T): T[] {
    return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
  }

  function toggleState(abbr: string) {
    const next = toggleArray(preferredStates, abbr);
    setPreferredStates(next);
    // Remove cities that belong to removed states
    const validCities = AUSTRALIAN_STATES.filter((s) => next.includes(s.abbr)).flatMap((s) => s.cities);
    setPreferredCities((prev) => prev.filter((c) => validCities.includes(c)));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    save({
      photo,
      age: age ? Number(age) : null,
      nationality,
      aboutMe,
      preferredRoomTypes,
      preferredStates,
      preferredCities,
      budgetMin: budgetMin ? Number(budgetMin) : null,
      budgetMax: budgetMax ? Number(budgetMax) : null,
      moveInDate: moveInDate || null,
      minimumStay,
      preferredStayType,
      preferredFacilities: [...preferredFacilities, ...customFacilities],
      furnishedPreference,
      houseGenderPreference,
      petsOk,
      smokingOk,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (loading || !loaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const availableCities = AUSTRALIAN_STATES
    .filter((s) => preferredStates.includes(s.abbr))
    .flatMap((s) => s.cities);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-teal-50 rounded-xl">
          <Sparkles className="w-6 h-6 text-teal-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Renter Profile</h1>
          <p className="text-sm text-slate-500">Help subletters find the right tenant — that&apos;s you.</p>
        </div>
      </div>

      {/* Success banner */}
      {saved && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm font-medium rounded-xl px-4 py-3 mb-6">
          <CheckCircle className="w-4 h-4 shrink-0" />
          Profile saved! Subletters can now find you at /renters.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* ── Personal info ───────────────────────────────────────────────── */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
            <User className="w-4 h-4 text-teal-600" /> About Me
          </h2>

          {/* Photo */}
          <div className="flex items-center gap-5 mb-6">
            <div className="relative">
              {photo ? (
                <img src={photo} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-slate-200" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white text-2xl font-bold border-2 border-slate-200">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
              )}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 p-1.5 bg-teal-600 rounded-full text-white hover:bg-teal-700 transition-colors"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 mb-1">Profile photo</p>
              <p className="text-xs text-slate-400 mb-2">JPG or PNG, max 5 MB. Will be resized to 300×300px.</p>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="text-xs text-teal-600 font-medium hover:text-teal-800 transition-colors"
              >
                Upload photo
              </button>
              {photo && (
                <button
                  type="button"
                  onClick={() => setPhoto(null)}
                  className="ml-3 text-xs text-red-500 hover:text-red-700 transition-colors"
                >
                  Remove
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <input
                type="text"
                value={user?.name ?? ''}
                disabled
                className="w-full text-sm border border-slate-200 rounded-lg py-2.5 px-3 bg-slate-50 text-slate-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Age</label>
              <input
                type="number"
                min="18"
                max="99"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 25"
                className="w-full text-sm border border-slate-200 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nationality</label>
              <select
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className="w-full text-sm border border-slate-200 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              >
                <option value="">Select nationality</option>
                {NATIONALITIES.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">About me</label>
            <textarea
              value={aboutMe}
              onChange={(e) => setAboutMe(e.target.value)}
              rows={4}
              placeholder="Tell potential hosts about yourself — your lifestyle, work/study, habits, and what you bring to a household..."
              className="w-full text-sm border border-slate-200 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-none"
            />
          </div>
        </section>

        {/* ── What I'm looking for ────────────────────────────────────────── */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
            <Home className="w-4 h-4 text-teal-600" /> What I&apos;m Looking For
          </h2>

          {/* Room types */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-slate-700 mb-2">Accommodation type</label>
            <div className="flex flex-wrap gap-2">
              {PROPERTY_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setPreferredRoomTypes((prev) => toggleArray(prev, t as RoomType))}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-all capitalize ${
                    preferredRoomTypes.includes(t as RoomType)
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-teal-400'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* States */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <MapPin className="w-3.5 h-3.5 inline mr-1 text-teal-500" />
              Preferred state(s)
            </label>
            <div className="flex flex-wrap gap-2">
              {AUSTRALIAN_STATES.map((s) => (
                <button
                  key={s.abbr}
                  type="button"
                  onClick={() => toggleState(s.abbr)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                    preferredStates.includes(s.abbr)
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-teal-400'
                  }`}
                >
                  {s.abbr}
                </button>
              ))}
            </div>
          </div>

          {/* Cities (shown only when states selected) */}
          {availableCities.length > 0 && (
            <div className="mb-5">
              <label className="block text-sm font-medium text-slate-700 mb-2">Preferred city/cities</label>
              <div className="flex flex-wrap gap-2">
                {availableCities.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setPreferredCities((prev) => toggleArray(prev, c))}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                      preferredCities.includes(c)
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-teal-400'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Budget */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                <DollarSign className="w-3.5 h-3.5 inline text-teal-500" />
                Min budget (AUD/week)
              </label>
              <input
                type="number"
                min="0"
                value={budgetMin}
                onChange={(e) => setBudgetMin(e.target.value)}
                placeholder="e.g. 200"
                className="w-full text-sm border border-slate-200 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Max budget (AUD/week) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                required
                value={budgetMax}
                onChange={(e) => setBudgetMax(e.target.value)}
                placeholder="e.g. 400"
                className="w-full text-sm border border-slate-200 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>
          </div>

          {/* Stay type preference */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-slate-700 mb-2">Preferred stay type</label>
            <div className="flex gap-2 flex-wrap">
              {(['short term', 'long term', 'any'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setPreferredStayType(opt)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all capitalize ${
                    preferredStayType === opt
                      ? opt === 'short term' ? 'bg-blue-600 text-white border-blue-600'
                        : opt === 'long term' ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-600 text-white border-slate-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-teal-400'
                  }`}
                >
                  {opt === 'short term' ? '⚡ Short term' : opt === 'long term' ? '🏠 Long term' : '✦ Any'}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-1.5">Short term = under 3 months · Long term = 3 months or more</p>
          </div>

          {/* Move-in & min stay */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                <Calendar className="w-3.5 h-3.5 inline text-teal-500" />
                Move-in date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={moveInDate}
                onChange={(e) => setMoveInDate(e.target.value)}
                className="w-full text-sm border border-slate-200 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Minimum stay</label>
              <select
                value={minimumStay}
                onChange={(e) => setMinimumStay(e.target.value)}
                className="w-full text-sm border border-slate-200 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              >
                <option value="">Select…</option>
                {MIN_STAY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>
        </section>

        {/* ── Preferences ─────────────────────────────────────────────────── */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600" /> Preferences
          </h2>

          {/* Facilities */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-slate-700 mb-2">Desired facilities</label>
            <div className="flex flex-wrap gap-2">
              {FACILITIES_LIST.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setPreferredFacilities((prev) => toggleArray(prev, f))}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                    preferredFacilities.includes(f)
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-teal-400'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <CustomTagInput
              items={customFacilities}
              onChange={setCustomFacilities}
              existingSelected={preferredFacilities}
              placeholder="e.g. Study room, Bike storage…"
            />
          </div>

          {/* Furnished */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-slate-700 mb-2">Furnished preference</label>
            <div className="flex gap-2">
              {(['furnished', 'unfurnished', 'any'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setFurnishedPreference(opt)}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg border capitalize transition-all ${
                    furnishedPreference === opt
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-teal-400'
                  }`}
                >
                  {opt === 'any' ? 'No preference' : opt}
                </button>
              ))}
            </div>
          </div>

          {/* Gender preference of housemates */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-slate-700 mb-2">Preferred housemate gender</label>
            <div className="flex gap-2">
              {(['any', 'female', 'male'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setHouseGenderPreference(opt)}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg border capitalize transition-all ${
                    houseGenderPreference === opt
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-teal-400'
                  }`}
                >
                  {opt === 'any' ? 'Any' : opt === 'female' ? 'Female house' : 'Male house'}
                </button>
              ))}
            </div>
          </div>

          {/* Pets & Smoking */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={petsOk}
                onChange={(e) => setPetsOk(e.target.checked)}
                className="w-4 h-4 rounded text-teal-600 border-slate-300 focus:ring-teal-500"
              />
              <span className="text-sm text-slate-700 font-medium">Pets OK</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={smokingOk}
                onChange={(e) => setSmokingOk(e.target.checked)}
                className="w-4 h-4 rounded text-teal-600 border-slate-300 focus:ring-teal-500"
              />
              <span className="text-sm text-slate-700 font-medium">Smoking OK</span>
            </label>
          </div>
        </section>

        {/* ── Actions ─────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => { if (confirm('Remove your profile? Subletters will no longer be able to find you.')) clear(); }}
            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            {profile ? 'Delete profile' : ''}
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 bg-teal-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-teal-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save profile
          </button>
        </div>
      </form>
    </div>
  );
}
