-- Kōhī Club newsletter subscribers
-- Run in Supabase SQL Editor after 001_reservations.sql

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  first_name text,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'unsubscribed', 'blocked')),
  source text not null default 'website',
  welcome_email_sent boolean not null default false,
  last_email_sent timestamptz,
  confirmation_token text unique,
  confirmation_sent_at timestamptz,
  confirmed_at timestamptz,
  subscribed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint newsletter_subscribers_email_unique unique (email)
);

create index if not exists idx_newsletter_subscribers_status
  on public.newsletter_subscribers (status);

create index if not exists idx_newsletter_subscribers_email_lower
  on public.newsletter_subscribers (lower(email));

create index if not exists idx_newsletter_subscribers_created
  on public.newsletter_subscribers (created_at desc);

-- Rate limiting (server-side via service role)
create table if not exists public.newsletter_rate_limits (
  id uuid primary key default gen_random_uuid(),
  ip_hash text not null,
  attempted_at timestamptz not null default now()
);

create index if not exists idx_newsletter_rate_limits_ip_time
  on public.newsletter_rate_limits (ip_hash, attempted_at desc);

alter table public.newsletter_subscribers enable row level security;
alter table public.newsletter_rate_limits enable row level security;

-- No public access — all writes via Netlify Functions (service role)

create or replace function public.set_newsletter_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists newsletter_subscribers_updated_at on public.newsletter_subscribers;
create trigger newsletter_subscribers_updated_at
  before update on public.newsletter_subscribers
  for each row execute function public.set_newsletter_updated_at();
