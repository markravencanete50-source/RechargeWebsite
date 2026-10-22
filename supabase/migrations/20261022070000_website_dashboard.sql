-- The website's own database (Supabase project "Recharge Website", separate from the Recharge app's): what the /admin dashboard
-- manages. The homes from Hostaway stay in the site's build (src/content/properties.json); this holds only what the team
-- changes on top of them, plus listings that exist only on the website, the discounts and the admin accounts.
--  * listing_overrides: per Hostaway listing, whether it shows, its featured place, and an edited title, description or
--    amenities (null means "as in Hostaway").
--  * website_listings: listings made in the dashboard, not in Hostaway (no live calendar: booking requests only).
--  * settings: the direct-booking discount. discounts: dated offers and the new-customer discount.
--  * admins: who may use /admin. Accounts are by invitation: after signing in, the dashboard calls claim_admin(), and an
--    email with an open invitation becomes an admin once its owner has confirmed the address, so an invitation cannot be
--    claimed by someone who does not own the mailbox. (No trigger on auth.users: Supabase's auth tables are left alone.)
--  * audit_log: every change, with who made it, written by triggers (the dashboard cannot skip it).
-- Anyone may read what the public site shows; only admins may change anything (row level security on every table).

create table public.admins (
  user_id uuid primary key references auth.users on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);
create table public.admin_invites (
  email text primary key check (email = lower(email) and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  invited_at timestamptz not null default now(),
  invited_by uuid references auth.users on delete set null,
  claimed_at timestamptz
);

create function public.is_admin() returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid())
$$;

-- Called by /admin after sign-in: an invited, confirmed email becomes an admin. Does nothing without an open invitation.
create function public.claim_admin() returns boolean language plpgsql security definer set search_path = '' as $$
declare me uuid := auth.uid(); addr text; verified text;
begin
  addr := lower(auth.jwt() ->> 'email');
  verified := auth.jwt() -> 'user_metadata' ->> 'email_verified';
  if me is null or addr is null then return false; end if;
  if exists (select 1 from public.admins a where a.user_id = me) then return true; end if;
  if verified is distinct from 'true' then return false; end if;
  if not exists (select 1 from public.admin_invites i where i.email = addr and i.claimed_at is null) then return false; end if;
  insert into public.admins (user_id, email) values (me, addr) on conflict (user_id) do nothing;
  update public.admin_invites set claimed_at = now() where email = addr;
  insert into public.audit_log (user_id, email, action, target, detail) values (me, addr, 'joined', 'admins:' || addr, null);
  return true;
end $$;
revoke execute on function public.claim_admin() from public, anon;
grant execute on function public.claim_admin() to authenticated;


create table public.listing_overrides (
  hostaway_id bigint primary key,
  published boolean not null default true,
  featured_rank integer check (featured_rank between 1 and 100),
  title text check (char_length(title) between 1 and 200),
  description text check (char_length(description) <= 20000),
  amenities text[] check (cardinality(amenities) <= 200),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users on delete set null
);

create table public.website_listings (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9][a-z0-9-]{1,119}$'),
  published boolean not null default false,
  featured_rank integer check (featured_rank between 1 and 100),
  data jsonb not null check (jsonb_typeof(data) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users on delete set null
);

create table public.settings (
  id integer primary key default 1 check (id = 1),
  direct_discount_pct numeric(5,2) not null default 10 check (direct_discount_pct between 0 and 50),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users on delete set null
);
insert into public.settings (id) values (1);

create table public.discounts (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('offer', 'new_customer')),
  label text not null check (char_length(label) between 1 and 80),
  percent numeric(5,2) not null check (percent > 0 and percent <= 50),
  starts_on date,
  ends_on date,
  region text check (char_length(region) <= 80),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users on delete set null,
  check (starts_on is null or ends_on is null or ends_on >= starts_on)
);

create table public.audit_log (
  id bigserial primary key,
  at timestamptz not null default now(),
  user_id uuid,
  email text,
  action text not null,
  target text not null,
  detail jsonb
);

-- Stamps who changed a row and when, and writes it to the audit log.
create function public.audit_change() returns trigger language plpgsql security definer set search_path = '' as $$
declare who uuid := auth.uid(); target text; row_after jsonb := case when tg_op = 'DELETE' then null else to_jsonb(new) end;
begin
  if tg_op <> 'DELETE' then
    new.updated_by := who;
    if tg_table_name <> 'admin_invites' then new.updated_at := now(); end if;
  end if;
  target := tg_table_name || ':' || coalesce(
    (case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end) ->> 'hostaway_id',
    (case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end) ->> 'slug',
    (case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end) ->> 'email',
    (case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end) ->> 'id', '');
  insert into public.audit_log (user_id, email, action, target, detail)
  values (who, (select a.email from public.admins a where a.user_id = who), lower(tg_op), target,
          jsonb_build_object('before', case when tg_op = 'INSERT' then null else to_jsonb(old) end, 'after', row_after));
  return case when tg_op = 'DELETE' then old else new end;
end $$;
create trigger audit before insert or update on public.listing_overrides for each row execute function public.audit_change();
create trigger audit before insert or update on public.website_listings for each row execute function public.audit_change();
create trigger audit before insert or update on public.settings for each row execute function public.audit_change();
create trigger audit before insert or update on public.discounts for each row execute function public.audit_change();
create function public.audit_delete() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.audit_log (user_id, email, action, target, detail)
  values (auth.uid(), (select a.email from public.admins a where a.user_id = auth.uid()), 'delete', tg_table_name, jsonb_build_object('before', to_jsonb(old)));
  return old;
end $$;
create trigger audit_delete after delete on public.listing_overrides for each row execute function public.audit_delete();
create trigger audit_delete after delete on public.website_listings for each row execute function public.audit_delete();
create trigger audit_delete after delete on public.discounts for each row execute function public.audit_delete();
create trigger audit_delete after delete on public.admin_invites for each row execute function public.audit_delete();
create function public.audit_invite() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.audit_log (user_id, email, action, target, detail)
  values (auth.uid(), (select a.email from public.admins a where a.user_id = auth.uid()), 'invite', 'admin_invites:' || new.email, null);
  return new;
end $$;
create trigger audit_invite after insert on public.admin_invites for each row execute function public.audit_invite();

-- Row level security: the public reads what the site shows; admins change things.
alter table public.admins enable row level security;
alter table public.admin_invites enable row level security;
alter table public.listing_overrides enable row level security;
alter table public.website_listings enable row level security;
alter table public.settings enable row level security;
alter table public.discounts enable row level security;
alter table public.audit_log enable row level security;

create policy "admins see the admin list" on public.admins for select to authenticated using (public.is_admin() or user_id = auth.uid());
create policy "admins remove admins" on public.admins for delete to authenticated using (public.is_admin() and user_id <> auth.uid());
create policy "admins manage invites" on public.admin_invites for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "anyone reads overrides" on public.listing_overrides for select to anon, authenticated using (true);
create policy "admins write overrides" on public.listing_overrides for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "anyone reads published listings" on public.website_listings for select to anon, authenticated using (published or public.is_admin());
create policy "admins write listings" on public.website_listings for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "anyone reads settings" on public.settings for select to anon, authenticated using (true);
create policy "admins update settings" on public.settings for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "anyone reads live discounts" on public.discounts for select to anon, authenticated using (active or public.is_admin());
create policy "admins write discounts" on public.discounts for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins read the log" on public.audit_log for select to authenticated using (public.is_admin());

revoke all on public.audit_log from anon;
revoke insert, update, delete on public.audit_log from authenticated;
revoke all on public.admin_invites, public.admins from anon;
revoke execute on function public.audit_change(), public.audit_delete(), public.audit_invite() from public, anon, authenticated;

-- Photos for website-only listings: anyone can view, only admins upload or remove.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('listing-photos', 'listing-photos', true, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;
create policy "admins upload listing photos" on storage.objects for insert to authenticated with check (bucket_id = 'listing-photos' and public.is_admin());
create policy "admins change listing photos" on storage.objects for update to authenticated using (bucket_id = 'listing-photos' and public.is_admin());
create policy "admins remove listing photos" on storage.objects for delete to authenticated using (bucket_id = 'listing-photos' and public.is_admin());
