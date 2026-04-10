-- profiles: extends auth.users
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'renter' CHECK (role IN ('renter', 'subletter')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- listings
CREATE TABLE IF NOT EXISTS listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  suburb TEXT NOT NULL DEFAULT '',
  postcode TEXT DEFAULT '',
  address TEXT DEFAULT '',
  rent_amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'AUD',
  rent_period TEXT DEFAULT 'week',
  bedrooms INTEGER NOT NULL DEFAULT 1,
  bathrooms INTEGER NOT NULL DEFAULT 1,
  current_occupants INTEGER DEFAULT 0,
  total_capacity INTEGER DEFAULT 2,
  furnished TEXT DEFAULT 'unfurnished',
  facilities TEXT[] DEFAULT '{}',
  room_features TEXT[] DEFAULT '{}',
  room_categories TEXT[] DEFAULT '{}',
  inclusions TEXT[] DEFAULT '{}',
  preferred_nationality TEXT[] DEFAULT '{}',
  preferred_gender TEXT DEFAULT 'any',
  pets_allowed BOOLEAN DEFAULT false,
  smoking_allowed BOOLEAN DEFAULT false,
  available_from DATE,
  minimum_stay TEXT DEFAULT '',
  stay_type TEXT,
  rules TEXT[] DEFAULT '{}',
  description TEXT DEFAULT '',
  images TEXT[] DEFAULT '{}',
  post_language TEXT,
  languages TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'taken', 'expired')),
  featured BOOLEAN DEFAULT false,
  posted_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- jobs
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT 'casual',
  state TEXT NOT NULL DEFAULT '',
  suburb TEXT DEFAULT '',
  city TEXT DEFAULT '',
  description TEXT DEFAULT '',
  pay TEXT DEFAULT '',
  contact_email TEXT DEFAULT '',
  contact_phone TEXT DEFAULT '',
  post_language TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'expired')),
  posted_at TIMESTAMPTZ DEFAULT NOW()
);

-- takeovers
CREATE TABLE IF NOT EXISTS takeovers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT DEFAULT '',
  property_type TEXT DEFAULT 'apartment',
  state TEXT DEFAULT '',
  city TEXT DEFAULT '',
  suburb TEXT DEFAULT '',
  postcode TEXT DEFAULT '',
  address TEXT DEFAULT '',
  rent_amount NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'AUD',
  rent_period TEXT DEFAULT 'week',
  bedrooms INTEGER DEFAULT 1,
  bathrooms INTEGER DEFAULT 1,
  furnished TEXT DEFAULT 'unfurnished',
  available_from DATE,
  lease_end DATE,
  description TEXT DEFAULT '',
  images TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'taken')),
  posted_at TIMESTAMPTZ DEFAULT NOW()
);

-- renter_profiles
CREATE TABLE IF NOT EXISTS renter_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  age INTEGER,
  gender TEXT DEFAULT '',
  nationality TEXT DEFAULT '',
  occupation TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  budget_min INTEGER DEFAULT 0,
  budget_max INTEGER DEFAULT 0,
  room_type TEXT DEFAULT '',
  move_in_date DATE,
  preferred_state TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  verified BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  avatar_url TEXT,
  profile_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- favorites (listing_id is TEXT to support both seed + real listing IDs)
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  listing_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

-- shortlist (renter_profile_id is TEXT for same reason)
CREATE TABLE IF NOT EXISTS shortlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  renter_profile_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, renter_profile_id)
);

-- comments
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_name TEXT NOT NULL DEFAULT '',
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- reactions
CREATE TABLE IF NOT EXISTS reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, listing_id, emoji)
);

-- reports
CREATE TABLE IF NOT EXISTS reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id TEXT NOT NULL,
  listing_title TEXT DEFAULT '',
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reason TEXT NOT NULL,
  details TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- push_subscriptions
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth_key TEXT NOT NULL,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'renter')
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE takeovers ENABLE ROW LEVEL SECURITY;
ALTER TABLE renter_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE shortlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- profiles RLS
CREATE POLICY "profiles: public read" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles: own write" ON profiles FOR ALL USING (auth.uid() = id);

-- listings RLS
CREATE POLICY "listings: public read active" ON listings FOR SELECT USING (status = 'active' OR auth.uid() = user_id);
CREATE POLICY "listings: auth insert" ON listings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "listings: own update" ON listings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "listings: own delete" ON listings FOR DELETE USING (auth.uid() = user_id);

-- jobs RLS
CREATE POLICY "jobs: public read" ON jobs FOR SELECT USING (status = 'active' OR auth.uid() = user_id);
CREATE POLICY "jobs: auth insert" ON jobs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "jobs: own update" ON jobs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "jobs: own delete" ON jobs FOR DELETE USING (auth.uid() = user_id);

-- takeovers RLS
CREATE POLICY "takeovers: public read" ON takeovers FOR SELECT USING (status = 'active' OR auth.uid() = user_id);
CREATE POLICY "takeovers: auth insert" ON takeovers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "takeovers: own update" ON takeovers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "takeovers: own delete" ON takeovers FOR DELETE USING (auth.uid() = user_id);

-- renter_profiles RLS
CREATE POLICY "renter_profiles: public read active" ON renter_profiles FOR SELECT USING (active = true OR auth.uid() = user_id);
CREATE POLICY "renter_profiles: auth insert" ON renter_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "renter_profiles: own update" ON renter_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "renter_profiles: own delete" ON renter_profiles FOR DELETE USING (auth.uid() = user_id);

-- favorites RLS
CREATE POLICY "favorites: own all" ON favorites FOR ALL USING (auth.uid() = user_id);

-- shortlist RLS
CREATE POLICY "shortlist: own all" ON shortlist FOR ALL USING (auth.uid() = user_id);

-- comments RLS
CREATE POLICY "comments: public read" ON comments FOR SELECT USING (true);
CREATE POLICY "comments: auth insert" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "comments: own delete" ON comments FOR DELETE USING (auth.uid() = user_id);

-- reactions RLS
CREATE POLICY "reactions: public read" ON reactions FOR SELECT USING (true);
CREATE POLICY "reactions: auth all" ON reactions FOR ALL USING (auth.uid() = user_id);

-- reports RLS
CREATE POLICY "reports: auth insert" ON reports FOR INSERT WITH CHECK (true);

-- push_subscriptions RLS
CREATE POLICY "push: own all" ON push_subscriptions FOR ALL USING (auth.uid() = user_id);
