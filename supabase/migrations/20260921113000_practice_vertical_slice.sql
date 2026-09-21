create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Learner',
  created_at timestamptz not null default now()
);

create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$ begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', 'Learner'));
  return new;
end; $$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create table public.lesson_progress (
  student_id uuid not null references public.profiles(id) on delete cascade,
  lesson_slug text not null,
  learn_completed_at timestamptz,
  flashcards_completed_at timestamptz,
  practice_completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (student_id, lesson_slug)
);

create table public.practice_attempts (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null unique,
  student_id uuid not null references public.profiles(id) on delete cascade,
  lesson_slug text not null,
  activity_key text not null,
  activity_version integer not null check (activity_version >= 1),
  response_json jsonb not null,
  is_correct boolean not null,
  score_fraction numeric(3,2) not null check (score_fraction between 0 and 1),
  attempts_used integer not null check (attempts_used >= 1),
  hint_used boolean not null default false,
  completed_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.practice_attempts enable row level security;

create policy "profiles are private" on public.profiles for select using (auth.uid() = id);
create policy "students read own progress" on public.lesson_progress for select using (auth.uid() = student_id);
create policy "students read own attempts" on public.practice_attempts for select using (auth.uid() = student_id);

create index practice_attempts_student_activity_idx on public.practice_attempts(student_id, activity_key, completed_at desc);
