import { NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/authenticated-user";
import { getPracticeProgress } from "@/lib/practice-progress";
import { createAdminClient } from "@/lib/supabase/admin";

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
        .select("quiz_completed_at")
        .eq("student_id", user.id)
        .eq("lesson_slug", lessonSlug)
        .maybeSingle(),
    ]);
    return NextResponse.json({
      ...practice,
      quizCompleted: Boolean(progressResult.data?.quiz_completed_at),
    });
  } catch {
    return NextResponse.json(
      { error: "Could not load lesson progress." },
      { status: 500 },
    );
  }
}
