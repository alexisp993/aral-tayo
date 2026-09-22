import { notFound } from "next/navigation";

import { QuizMode } from "@/components/quiz-mode";
import { getLesson, lessons } from "@/lib/curriculum";

export function generateStaticParams() {
  return lessons.map((lesson) => ({ lessonSlug: lesson.slug }));
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
