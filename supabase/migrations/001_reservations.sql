-- Kōhī House — reservations table (run in Supabase SQL Editor or via CLI)

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  booking_ref text not null unique,
  reservation_date date not null,
  reservation_time text not null,
  guests smallint not null check (guests >= 1 and guests <= 10),
  occasion text not null default 'coffee',
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  notes text,
  dietary text[] not null default '{}',
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists reservations_date_idx
  on public.reservations (reservation_date desc);

create index if not exists reservations_created_at_idx
  on public.reservations (created_at desc);

alter table public.reservations enable row level security;

-- Public site: guests may create reservations only (anon key)
drop policy if exists "Allow anonymous reservation inserts" on public.reservations;
create policy "Allow anonymous reservation inserts"
  on public.reservations
  for insert
  to anon
  with check (true);

-- Staff read/update via service role or authenticated dashboard users (add later)
