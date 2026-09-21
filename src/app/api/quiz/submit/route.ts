import { NextResponse } from "next/server";
import { z } from "zod";

import { getAuthenticatedUser } from "@/lib/authenticated-user";
import { gradeQuiz } from "@/lib/quiz";
import { createAdminClient } from "@/lib/supabase/admin";

const bodySchema = z.object({
  sessionId: z.uuid(),
  answers: z.record(z.string(), z.string()),
});

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json(
      { error: "Invalid quiz submission." },
      { status: 400 },
    );

  const user = await getAuthenticatedUser(request);
  if (!user)
    return NextResponse.json(
      { error: "Sign in to submit the quiz." },
      { status: 401 },
    );

  const admin = createAdminClient();
  const { data: session, error: sessionError } = await admin
    .from("quiz_sessions")
    .select("id,student_id,question_ids,status,score,correct_count,xp_awarded")
    .eq("id", parsed.data.sessionId)
    .eq("student_id", user.id)
    .maybeSingle();
  if (sessionError || !session)
    return NextResponse.json(
      { error: "Quiz session not found." },
      { status: 404 },
    );

  if (session.status === "completed")
    return NextResponse.json({
      score: session.score,
      correctCount: session.correct_count,
      xp: session.xp_awarded,
      alreadySubmitted: true,
    });

  const questionIds = Array.isArray(session.question_ids)
    ? session.question_ids.filter((id): id is string => typeof id === "string")
    : [];
  if (
    questionIds.length === 0 ||
    questionIds.some((id) => !parsed.data.answers[id])
  )
    return NextResponse.json(
      { error: "Answer every question before submitting." },
      { status: 400 },
    );

  const result = gradeQuiz(questionIds, parsed.data.answers);
  const { data: applied, error: completionError } = await admin.rpc(
    "complete_quiz_session",
    {
      p_session_id: session.id,
      p_student_id: user.id,
      p_answers: parsed.data.answers,
      p_score: result.score,
      p_correct_count: result.correctCount,
      p_xp: result.xp,
    },
  );
  if (completionError)
    return NextResponse.json(
      { error: "Could not save the quiz result." },
      { status: 500 },
    );
  if (!applied)
    return NextResponse.json(
      { error: "This quiz was already submitted." },
      { status: 409 },
    );

  const achievements = [
    "first_quiz",
    ...(result.score === 100 ? ["perfect_score"] : []),
  ];
  await admin.from("learner_achievements").upsert(
    achievements.map((achievementKey) => ({
      student_id: user.id,
      achievement_key: achievementKey,
    })),
    { onConflict: "student_id,achievement_key", ignoreDuplicates: true },
  );

  return NextResponse.json({ ...result, achievements });
}
