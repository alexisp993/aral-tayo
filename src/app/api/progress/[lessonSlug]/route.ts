import { NextResponse } from "next/server";
import { z } from "zod";

import { getAuthenticatedUser } from "@/lib/authenticated-user";
import { getPracticeProgress } from "@/lib/practice-progress";
import { createAdminClient } from "@/lib/supabase/admin";

const bodySchema = z.object({ step: z.enum(["learn", "flashcards"]) }).strict();

function responseProgress(
  progress: {
    learn_completed_at?: string | null;
    flashcards_completed_at?: string | null;
    quiz_completed_at?: string | null;
  } | null,
) {
  return {
    learnCompleted: Boolean(progress?.learn_completed_at),
    flashcardsCompleted: Boolean(progress?.flashcards_completed_at),
    quizCompleted: Boolean(progress?.quiz_completed_at),
  };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ lessonSlug: string }> },
) {
  const { lessonSlug } = await params;
  if (lessonSlug !== "adding-fractions")
    return NextResponse.json({ error: "Lesson not found." }, { status: 404 });

  const user = await getAuthenticatedUser(request);
  if (!user)
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  try {
    const [practice, progressResult] = await Promise.all([
      getPracticeProgress(user.id),
      createAdminClient()
        .from("lesson_progress")
        .select(
          "learn_completed_at, flashcards_completed_at, quiz_completed_at",
        )
        .eq("student_id", user.id)
        .eq("lesson_slug", lessonSlug)
        .maybeSingle(),
    ]);
    return NextResponse.json({
      ...practice,
      ...responseProgress(progressResult.data),
    });
  } catch {
    return NextResponse.json(
      { error: "Could not load lesson progress." },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ lessonSlug: string }> },
) {
  const { lessonSlug } = await params;
  if (lessonSlug !== "adding-fractions")
    return NextResponse.json({ error: "Lesson not found." }, { status: 404 });

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      { error: "Invalid lesson progress request." },
      { status: 400 },
    );

  const user = await getAuthenticatedUser(request);
  if (!user)
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  try {
    const admin = createAdminClient();
    const { data: existing, error: existingError } = await admin
      .from("lesson_progress")
      .select("learn_completed_at, flashcards_completed_at, quiz_completed_at")
      .eq("student_id", user.id)
      .eq("lesson_slug", lessonSlug)
      .maybeSingle();
    if (existingError) throw existingError;

    const column = `${parsed.data.step}_completed_at` as const;
    const { data, error } = await admin
      .from("lesson_progress")
      .upsert(
        {
          student_id: user.id,
          lesson_slug: lessonSlug,
          [column]: existing?.[column] ?? new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "student_id,lesson_slug" },
      )
      .select("learn_completed_at, flashcards_completed_at, quiz_completed_at")
      .single();
    if (error) throw error;

    return NextResponse.json(responseProgress(data));
  } catch {
    return NextResponse.json(
      { error: "Could not save lesson progress." },
      { status: 500 },
    );
  }
}
