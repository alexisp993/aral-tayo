"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Gamepad2,
  Layers3,
  Lightbulb,
  LockKeyhole,
  RotateCcw,
  Trophy,
} from "lucide-react";

import { Button, Card, LinkButton, ProgressBar } from "@/components/ui";
import { useLessonProgress } from "@/lib/use-lesson-progress";

export type LearnBlock = {
  type: "intro" | "worked_example" | "key_takeaway" | "real_life";
  ordinal: number;
  title: string;
  body: string;
  example?: { expression: string; steps: string[]; answer: string };
};

export type Flashcard = { ordinal: number; front: string; back: string };

const pathSteps = [
  {
    key: "learn",
    title: "Learn",
    description: "Read examples and understand the concept.",
    icon: BookOpen,
  },
  {
    key: "flashcards",
    title: "Flashcards",
    description: "Review key terms and ideas.",
    icon: Layers3,
  },
  {
    key: "practice",
    title: "Practice",
    description: "Try interactive activities.",
    icon: Gamepad2,
  },
  {
    key: "quiz",
    title: "Quiz",
    description: "Check your understanding.",
    icon: Trophy,
  },
] as const;

export function LearningPath({ lessonSlug }: { lessonSlug: string }) {
  const { progress } = useLessonProgress(lessonSlug);
  const completed =
    Number(progress.learnCompleted) +
    Number(progress.flashcardsCompleted) +
    Number(progress.practiceCompleted) +
    Number(progress.quizCompleted);

  return (
    <>
      <div className="mt-5 flex items-center justify-between gap-4 text-sm">
        <p className="text-ink font-bold">{completed} of 4 steps completed</p>
        <p className="text-ink-muted">{completed * 25}%</p>
      </div>
      <ProgressBar
        className="mt-2"
        label={`${completed} of 4 lesson steps completed`}
        value={completed * 25}
      />
      <ol className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {pathSteps.map((step, index) => {
          const Icon = step.icon;
          const implemented = true;
          const available =
            step.key === "practice"
              ? progress.learnCompleted
              : step.key === "quiz"
                ? progress.practiceCompleted
                : true;
          const isComplete =
            step.key === "learn"
              ? progress.learnCompleted
              : step.key === "flashcards"
                ? progress.flashcardsCompleted
                : step.key === "practice"
                  ? progress.practiceCompleted
                  : progress.quizCompleted;
          const content = (
            <>
              <div className="flex items-start justify-between gap-3">
                <span
                  className={`grid size-11 place-items-center rounded-[10px] border-2 border-[#17150f] ${available ? "bg-[#ffd95f] text-[#17150f]" : "bg-[#ded9cb]"}`}
                >
                  {isComplete ? (
                    <Check aria-hidden="true" size={22} />
                  ) : (
                    <Icon aria-hidden="true" size={22} />
                  )}
                </span>
                {(!implemented || !available) && (
                  <LockKeyhole aria-label="Locked" size={18} />
                )}
              </div>
              <h3 className="mt-4 font-black text-[#17150f]">
                {index + 1}. {step.title}
              </h3>
              <p className="mt-2 text-sm leading-5">{step.description}</p>
              <p className="mt-4 text-xs font-extrabold tracking-wide text-[#514b3e] uppercase">
                {isComplete
                  ? "Completed"
                  : implemented && available
                    ? "Open"
                    : "Locked"}
              </p>
            </>
          );

          return (
            <li key={step.key}>
              {implemented && available ? (
                <Link
                  className="game-choice block rounded-[12px] bg-[#fffdf4] p-4 focus-visible:outline-3 focus-visible:outline-offset-2"
                  href={`/student/lessons/${lessonSlug}/${step.key}`}
                >
                  {content}
                </Link>
              ) : (
                <div className="rounded-[12px] border-2 border-dashed border-[#8f897a] bg-[#ebe7dc] p-4 text-[#625d51]">
                  {content}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </>
  );
}

function ModeHeader({
  lessonSlug,
  label,
  step,
  description,
}: {
  lessonSlug: string;
  label: string;
  step: string;
  description: string;
}) {
  return (
    <>
      <Link
        className="text-brand focus-visible:outline-brand inline-flex min-h-11 items-center gap-2 rounded-lg font-bold focus-visible:outline-3 focus-visible:outline-offset-2"
        href={`/student/lessons/${lessonSlug}`}
      >
        <ArrowLeft aria-hidden="true" size={18} /> Back to lesson
      </Link>
      <header className="mt-2 border-b-2 border-[#17150f] pb-7">
        <div className="flex flex-wrap items-center gap-4">
          <span className="game-chip grid size-14 place-items-center rounded-[12px] bg-[#ffd95f] text-[#17150f]">
            <BookOpen aria-hidden="true" size={28} />
          </span>
          <div>
            <p className="font-black text-[#8b261f]">
              {label} · {step}
            </p>
            <h1 className="game-display text-4xl font-semibold text-[#17150f] md:text-6xl">
              Adding Fractions
            </h1>
            <p className="text-ink mt-2 max-w-2xl leading-7">{description}</p>
          </div>
        </div>
      </header>
    </>
  );
}

export function LearnMode({
  lessonSlug,
  blocks,
}: {
  lessonSlug: string;
  blocks: LearnBlock[];
}) {
  const { progress, completeStep } = useLessonProgress(lessonSlug);

  return (
    <>
      <ModeHeader
        lessonSlug={lessonSlug}
        label="Learn"
        step="Step 1 of 4"
        description="Build the idea one example at a time, then continue when it makes sense."
      />
      <div className="mx-auto mt-6 max-w-4xl space-y-4">
        {blocks.map((block) => (
          <Card
            className={
              block.type === "key_takeaway"
                ? "border-sun/30 bg-sun-soft p-6"
                : "p-6 md:p-7"
            }
            key={block.ordinal}
          >
            <div className="flex gap-4">
              <span
                className={`grid size-10 shrink-0 place-items-center rounded-xl font-black ${block.type === "key_takeaway" ? "bg-sun text-white" : "bg-brand-soft text-brand"}`}
              >
                {block.type === "key_takeaway" ? (
                  <Lightbulb aria-hidden="true" size={21} />
                ) : (
                  block.ordinal
                )}
              </span>
              <div className="min-w-0">
                <h2 className="text-ink text-xl font-black md:text-2xl">
                  {block.title}
                </h2>
                <p className="text-ink-muted mt-2 leading-7">{block.body}</p>
                {block.example && (
                  <div className="mt-5 grid gap-5 rounded-2xl bg-[#f6f9ff] p-5 md:grid-cols-[0.65fr_1fr]">
                    <div className="text-center md:text-left">
                      <p className="text-ink text-3xl font-black">
                        {block.example.expression}
                      </p>
                      <p className="text-brand mt-3 text-xl font-black">
                        Answer: {block.example.answer}
                      </p>
                    </div>
                    <ol className="text-ink-muted space-y-2 text-sm leading-6">
                      {block.example.steps.map((item, index) => (
                        <li key={item}>
                          <span className="text-ink mr-2 font-black">
                            {index + 1}.
                          </span>
                          {item}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
        <Card className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-ink text-xl font-black">Ready to review?</h2>
            <p className="text-ink-muted mt-1">
              Mark this step complete and practice the key ideas with
              flashcards.
            </p>
          </div>
          {progress.learnCompleted ? (
            <LinkButton href={`/student/lessons/${lessonSlug}/flashcards`}>
              Continue to flashcards <ArrowRight aria-hidden="true" size={18} />
            </LinkButton>
          ) : (
            <Button onClick={() => completeStep("learn")}>
              Complete Learn <Check aria-hidden="true" size={18} />
            </Button>
          )}
        </Card>
      </div>
    </>
  );
}

export function FlashcardsMode({
  lessonSlug,
  cards,
}: {
  lessonSlug: string;
  cards: Flashcard[];
}) {
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const { progress, completeStep } = useLessonProgress(lessonSlug);
  const card = cards[index];
  const isLast = index === cards.length - 1;

  const move = (nextIndex: number) => {
    setIndex(nextIndex);
    setShowAnswer(false);
  };

  return (
    <>
      <ModeHeader
        lessonSlug={lessonSlug}
        label="Flashcards"
        step="Step 2 of 4"
        description="Review each term at your own pace. Say your answer before you reveal it."
      />
      <div className="mx-auto mt-6 max-w-4xl">
        <div className="flex items-center gap-4">
          <p className="text-ink shrink-0 font-black">
            Card {index + 1} of {cards.length}
          </p>
          <ProgressBar
            className="flex-1"
            label={`${index + 1} of ${cards.length} flashcards`}
            value={((index + 1) / cards.length) * 100}
          />
        </div>
        <Card className="mt-5 min-h-[340px] overflow-hidden p-7 md:p-10">
          <div className="flex h-full min-h-[276px] flex-col items-center justify-center text-center">
            <span className="bg-sun-soft text-ink rounded-full px-3 py-1 text-xs font-black tracking-wide uppercase">
              {showAnswer ? "Answer" : "Term"}
            </span>
            <p
              aria-live="polite"
              className={`text-ink mt-7 font-black tracking-[-0.03em] ${showAnswer ? "max-w-2xl text-2xl leading-10 md:text-3xl" : "text-4xl md:text-5xl"}`}
            >
              {showAnswer ? card.back : card.front}
            </p>
            <Button
              className="mt-8"
              onClick={() => setShowAnswer((current) => !current)}
              variant="secondary"
            >
              <RotateCcw aria-hidden="true" size={18} />{" "}
              {showAnswer ? "Show term" : "Show answer"}
            </Button>
          </div>
        </Card>
        <div className="mt-5 flex flex-wrap justify-between gap-3">
          <Button
            disabled={index === 0}
            onClick={() => move(index - 1)}
            variant="secondary"
          >
            <ArrowLeft aria-hidden="true" size={18} /> Previous
          </Button>
          {isLast ? (
            progress.flashcardsCompleted ? (
              <LinkButton href={`/student/lessons/${lessonSlug}`}>
                Back to lesson <Check aria-hidden="true" size={18} />
              </LinkButton>
            ) : (
              <Button onClick={() => completeStep("flashcards")}>
                Complete flashcards <Check aria-hidden="true" size={18} />
              </Button>
            )
          ) : (
            <Button onClick={() => move(index + 1)}>
              Next card <ArrowRight aria-hidden="true" size={18} />
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
