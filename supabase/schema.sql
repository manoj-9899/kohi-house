-- Kōhī House — reservations table
-- Run in Supabase Dashboard → SQL Editor

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  booking_ref text not null unique,
  reservation_date date not null,
  reservation_time text not null,
  is_custom_time boolean not null default false,
  guests smallint not null check (guests >= 1 and guests <= 10),
  occasion text not null,
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

create index if not exists idx_reservations_date on public.reservations (reservation_date desc);
create index if not exists idx_reservations_email on public.reservations (email);
create index if not exists idx_reservations_created on public.reservations (created_at desc);

alter table public.reservations enable row level security;

drop policy if exists "Public can insert reservations" on public.reservations;
create policy "Public can insert reservations"
  on public.reservations
  for insert
  to anon, authenticated
  with check (true);

-- No SELECT/UPDATE/DELETE for anon — view bookings in Supabase Dashboard (service role) or add staff auth later.
