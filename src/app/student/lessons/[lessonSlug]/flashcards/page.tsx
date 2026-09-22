import { notFound } from "next/navigation";

import { FlashcardsMode, type Flashcard } from "@/components/learning-modes";
import { getLesson, lessons } from "@/lib/curriculum";
import { getLessonSeed } from "@/lib/lesson-content";

export function generateStaticParams() {
  return lessons.map((lesson) => ({ lessonSlug: lesson.slug }));
}

export default async function FlashcardsPage({
  params,
}: {
  params: Promise<{ lessonSlug: string }>;
}) {
  const { lessonSlug } = await params;
  const lesson = getLesson(lessonSlug);
  const lessonSeed = getLessonSeed(lessonSlug);
  if (!lesson || !lessonSeed) notFound();

  return (
    <FlashcardsMode
      cards={lessonSeed.lesson.flashcards as Flashcard[]}
      lessonSlug={lessonSlug}
      lessonTitle={lesson.title}
    />
  );
}
