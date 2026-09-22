import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Brain, Clock3 } from "lucide-react";

import { LearningPath } from "@/components/learning-modes";
import { Card } from "@/components/ui";
import { getLesson, lessons } from "@/lib/curriculum";

export function generateStaticParams() {
  return lessons.map((lesson) => ({ lessonSlug: lesson.slug }));
}

export default async function LessonOverviewPage({
  params,
}: {
  params: Promise<{ lessonSlug: string }>;
}) {
  const { lessonSlug } = await params;
  const lesson = getLesson(lessonSlug);
  if (!lesson) notFound();

  return (
    <>
      <Link
        className="text-brand focus-visible:outline-brand inline-flex min-h-11 items-center gap-2 rounded-lg font-bold focus-visible:outline-3 focus-visible:outline-offset-2"
        href={`/student/subjects/${lesson.subjectSlug}`}
      >
        <ArrowLeft aria-hidden="true" size={18} /> Back to Mathematics
      </Link>

      <header className="mt-2 grid gap-5 border-b-2 border-[#17150f] pb-7 md:grid-cols-[1fr_auto]">
        <div>
          <h1 className="game-display text-4xl font-semibold text-[#17150f] md:text-6xl">
            {lesson.title}
          </h1>
          <p className="text-ink mt-2 font-bold">
            {lesson.grade} · {lesson.subject} · {lesson.quarter} · {lesson.unit}
          </p>
          <p className="text-ink-muted mt-4 max-w-[68ch] leading-7">
            {lesson.summary}
          </p>
        </div>
        <div
          aria-label={lesson.visual.label}
          className="game-chip self-center rounded-[12px] bg-[#ffd95f] px-5 py-4 text-center text-2xl font-black text-[#17150f]"
        >
          {lesson.visual.parts.map((part, index) => (
            <span className={index % 2 === 1 ? "text-brand px-3" : ""} key={`${part}-${index}`}>
              {part}
            </span>
          ))}
        </div>
      </header>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-5">
          <Card className="p-6 md:p-7">
            <div className="flex items-center gap-3">
              <Brain aria-hidden="true" className="text-brand" size={27} />
              <div>
                <h2 className="text-ink text-2xl font-black">
                  Your learning path
                </h2>
                <p className="text-ink-muted mt-1">
                  Complete each step to build your skills.
                </p>
              </div>
            </div>
            <LearningPath lessonSlug={lesson.slug} />
          </Card>

          <Card className="p-6 md:p-7">
            <h2 className="text-ink text-2xl font-black">
              What you&apos;ll learn
            </h2>
            <ul className="mt-5 space-y-3">
              {lesson.competencies.map((competency) => (
                <li
                  className="text-ink-muted flex gap-3 leading-6"
                  key={competency}
                >
                  <span
                    aria-hidden="true"
                    className="mt-1.5 size-3 shrink-0 rounded-full bg-[#18b56b]"
                  />
                  {competency}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <aside className="space-y-5">
          <Card className="p-6">
            <h2 className="text-ink text-xl font-black">Lesson details</h2>
            <dl className="mt-5 space-y-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">Subject</dt>
                <dd className="text-ink font-bold">{lesson.subject}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">Grade</dt>
                <dd className="text-ink font-bold">{lesson.grade}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">Quarter</dt>
                <dd className="text-ink font-bold">{lesson.quarter}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted">Unit</dt>
                <dd className="text-ink text-right font-bold">{lesson.unit}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-muted flex items-center gap-2">
                  <Clock3 aria-hidden="true" size={16} /> Time
                </dt>
                <dd className="text-ink font-bold">
                  {lesson.estimatedMinutes} minutes
                </dd>
              </div>
            </dl>
          </Card>
          <Card className="bg-gradient-to-br from-[#effff4] to-[#fff9dc] p-6">
            <h2 className="text-ink font-black">Prototype curriculum note</h2>
            <p className="text-ink-muted mt-2 text-sm leading-6">
              This engineering seed is not yet official DepEd or
              MATATAG-validated curriculum content.
            </p>
          </Card>
        </aside>
      </div>
    </>
  );
}
