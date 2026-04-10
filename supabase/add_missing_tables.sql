-- Events table
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  category text,
  date text,
  time text,
  location text,
  suburb text,
  city text,
  state text,
  description text,
  organizer text,
  contact_email text,
  contact_phone text,
  website text,
  is_free boolean default true,
  price numeric,
  currency text default 'AUD',
  image_url text,
  posted_at timestamptz default now(),
  updated_at timestamptz default now(),
  status text default 'active'
);
alter table public.events enable row level security;
create policy "Anyone can read events" on public.events for select using (true);
create policy "Users can insert their own events" on public.events for insert with check (auth.uid() = user_id);
create policy "Users can update their own events" on public.events for update using (auth.uid() = user_id);
create policy "Users can delete their own events" on public.events for delete using (auth.uid() = user_id);

-- Market items table
create table if not exists public.market_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  category text,
  condition text,
  price numeric,
  currency text default 'AUD',
  negotiable boolean default false,
  location text,
  suburb text,
  city text,
  state text,
  description text,
  seller_name text,
  contact_email text,
  contact_phone text,
  image_url text,
  posted_at timestamptz default now(),
  updated_at timestamptz default now(),
  status text default 'active'
);
alter table public.market_items enable row level security;
create policy "Anyone can read market_items" on public.market_items for select using (true);
create policy "Users can insert their own market_items" on public.market_items for insert with check (auth.uid() = user_id);
create policy "Users can update their own market_items" on public.market_items for update using (auth.uid() = user_id);
create policy "Users can delete their own market_items" on public.market_items for delete using (auth.uid() = user_id);

-- Businesses table
create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  category text,
  suburb text,
  city text,
  state text,
  address text,
  description text,
  owner_name text,
  contact_email text,
  contact_phone text,
  website text,
  opening_hours text,
  languages text[],
  image_url text,
  posted_at timestamptz default now(),
  updated_at timestamptz default now(),
  status text default 'active'
);
alter table public.businesses enable row level security;
create policy "Anyone can read businesses" on public.businesses for select using (true);
create policy "Users can insert their own businesses" on public.businesses for insert with check (auth.uid() = user_id);
create policy "Users can update their own businesses" on public.businesses for update using (auth.uid() = user_id);
create policy "Users can delete their own businesses" on public.businesses for delete using (auth.uid() = user_id);
