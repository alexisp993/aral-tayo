create or replace function public.record_quiz_answer(
  p_session_id uuid, p_student_id uuid, p_question_id text, p_response jsonb
) returns boolean language plpgsql security definer set search_path = public as $$
begin
  update public.quiz_sessions set answers_json = answers_json || jsonb_build_object(p_question_id, p_response)
  where id = p_session_id and student_id = p_student_id and status = 'in_progress'
    and question_ids ? p_question_id and not (answers_json ? p_question_id);
  return found;
end;
$$;
revoke all on function public.record_quiz_answer(uuid, uuid, text, jsonb) from public;
grant execute on function public.record_quiz_answer(uuid, uuid, text, jsonb) to service_role;
