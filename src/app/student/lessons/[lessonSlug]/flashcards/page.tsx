import { notFound } from "next/navigation";

import { FlashcardsMode, type Flashcard } from "@/components/learning-modes";
import { addingFractionsLesson, getLesson } from "@/lib/curriculum";
import lessonSeed from "../../../../../../seed/grade-5-math/adding-fractions.seed.json";

export function generateStaticParams() {
  return [{ lessonSlug: addingFractionsLesson.slug }];
}

export default async function FlashcardsPage({
  params,
}: {
  params: Promise<{ lessonSlug: string }>;
}) {
  const { lessonSlug } = await params;
  if (!getLesson(lessonSlug)) notFound();

  return (
    <FlashcardsMode
      cards={lessonSeed.lesson.flashcards as Flashcard[]}
      lessonSlug={lessonSlug}
    />
  );
}
