-- saved_careers: one row per career a user saved to their shortlist.
-- Run in the Supabase SQL Editor (already applied to the PathFinder project
-- on 2026-11-12). Kept here so the database setup is documented in the repo.

create table public.saved_careers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  onet_code text not null,
  note text not null default '',
  created_at timestamptz not null default now(),
  unique (user_id, onet_code)
);

-- Lock the table the moment it exists: no policy = nobody can read or write.
alter table public.saved_careers enable row level security;

grant select, insert, update, delete on public.saved_careers to authenticated;

create policy "Users can read their own saved careers"
  on public.saved_careers for select to authenticated
  using (auth.uid() = user_id);

create policy "Users can save careers for themselves"
  on public.saved_careers for insert to authenticated
  with check (auth.uid() = user_id);

create policy "Users can edit their own notes"
  on public.saved_careers for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can remove their own saved careers"
  on public.saved_careers for delete to authenticated
  using (auth.uid() = user_id);
