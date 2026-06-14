-- Email queue for retries and future drip campaigns
-- Run after 002_newsletter_subscribers.sql

create table if not exists public.newsletter_email_queue (
  id uuid primary key default gen_random_uuid(),
  subscriber_id uuid not null references public.newsletter_subscribers (id) on delete cascade,
  template text not null,
  vars jsonb not null default '{}',
  scheduled_for timestamptz not null default now(),
  attempts smallint not null default 0,
  max_attempts smallint not null default 3,
  last_error text,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_newsletter_email_queue_pending
  on public.newsletter_email_queue (scheduled_for)
  where sent_at is null and attempts < max_attempts;

alter table public.newsletter_email_queue enable row level security;
