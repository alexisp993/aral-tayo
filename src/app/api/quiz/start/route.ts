import { NextResponse } from "next/server";
import { z } from "zod";

import { getAuthenticatedUser } from "@/lib/authenticated-user";
import { getPracticeProgress } from "@/lib/practice-progress";
import {
  evaluateQuizAnswer,
  findQuestion,
  isAnswerShape,
  publicQuestion,
  selectQuizQuestions,
} from "@/lib/quiz";
import { createAdminClient } from "@/lib/supabase/admin";

const bodySchema = z.object({
  lessonSlug: z.literal("adding-fractions"),
});

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json(
      { error: "Invalid quiz request." },
      { status: 400 },
    );

  const user = await getAuthenticatedUser(request);
  if (!user)
    return NextResponse.json(
      { error: "Sign in to start the quiz." },
      { status: 401 },
    );

  try {
    const practice = await getPracticeProgress(user.id);
    if (!practice.practiceCompleted)
      return NextResponse.json(
        {
          error: `Complete ${practice.requiredCorrect} practice activities correctly to unlock the quiz.`,
          ...practice,
        },
        { status: 403 },
      );

    const admin = createAdminClient();
    const { data: existing } = await admin.from("quiz_sessions").select("id,question_ids,answers_json").eq("student_id", user.id).eq("lesson_slug", parsed.data.lessonSlug).eq("status", "in_progress").order("started_at", { ascending: false }).limit(1).maybeSingle();
    if (existing) {
      const ids = Array.isArray(existing.question_ids) ? existing.question_ids.filter((id): id is string => typeof id === "string") : [];
      const resolved = ids
        .map(findQuestion)
        .filter((question): question is NonNullable<typeof question> => Boolean(question));
      const answers =
        existing.answers_json &&
        typeof existing.answers_json === "object" &&
        !Array.isArray(existing.answers_json)
          ? (existing.answers_json as Record<string, unknown>)
          : {};
      const locked = Object.fromEntries(
        resolved
          .filter(
            (question) =>
              answers[question.id] !== undefined &&
              isAnswerShape(question, answers[question.id]),
          )
          .map((question) => [
            question.id,
            evaluateQuizAnswer(question, answers[question.id] as never),
          ]),
      );
      const index = ids.findIndex((id) => answers[id] === undefined);
      return NextResponse.json({
        sessionId: existing.id,
        questions: resolved.map(publicQuestion),
        locked,
        index: index === -1 ? ids.length : index,
      });
    }
    const questions = selectQuizQuestions(5);
    const { data, error } = await admin
      .from("quiz_sessions")
      .insert({
        student_id: user.id,
        lesson_slug: parsed.data.lessonSlug,
        question_ids: questions.map(({ id }) => id),
        total_questions: questions.length,
      })
      .select("id")
      .single();
    if (error) throw error;

    return NextResponse.json({
      sessionId: data.id,
      questions: questions.map(publicQuestion),
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "Could not start the quiz. Make sure the latest database migration is installed.",
      },
      { status: 500 },
    );
  }
}
