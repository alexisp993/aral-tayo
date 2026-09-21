alter table public.lesson_progress
  add column if not exists quiz_completed_at timestamptz;

create table if not exists public.quiz_sessions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  lesson_slug text not null,
  question_ids jsonb not null check (jsonb_typeof(question_ids) = 'array'),
  status text not null default 'in_progress' check (status in ('in_progress', 'completed')),
  answers_json jsonb not null default '{}'::jsonb,
  score integer check (score between 0 and 100),
  correct_count integer check (correct_count >= 0),
  total_questions integer not null check (total_questions > 0),
  xp_awarded integer not null default 0 check (xp_awarded >= 0),
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.learner_stats (
  student_id uuid primary key references public.profiles(id) on delete cascade,
  xp_total integer not null default 0 check (xp_total >= 0),
  quizzes_completed integer not null default 0 check (quizzes_completed >= 0),
  best_quiz_score integer not null default 0 check (best_quiz_score between 0 and 100),
  current_streak integer not null default 0 check (current_streak >= 0),
  best_streak integer not null default 0 check (best_streak >= 0),
  last_activity_date date,
  updated_at timestamptz not null default now()
);

create table if not exists public.learner_achievements (
  student_id uuid not null references public.profiles(id) on delete cascade,
  achievement_key text not null,
  awarded_at timestamptz not null default now(),
  primary key (student_id, achievement_key)
);

alter table public.quiz_sessions enable row level security;
alter table public.learner_stats enable row level security;
alter table public.learner_achievements enable row level security;

create policy "students read own quiz sessions"
  on public.quiz_sessions for select using (auth.uid() = student_id);
create policy "students read own stats"
  on public.learner_stats for select using (auth.uid() = student_id);
create policy "students read own achievements"
  on public.learner_achievements for select using (auth.uid() = student_id);

create index if not exists quiz_sessions_student_lesson_idx
  on public.quiz_sessions(student_id, lesson_slug, started_at desc);
create index if not exists learner_stats_xp_idx
  on public.learner_stats(xp_total desc);

create or replace function public.complete_quiz_session(
  p_session_id uuid,
  p_student_id uuid,
  p_answers jsonb,
  p_score integer,
  p_correct_count integer,
  p_xp integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  applied boolean;
begin
  update public.quiz_sessions
  set status = 'completed',
      answers_json = p_answers,
      score = p_score,
      correct_count = p_correct_count,
      xp_awarded = p_xp,
      completed_at = now()
  where id = p_session_id
    and student_id = p_student_id
    and status = 'in_progress';

  applied := found;
  if not applied then
    return false;
  end if;

  insert into public.learner_stats (
    student_id, xp_total, quizzes_completed, best_quiz_score,
    current_streak, best_streak, last_activity_date
  ) values (
    p_student_id, p_xp, 1, p_score, 1, 1, current_date
  )
  on conflict (student_id) do update set
    xp_total = learner_stats.xp_total + excluded.xp_total,
    quizzes_completed = learner_stats.quizzes_completed + 1,
    best_quiz_score = greatest(learner_stats.best_quiz_score, excluded.best_quiz_score),
    current_streak = case
      when learner_stats.last_activity_date = current_date then learner_stats.current_streak
      when learner_stats.last_activity_date = current_date - 1 then learner_stats.current_streak + 1
      else 1
    end,
    best_streak = greatest(
      learner_stats.best_streak,
      case
        when learner_stats.last_activity_date = current_date then learner_stats.current_streak
        when learner_stats.last_activity_date = current_date - 1 then learner_stats.current_streak + 1
        else 1
      end
    ),
    last_activity_date = current_date,
    updated_at = now();

  insert into public.lesson_progress (student_id, lesson_slug, quiz_completed_at)
  select p_student_id, lesson_slug, now()
  from public.quiz_sessions where id = p_session_id
  on conflict (student_id, lesson_slug) do update set
    quiz_completed_at = coalesce(lesson_progress.quiz_completed_at, excluded.quiz_completed_at),
    updated_at = now();

  return true;
end;
$$;

revoke all on function public.complete_quiz_session(uuid, uuid, jsonb, integer, integer, integer) from public;
grant execute on function public.complete_quiz_session(uuid, uuid, jsonb, integer, integer, integer) to service_role;
