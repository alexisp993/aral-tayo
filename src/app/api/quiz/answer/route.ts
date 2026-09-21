import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthenticatedUser } from "@/lib/authenticated-user";
import { evaluateQuizAnswer, findQuestion, isAnswerShape } from "@/lib/quiz";
import { createAdminClient } from "@/lib/supabase/admin";
const schema = z.object({
  sessionId: z.uuid(),
  questionId: z.string(),
  response: z.union([
    z.string(),
    z.array(z.string()),
    z.record(z.string(), z.string()),
  ]),
});
export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid answer." }, { status: 400 });
  const user = await getAuthenticatedUser(request);
  if (!user)
    return NextResponse.json({ error: "Sign in to answer." }, { status: 401 });
  const question = findQuestion(parsed.data.questionId);
  if (!question || !isAnswerShape(question, parsed.data.response))
    return NextResponse.json(
      { error: "Invalid response for this challenge." },
      { status: 400 },
    );
  const admin = createAdminClient();
  const { data: session, error: sessionError } = await admin
    .from("quiz_sessions")
    .select("question_ids,answers_json,status")
    .eq("id", parsed.data.sessionId)
    .eq("student_id", user.id)
    .maybeSingle();
  if (sessionError)
    return NextResponse.json(
      { error: "Could not load quiz session." },
      { status: 500 },
    );
  if (
    !session ||
    session.status !== "in_progress" ||
    !Array.isArray(session.question_ids) ||
    !session.question_ids.includes(question.id)
  )
    return NextResponse.json(
      { error: "Quiz session not found." },
      { status: 404 },
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
  const saved = (session.answers_json ?? {}) as Record<string, unknown>;
  const hasSavedAnswer = Object.hasOwn(saved, question.id);
  const response = hasSavedAnswer ? saved[question.id] : parsed.data.response;
  if (!isAnswerShape(question, response))
    return NextResponse.json(
      { error: "Saved answer is invalid." },
      { status: 409 },
    );
  const result = evaluateQuizAnswer(question, response as never);
  if (!hasSavedAnswer) {
    const { data: applied, error } = await admin.rpc("record_quiz_answer", {
      p_session_id: parsed.data.sessionId,
      p_student_id: user.id,
      p_question_id: question.id,
      p_response: parsed.data.response,
    });
    if (error)
      return NextResponse.json(
        { error: "Could not save answer." },
        { status: 500 },
      );
    if (!applied) {
      const { data: fresh, error: freshError } = await admin
        .from("quiz_sessions")
        .select("answers_json")
        .eq("id", parsed.data.sessionId)
        .single();
      const original = (fresh?.answers_json as Record<string, unknown>)?.[
        question.id
      ];
      if (freshError || original === undefined)
        return NextResponse.json(
          { error: "Answer was not saved. Please try again." },
          { status: 409 },
        );
      if (!isAnswerShape(question, original))
        return NextResponse.json(
          { error: "Saved answer is invalid." },
          { status: 409 },
        );
      return NextResponse.json({
        ...evaluateQuizAnswer(question, original as never),
        alreadyAnswered: true,
      });
    }
  }
  return NextResponse.json(result);
}
