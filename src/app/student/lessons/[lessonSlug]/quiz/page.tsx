import { notFound } from "next/navigation";

import { QuizMode } from "@/components/quiz-mode";
import { addingFractionsLesson, getLesson } from "@/lib/curriculum";

export function generateStaticParams() {
  return [{ lessonSlug: addingFractionsLesson.slug }];
}

export default async function QuizPage({
  params,
}: {
  params: Promise<{ lessonSlug: string }>;
}) {
  const { lessonSlug } = await params;
  if (!getLesson(lessonSlug)) notFound();
  return <QuizMode lessonSlug={lessonSlug} />;
}
