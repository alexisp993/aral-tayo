import { notFound } from "next/navigation";

import { LearnMode, type LearnBlock } from "@/components/learning-modes";
import { addingFractionsLesson, getLesson } from "@/lib/curriculum";
import lessonSeed from "../../../../../../seed/grade-5-math/adding-fractions.seed.json";

export function generateStaticParams() {
  return [{ lessonSlug: addingFractionsLesson.slug }];
}

export default async function LearnPage({
  params,
}: {
  params: Promise<{ lessonSlug: string }>;
}) {
  const { lessonSlug } = await params;
  if (!getLesson(lessonSlug)) notFound();

  return (
    <LearnMode
      blocks={lessonSeed.lesson.learn_blocks as LearnBlock[]}
      lessonSlug={lessonSlug}
    />
  );
}
