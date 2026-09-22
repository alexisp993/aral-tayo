import { NextResponse } from "next/server";
import { isLessonSlug } from "@/lib/lesson-content";
import { getAuthenticatedUser } from "@/lib/authenticated-user";
import {
  evaluateQuizAnswer,
  findQuestion,
  isAnswerShape,
  publicQuestion,
} from "@/lib/quiz";
import { createAdminClient } from "@/lib/supabase/admin";
export async function GET(request: Request) {
  const user = await getAuthenticatedUser(request);
  if (!user)
    return NextResponse.json({ error: "Sign in to resume." }, { status: 401 });
  const lessonSlug = new URL(request.url).searchParams.get("lessonSlug");
  if (!lessonSlug || !isLessonSlug(lessonSlug))
    return NextResponse.json({ error: "Invalid lesson." }, { status: 400 });
  const { data: session, error } = await createAdminClient()
    .from("quiz_sessions")
    .select("id,question_ids,answers_json")
    .eq("student_id", user.id)
    .eq("lesson_slug", lessonSlug)
    .eq("status", "in_progress")
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error)
    return NextResponse.json(
      { error: "Could not restore quiz." },
      { status: 500 },
    );
  if (!session) return new NextResponse(null, { status: 204 });
  const ids = Array.isArray(session.question_ids)
    ? session.question_ids.filter((id): id is string => typeof id === "string")
    : [];
  const questions = ids.map(findQuestion);
  if (ids.length !== 5 || questions.some((q) => !q))
    return NextResponse.json(
      { error: "Quiz session is invalid." },
      { status: 409 },
    );
  if (
    session.answers_json !== null &&
    session.answers_json !== undefined &&
    (typeof session.answers_json !== "object" ||
      Array.isArray(session.answers_json))
  )
    return NextResponse.json(
      { error: "Saved quiz answers are invalid." },
      { status: 409 },
    );
  const answers = (session.answers_json ?? {}) as Record<string, unknown>;
  const resolved = questions.filter((q): q is NonNullable<typeof q> =>
    Boolean(q),
  );
  const invalidAnswer = resolved.find(
    (question) =>
      answers[question.id] !== undefined &&
      !isAnswerShape(question, answers[question.id]),
  );
  if (invalidAnswer)
    return NextResponse.json(
      { error: "Saved quiz answer is invalid." },
      { status: 409 },
    );
  const first = ids.findIndex((id) => answers[id] === undefined);
  return NextResponse.json({
    sessionId: session.id,
    questions: resolved.map(publicQuestion),
    locked: Object.fromEntries(
      resolved
        .filter((q) => answers[q.id] !== undefined)
        .map((q) => [q.id, evaluateQuizAnswer(q, answers[q.id] as never)]),
    ),
    index: first === -1 ? ids.length : first,
  });
}
