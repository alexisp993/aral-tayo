import "server-only";

import lessonSeed from "../../seed/grade-5-math/adding-fractions.seed.json";
import { createAdminClient } from "@/lib/supabase/admin";

export const PRACTICE_COMPLETION_PERCENT = 80;
export const PRACTICE_ACTIVITY_COUNT =
  lessonSeed.lesson.practice.activities.length;
export const PRACTICE_REQUIRED_CORRECT = Math.ceil(
  PRACTICE_ACTIVITY_COUNT * (PRACTICE_COMPLETION_PERCENT / 100),
);

export async function getPracticeProgress(studentId: string) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("practice_attempts")
    .select("activity_key")
    .eq("student_id", studentId)
    .eq("lesson_slug", "adding-fractions")
    .eq("is_correct", true);

  if (error) throw error;
  const correctActivityCount = new Set(
    (data ?? []).map((attempt) => attempt.activity_key),
  ).size;

  return {
    correctActivityCount,
    activityCount: PRACTICE_ACTIVITY_COUNT,
    requiredCorrect: PRACTICE_REQUIRED_CORRECT,
    completionPercent: Math.round(
      (correctActivityCount / PRACTICE_ACTIVITY_COUNT) * 100,
    ),
    practiceCompleted: correctActivityCount >= PRACTICE_REQUIRED_CORRECT,
  };
}

export async function markPracticeComplete(studentId: string) {
  const progress = await getPracticeProgress(studentId);
  if (!progress.practiceCompleted) return progress;

  const admin = createAdminClient();
  const { error } = await admin.from("lesson_progress").upsert(
    {
      student_id: studentId,
      lesson_slug: "adding-fractions",
      practice_completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "student_id,lesson_slug" },
  );
  if (error) throw error;
  return progress;
}
