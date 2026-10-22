-- The new-guest discount. A guest counts as new the first time their email address sends a booking request from the website.
-- The website's server sends only a keyed hash of the address (HMAC with a server secret), never the address itself, so the
-- table holds no personal data and nobody without the secret can test whether an address is in it. ref ties the claim to the
-- chat it was made in, so every message in that one conversation keeps the discount.
create table public.discount_claims (
  email_hash text primary key check (email_hash ~ '^[0-9a-f]{64}$'),
  ref text check (ref is null or ref ~ '^[0-9a-f]{64}$'),
  claimed_at timestamptz not null default now()
);
alter table public.discount_claims enable row level security;
revoke all on public.discount_claims from anon, authenticated;
create policy "admins read claims" on public.discount_claims for select to authenticated using (public.is_admin());
grant select on public.discount_claims to authenticated;

-- True when the address has not claimed before (and records the claim), or when it claimed in this same conversation.
create or replace function public.claim_new_guest(p_email_hash text, p_ref text)
returns boolean language plpgsql security definer set search_path = '' as $$
declare existing text; inserted boolean;
begin
  if p_email_hash !~ '^[0-9a-f]{64}$' or (p_ref is not null and p_ref !~ '^[0-9a-f]{64}$') then return false; end if;
  insert into public.discount_claims (email_hash, ref) values (p_email_hash, p_ref) on conflict (email_hash) do nothing
  returning true into inserted;
  if inserted then return true; end if;
  select c.ref into existing from public.discount_claims c where c.email_hash = p_email_hash;
  return p_ref is not null and existing = p_ref;
end $$;
revoke all on function public.claim_new_guest(text, text) from public;
grant execute on function public.claim_new_guest(text, text) to anon, authenticated;

-- One new-guest discount at most; offers can be many.
create unique index discounts_one_new_customer on public.discounts (kind) where kind = 'new_customer';
