"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Flame,
  Heart,
  Lightbulb,
  Medal,
  RotateCcw,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";

import {
  ActivityRenderer,
  type Activity,
  type ActivityResponse,
} from "@/components/activity-renderer";
import { Button, LinkButton } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";

const STARTING_HEARTS = 3;

function StatChip({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div
      aria-label={`${value} ${label}`}
      className={`game-chip flex min-h-12 items-center gap-2 rounded-[12px] px-3.5 ${tone}`}
    >
      {icon}
      <span className="tabular-nums">
        <strong className="text-base leading-none">{value}</strong>
        <span className="ml-1 hidden text-xs font-extrabold uppercase sm:inline">
          {label}
        </span>
      </span>
    </div>
  );
}

export function PracticeMode({
  lessonSlug,
  activities,
}: {
  lessonSlug: string;
  activities: Activity[];
}) {
  const [index, setIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [attemptsUsed, setAttemptsUsed] = useState(1);
  const [rendererKey, setRendererKey] = useState(0);
  const [hearts, setHearts] = useState(STARTING_HEARTS);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [complete, setComplete] = useState(false);
  const [practiceUnlocked, setPracticeUnlocked] = useState(false);
  const activity = activities[index];

  const resetRound = () => {
    setIndex(0);
    setSubmitted(false);
    setResult(null);
    setError("");
    setSubmitting(false);
    setShowHint(false);
    setAttemptsUsed(1);
    setRendererKey((key) => key + 1);
    setHearts(STARTING_HEARTS);
    setScore(0);
    setStreak(0);
    setCorrectCount(0);
    setComplete(false);
    setPracticeUnlocked(false);
  };

  const submit = async (response: ActivityResponse) => {
    setSubmitting(true);
    setError("");
    try {
      const {
        data: { session },
      } = await createClient().auth.getSession();
      const apiResponse = await fetch("/api/practice/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session
            ? { Authorization: `Bearer ${session.access_token}` }
            : {}),
        },
        body: JSON.stringify({
          eventId: crypto.randomUUID(),
          lessonSlug,
          activityKey: activity.id,
          response: response.response,
          attemptsUsed,
          hintUsed: showHint,
        }),
      });
      const body = (await apiResponse.json()) as {
        error?: string;
        is_correct?: boolean;
        practiceCompleted?: boolean;
      };
      if (!apiResponse.ok) {
        setError(body.error ?? "Your answer could not be saved. Try again.");
        return;
      }

      const isCorrect = body.is_correct ?? false;
      setResult(isCorrect);
      setSubmitted(true);
      setPracticeUnlocked(Boolean(body.practiceCompleted));
      window.dispatchEvent(new Event("aral-tayo:account-progress"));
      if (isCorrect) {
        const answerPoints = attemptsUsed === 1 ? 100 : 60;
        setScore((current) => current + answerPoints + streak * 10);
        setStreak((current) => current + 1);
        setCorrectCount((current) => current + 1);
      } else {
        setHearts((current) => Math.max(0, current - 1));
        setStreak(0);
      }
    } catch {
      setError(
        "We could not reach the practice server. Check your connection and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const nextActivity = () => {
    if (index + 1 === activities.length) {
      setComplete(true);
      return;
    }
    setIndex((current) => current + 1);
    setSubmitted(false);
    setResult(null);
    setError("");
    setShowHint(false);
    setAttemptsUsed(1);
  };

  if (complete) {
    const accuracy = Math.round((correctCount / activities.length) * 100);
    const stars = accuracy >= 80 ? 3 : accuracy >= 50 ? 2 : 1;

    return (
      <main className="mx-auto max-w-4xl py-4 sm:py-8">
        <section className="game-paper game-celebrate overflow-hidden rounded-[16px] text-center">
          <div className="bg-[#ffd95f] px-5 py-10 sm:px-10 sm:py-14">
            <span className="mx-auto grid size-20 place-items-center rounded-full border-2 border-[#17150f] bg-[#fffdf4] shadow-[4px_5px_0_#17150f]">
              <Trophy aria-hidden="true" size={42} strokeWidth={2.5} />
            </span>
            <h1 className="game-display mt-7 text-4xl font-semibold text-[#17150f] sm:text-6xl">
              Practice complete!
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-lg font-bold text-[#4d4739]">
              You finished every challenge in Adding Fractions.
            </p>
          </div>

          <div className="px-5 py-8 sm:px-10 sm:py-10">
            <div
              aria-label={`${stars} out of 3 stars`}
              className="flex justify-center gap-3"
            >
              {[1, 2, 3].map((star) => (
                <Star
                  aria-hidden="true"
                  className={
                    star <= stars ? "fill-[#ffd02f]" : "fill-[#ded9cb]"
                  }
                  key={star}
                  size={44}
                  strokeWidth={2.5}
                />
              ))}
            </div>
            <dl className="mx-auto mt-8 grid max-w-2xl grid-cols-3 gap-3 text-[#17150f]">
              <div className="rounded-[12px] bg-[#cfe8ff] p-4">
                <dt className="text-xs font-extrabold uppercase">Score</dt>
                <dd className="mt-1 text-2xl font-black tabular-nums">
                  {score}
                </dd>
              </div>
              <div className="rounded-[12px] bg-[#91e3b7] p-4">
                <dt className="text-xs font-extrabold uppercase">Correct</dt>
                <dd className="mt-1 text-2xl font-black tabular-nums">
                  {correctCount}/{activities.length}
                </dd>
              </div>
              <div className="rounded-[12px] bg-[#ffc1b9] p-4">
                <dt className="text-xs font-extrabold uppercase">Accuracy</dt>
                <dd className="mt-1 text-2xl font-black tabular-nums">
                  {accuracy}%
                </dd>
              </div>
            </dl>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              {practiceUnlocked && (
                <LinkButton
                  className="game-chip rounded-[12px] border-2 border-[#17150f] bg-[#17150f] text-white shadow-none hover:bg-[#343027]"
                  href={`/student/lessons/${lessonSlug}/quiz`}
                >
                  Quiz unlocked <Trophy aria-hidden="true" size={18} />
                </LinkButton>
              )}
              <LinkButton
                className="game-chip rounded-[12px] border-2 border-[#17150f] bg-[#ff6b5d] text-[#17150f] shadow-none hover:bg-[#ff8074]"
                href={`/student/lessons/${lessonSlug}`}
              >
                <Check aria-hidden="true" size={18} strokeWidth={3} /> Back to
                lesson
              </LinkButton>
              <Button
                className="game-chip rounded-[12px] border-2 border-[#17150f] bg-[#fffdf4] text-[#17150f] shadow-none hover:bg-[#fff4c4]"
                onClick={resetRound}
              >
                <RotateCcw aria-hidden="true" size={18} /> Play again
              </Button>
            </div>
            {!practiceUnlocked && (
              <p className="mt-5 text-sm font-bold text-[#635d50]">
                The quiz unlocks after six different practice activities are
                answered correctly across your saved attempts.
              </p>
            )}
          </div>
        </section>
      </main>
    );
  }

  const canContinue = Boolean(result) || attemptsUsed >= 2;
  const progress = ((index + 1) / activities.length) * 100;

  return (
    <div className="relative mx-auto max-w-5xl pb-8">
      <div
        aria-hidden="true"
        className="absolute -top-5 -right-3 -z-10 size-36 rotate-6 rounded-[20px] bg-[#ffd95f] sm:size-48"
      />
      <Link
        className="inline-flex min-h-11 items-center gap-2 rounded-[10px] font-extrabold text-[#17150f] underline decoration-2 underline-offset-4"
        href={`/student/lessons/${lessonSlug}`}
      >
        <ArrowLeft aria-hidden="true" size={19} strokeWidth={3} /> Back to
        lesson
      </Link>

      <header className="mt-2 flex flex-col gap-5 border-b-2 border-[#17150f] pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <h1 className="game-display text-4xl leading-[1.02] font-semibold text-[#17150f] sm:text-5xl md:text-6xl">
            Fraction Quest
          </h1>
          <p className="mt-3 max-w-[65ch] text-base leading-7 font-bold text-[#514b3e] sm:text-lg">
            Solve each challenge, protect your hearts, and build a hot streak.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <StatChip
            icon={<Heart aria-hidden="true" fill="currentColor" size={20} />}
            label="hearts"
            tone="bg-[#ffc1b9] text-[#7d1713]"
            value={hearts}
          />
          <StatChip
            icon={<Flame aria-hidden="true" fill="currentColor" size={20} />}
            label="streak"
            tone="bg-[#ffd95f] text-[#563d00]"
            value={streak}
          />
          <StatChip
            icon={<Medal aria-hidden="true" size={20} strokeWidth={2.7} />}
            label="points"
            tone="bg-[#91e3b7] text-[#123f2d]"
            value={score}
          />
        </div>
      </header>

      <main className="mt-6">
        <div className="mb-5 flex items-center gap-4">
          <p className="shrink-0 font-black text-[#17150f] tabular-nums">
            {index + 1} / {activities.length}
          </p>
          <div
            aria-label={`${index + 1} of ${activities.length} challenges`}
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={progress}
            className="h-4 flex-1 overflow-hidden rounded-full border-2 border-[#17150f] bg-[#fffdf4]"
            role="progressbar"
          >
            <div
              className="h-full bg-[#5cc98c] transition-[width] duration-500 ease-out motion-reduce:transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>
          <Sparkles aria-hidden="true" className="text-[#a37100]" size={24} />
        </div>

        <ActivityRenderer
          activity={activity}
          disabled={submitting || submitted}
          key={`${activity.id}-${rendererKey}`}
          onSubmit={submit}
        />

        {error && (
          <div
            aria-live="assertive"
            className="game-paper mt-6 rounded-[14px] bg-[#ffc1b9] p-5 font-bold text-[#5f1512]"
          >
            <p>{error}</p>
            <Button
              className="game-chip mt-4 rounded-[10px] border-2 border-[#17150f] bg-[#fffdf4] text-[#17150f] shadow-none"
              onClick={() => setError("")}
              variant="secondary"
            >
              Try submitting again
            </Button>
          </div>
        )}

        {submitting && (
          <p aria-live="polite" className="mt-5 font-bold text-[#514b3e]">
            Checking your answer…
          </p>
        )}

        {submitted && (
          <section
            aria-live="polite"
            className={`game-paper game-celebrate mt-6 rounded-[16px] p-5 sm:p-6 ${result ? "bg-[#c9f4d8]" : "bg-[#fff1b8]"}`}
            tabIndex={-1}
          >
            <div className="flex items-start gap-4">
              <span
                className={`grid size-12 shrink-0 place-items-center rounded-full border-2 border-[#17150f] ${result ? "bg-[#5cc98c]" : "bg-[#ffd95f]"}`}
              >
                {result ? (
                  <Trophy aria-hidden="true" size={25} />
                ) : (
                  <Lightbulb aria-hidden="true" size={25} />
                )}
              </span>
              <div>
                <h2 className="game-display text-2xl font-semibold text-[#17150f] sm:text-3xl">
                  {result ? "Brilliant!" : "Almost there!"}
                </h2>
                <p className="mt-1 max-w-[68ch] font-bold text-[#514b3e]">
                  {result
                    ? `You earned ${attemptsUsed === 1 ? 100 + (streak - 1) * 10 : 60 + (streak - 1) * 10} points.`
                    : attemptsUsed < 2
                      ? "Use a hint, then take one more shot before moving on."
                      : "Nice effort. Continue the quest and revisit this challenge later."}
                </p>
              </div>
            </div>

            {!result && activity.hint && !showHint && (
              <Button
                className="game-chip mt-5 rounded-[10px] border-2 border-[#17150f] bg-[#fffdf4] text-[#17150f] shadow-none hover:bg-white"
                onClick={() => setShowHint(true)}
                variant="secondary"
              >
                <Lightbulb aria-hidden="true" size={18} /> Reveal hint
              </Button>
            )}
            {!result && showHint && activity.hint && (
              <p className="mt-5 rounded-[12px] border-2 border-dashed border-[#17150f] bg-[#fffdf4] p-4 font-extrabold text-[#17150f]">
                Hint: {activity.hint}
              </p>
            )}
            {!result && attemptsUsed < 2 && (
              <Button
                className="game-chip mt-5 rounded-[10px] border-2 border-[#17150f] bg-[#ff6b5d] text-[#17150f] shadow-none hover:bg-[#ff8074]"
                onClick={() => {
                  setSubmitted(false);
                  setAttemptsUsed(2);
                  setRendererKey((key) => key + 1);
                }}
              >
                <RotateCcw aria-hidden="true" size={18} /> Try again
              </Button>
            )}
          </section>
        )}

        {submitted && canContinue && (
          <div className="mt-6 flex justify-end">
            <Button
              className="game-chip rounded-[12px] border-2 border-[#17150f] bg-[#17150f] px-5 text-white shadow-none hover:bg-[#343027]"
              onClick={nextActivity}
            >
              {index + 1 === activities.length
                ? "See my results"
                : "Next challenge"}
              <ArrowRight aria-hidden="true" size={18} strokeWidth={3} />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
