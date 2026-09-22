"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, BookOpen, Check, Layers3, Play, Trophy } from "lucide-react";

import { ProgressBar, buttonStyles } from "@/components/ui";
import type { LessonProgress } from "@/lib/use-lesson-progress";
import { useLessonProgress } from "@/lib/use-lesson-progress";

type LessonSummary = {
  slug: string;
  title: string;
  subject: string;
  unit: string;
  summary: string;
};

const steps = [
  { key: "learnCompleted", label: "Learn", icon: BookOpen },
  { key: "flashcardsCompleted", label: "Cards", icon: Layers3 },
  { key: "practiceCompleted", label: "Practice", icon: Play },
  { key: "quizCompleted", label: "Quiz", icon: Trophy },
] as const;

export function getNextLessonAction(progress: LessonProgress) {
  if (!progress.learnCompleted)
    return { label: "Start learning", path: "learn" };
  if (!progress.flashcardsCompleted)
    return { label: "Review flashcards", path: "flashcards" };
  if (!progress.practiceCompleted)
    return { label: "Start practice", path: "practice" };
  if (!progress.quizCompleted)
    return { label: "Take the quiz", path: "quiz" };
  return { label: "Review lesson", path: "" };
}

type LessonSnapshot = { completed: number; loading: boolean };

export function summarizeLessonProgress(
  lessonCount: number,
  snapshots: Record<string, LessonSnapshot>,
) {
  const values = Object.values(snapshots);
  return {
    completedSteps: values.reduce((total, item) => total + item.completed, 0),
    totalSteps: lessonCount * steps.length,
    completedLessons: values.filter((item) => item.completed === steps.length)
      .length,
    activeLessons: values.filter(
      (item) => item.completed > 0 && item.completed < steps.length,
    ).length,
    loading:
      values.length < lessonCount || values.some((item) => item.loading),
  };
}

function LessonJourney({
  lesson,
  onProgress,
}: {
  lesson: LessonSummary;
  onProgress?: (slug: string, snapshot: LessonSnapshot) => void;
}) {
  const { progress, loading } = useLessonProgress(lesson.slug);
  const completed = steps.filter((step) => progress[step.key]).length;
  const action = getNextLessonAction(progress);
  const href = `/student/lessons/${lesson.slug}${action.path ? `/${action.path}` : ""}`;

  useEffect(() => {
    onProgress?.(lesson.slug, { completed, loading });
  }, [completed, lesson.slug, loading, onProgress]);

  return (
    <article className="rounded-[12px] border-2 border-[#17150f] bg-[#fffdf4] p-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="min-w-0">
          <p className="text-sm font-extrabold text-[#8b261f]">
            {lesson.subject} · {lesson.unit}
          </p>
          <h3 className="game-display mt-1 text-2xl font-semibold text-[#17150f]">
            {lesson.title}
          </h3>
          <p className="mt-2 max-w-[62ch] text-sm leading-6 font-bold text-[#5d574a]">
            {lesson.summary}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-[#ffd95f] px-3 py-1 text-sm font-black text-[#17150f]">
          {loading ? "Loading…" : `${completed} of 4`}
        </span>
      </div>

      <ProgressBar
        className="mt-4"
        label={`${lesson.title}: ${completed} of 4 steps completed`}
        value={completed * 25}
      />

      <ol className="mt-4 grid grid-cols-4 gap-2" aria-label={`${lesson.title} steps`}>
        {steps.map((step) => {
          const Icon = step.icon;
          const done = progress[step.key];
          return (
            <li
              className={`flex min-h-12 items-center justify-center gap-1 rounded-[10px] border-2 px-2 text-xs font-black sm:text-sm ${done ? "border-[#17150f] bg-[#91e3b7]" : "border-dashed border-[#8f897a] bg-[#ebe7dc] text-[#625d51]"}`}
              key={step.key}
            >
              {done ? <Check aria-hidden="true" size={16} /> : <Icon aria-hidden="true" size={16} />}
              <span className="hidden sm:inline">{step.label}</span>
              <span className="sr-only sm:hidden">{step.label}</span>
            </li>
          );
        })}
      </ol>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-bold text-[#5d574a]">
          {completed === 4
            ? "Quest complete—review any step whenever you like."
            : `${4 - completed} step${4 - completed === 1 ? "" : "s"} left in this quest.`}
        </p>
        <Link
          className={buttonStyles(completed === 4 ? "secondary" : "primary")}
          href={href}
        >
          {loading ? "Open lesson" : action.label}
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </div>
    </article>
  );
}

export function LessonDashboard({
  lessons,
  showSummary = false,
}: {
  lessons: readonly LessonSummary[];
  showSummary?: boolean;
}) {
  const [snapshots, setSnapshots] = useState<Record<string, LessonSnapshot>>(
    {},
  );
  const recordProgress = useCallback(
    (slug: string, snapshot: LessonSnapshot) =>
      setSnapshots((current) =>
        current[slug]?.completed === snapshot.completed &&
        current[slug]?.loading === snapshot.loading
          ? current
          : { ...current, [slug]: snapshot },
      ),
    [],
  );
  const summary = summarizeLessonProgress(lessons.length, snapshots);

  return (
    <div>
      {showSummary && (
        <dl className="mb-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[12px] bg-[#cfe8ff] p-4 text-[#17150f]">
            <dt className="text-xs font-extrabold uppercase">Steps complete</dt>
            <dd className="mt-1 text-2xl font-black tabular-nums">
              {summary.loading
                ? "—"
                : `${summary.completedSteps}/${summary.totalSteps}`}
            </dd>
          </div>
          <div className="rounded-[12px] bg-[#91e3b7] p-4 text-[#17150f]">
            <dt className="text-xs font-extrabold uppercase">
              Lessons complete
            </dt>
            <dd className="mt-1 text-2xl font-black tabular-nums">
              {summary.loading ? "—" : summary.completedLessons}
            </dd>
          </div>
          <div className="rounded-[12px] bg-[#ffd95f] p-4 text-[#17150f]">
            <dt className="text-xs font-extrabold uppercase">In progress</dt>
            <dd className="mt-1 text-2xl font-black tabular-nums">
              {summary.loading ? "—" : summary.activeLessons}
            </dd>
          </div>
        </dl>
      )}
      <div className="space-y-4">
        {lessons.map((lesson) => (
          <LessonJourney
            key={lesson.slug}
            lesson={lesson}
            onProgress={showSummary ? recordProgress : undefined}
          />
        ))}
      </div>
    </div>
  );
}
