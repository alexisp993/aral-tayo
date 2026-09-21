import { notFound } from "next/navigation";
import { type Activity } from "@/components/activity-renderer";
import { PracticeMode } from "@/components/practice-mode";
import { addingFractionsLesson, getLesson } from "@/lib/curriculum";
import lessonSeed from "../../../../../../seed/grade-5-math/adding-fractions.seed.json";

export function generateStaticParams() {
  return [{ lessonSlug: addingFractionsLesson.slug }];
}
export default async function PracticePage({
  params,
}: {
  params: Promise<{ lessonSlug: string }>;
}) {
  const { lessonSlug } = await params;
  if (!getLesson(lessonSlug)) notFound();
  const activities = lessonSeed.lesson.practice.activities.map((entry) => {
    const activity = { ...entry } as Record<string, unknown>;
    delete activity.answer_key;
    delete activity.explanation;
    return activity;
  }) as unknown as Activity[];
  return <PracticeMode activities={activities} lessonSlug={lessonSlug} />;
}
