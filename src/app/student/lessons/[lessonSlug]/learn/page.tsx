import { notFound } from "next/navigation";

import { LearnMode, type LearnBlock } from "@/components/learning-modes";
import { getLesson, lessons } from "@/lib/curriculum";
import { getLessonSeed } from "@/lib/lesson-content";

export function generateStaticParams() {
  return lessons.map((lesson) => ({ lessonSlug: lesson.slug }));
}

export default async function LearnPage({
  params,
}: {
  params: Promise<{ lessonSlug: string }>;
}) {
  const { lessonSlug } = await params;
  const lesson = getLesson(lessonSlug);
  const lessonSeed = getLessonSeed(lessonSlug);
  if (!lesson || !lessonSeed) notFound();

  return (
    <LearnMode
      blocks={lessonSeed.lesson.learn_blocks as LearnBlock[]}
      lessonSlug={lessonSlug}
      lessonTitle={lesson.title}
    />
  );
}
