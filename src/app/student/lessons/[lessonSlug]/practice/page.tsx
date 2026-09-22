import { notFound } from "next/navigation";
import { type Activity } from "@/components/activity-renderer";
import { PracticeMode } from "@/components/practice-mode";
import { getLesson, lessons } from "@/lib/curriculum";
import { getLessonSeed } from "@/lib/lesson-content";

export function generateStaticParams() {
  return lessons.map((lesson) => ({ lessonSlug: lesson.slug }));
}
export default async function PracticePage({
  params,
}: {
  params: Promise<{ lessonSlug: string }>;
}) {
  const { lessonSlug } = await params;
  const lesson = getLesson(lessonSlug);
  const lessonSeed = getLessonSeed(lessonSlug);
  if (!lesson || !lessonSeed) notFound();
  const activities = lessonSeed.lesson.practice.activities.map((entry) => {
    const activity = { ...entry } as Record<string, unknown>;
    delete activity.answer_key;
    delete activity.explanation;
    return activity;
  }) as unknown as Activity[];
  return (
    <PracticeMode
      activities={activities}
      lessonSlug={lessonSlug}
      lessonTitle={lesson.title}
    />
  );
}
