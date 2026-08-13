-- Run this in the Supabase SQL editor (or alongside your bot's existing schema).
-- Written to by the website's Stripe webhook, read by the WhatsApp bot to
-- gate access before responding to any incoming message.

create table if not exists subscribers (
  phone text primary key,               -- E.164, e.g. +31612345678
  status text not null,                 -- 'trialing' | 'active' | 'inactive'
  customer_id text,                     -- Stripe customer id
  subscription_id text,                 -- Stripe subscription id
  last_failed_invoice text,
  updated_at timestamptz not null default now()
);

-- Row Level Security: only the service role (used server-side by the website's
-- webhook and, if applicable, your bot backend) can read/write. No anon access.
alter table subscribers enable row level security;
