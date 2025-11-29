create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  message text not null,
  created_at timestamptz default now()
);

alter table public.feedback enable row level security;

create policy "Anyone authenticated can insert feedback"
  on public.feedback
  for insert
  to authenticated
  with check (auth.uid() = user_id);