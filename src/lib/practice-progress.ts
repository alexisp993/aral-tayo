import "server-only";

import { getLessonSeed } from "@/lib/lesson-content";
import { createAdminClient } from "@/lib/supabase/admin";

export const PRACTICE_COMPLETION_PERCENT = 80;
export async function getPracticeProgress(
  studentId: string,
  lessonSlug: string,
) {
  const lessonSeed = getLessonSeed(lessonSlug);
  if (!lessonSeed) throw new Error("Lesson not found.");
  const activityCount = lessonSeed.lesson.practice.activities.length;
  const requiredCorrect = Math.ceil(
    activityCount * (PRACTICE_COMPLETION_PERCENT / 100),
  );
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("practice_attempts")
    .select("activity_key")
    .eq("student_id", studentId)
    .eq("lesson_slug", lessonSlug)
    .eq("is_correct", true);

  if (error) throw error;
  const correctActivityCount = new Set(
    (data ?? []).map((attempt) => attempt.activity_key),
  ).size;

  return {
    correctActivityCount,
    activityCount,
    requiredCorrect,
    completionPercent: Math.round(
      (correctActivityCount / activityCount) * 100,
    ),
    practiceCompleted: correctActivityCount >= requiredCorrect,
  };
}

export async function markPracticeComplete(
  studentId: string,
  lessonSlug: string,
) {
  const progress = await getPracticeProgress(studentId, lessonSlug);
  if (!progress.practiceCompleted) return progress;

  const admin = createAdminClient();
  const { error } = await admin.from("lesson_progress").upsert(
    {
      student_id: studentId,
      lesson_slug: lessonSlug,
      practice_completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "student_id,lesson_slug" },
  );
  if (error) throw error;
  return progress;
}
