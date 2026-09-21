"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  LockKeyhole,
  Medal,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";

import { Button, LinkButton } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import type { PublicQuizQuestion } from "@/lib/quiz";

type Gate = {
  practiceCompleted: boolean;
  correctActivityCount: number;
  requiredCorrect: number;
  activityCount: number;
};

type QuizResult = {
  score: number;
  correctCount: number;
  xp: number;
  achievements?: string[];
  results?: {
    questionId: string;
    correct: boolean;
    correctOptionId: string;
    explanation: string;
  }[];
};

async function authHeaders(): Promise<Record<string, string>> {
  const {
    data: { session },
  } = await createClient().auth.getSession();
  return session ? { Authorization: `Bearer ${session.access_token}` } : {};
}

export function QuizMode({ lessonSlug }: { lessonSlug: string }) {
  const [gate, setGate] = useState<Gate | null>(null);
  const [sessionId, setSessionId] = useState("");
  const [questions, setQuestions] = useState<PublicQuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const response = await fetch(`/api/progress/${lessonSlug}`, {
          headers: await authHeaders(),
        });
        const body = (await response.json()) as Gate & { error?: string };
        if (!response.ok) throw new Error(body.error);
        if (active) setGate(body);
      } catch (caught) {
        if (active)
          setError(
            caught instanceof Error
              ? caught.message
              : "Could not check quiz access.",
          );
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [lessonSlug]);

  const startQuiz = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/quiz/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(await authHeaders()),
        },
        body: JSON.stringify({ lessonSlug }),
      });
      const body = (await response.json()) as {
        sessionId?: string;
        questions?: PublicQuizQuestion[];
        error?: string;
      };
      if (!response.ok || !body.sessionId || !body.questions)
        throw new Error(body.error ?? "Could not start the quiz.");
      setSessionId(body.sessionId);
      setQuestions(body.questions);
      setAnswers({});
      setIndex(0);
      setResult(null);
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Could not start the quiz.",
      );
    } finally {
      setLoading(false);
    }
  };

  const submitQuiz = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(await authHeaders()),
        },
        body: JSON.stringify({ sessionId, answers }),
      });
      const body = (await response.json()) as QuizResult & { error?: string };
      if (!response.ok)
        throw new Error(body.error ?? "Could not submit the quiz.");
      setResult(body);
      window.dispatchEvent(new Event("aral-tayo:account-progress"));
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Could not submit the quiz.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading && !gate && !questions.length)
    return (
      <p className="py-12 text-center font-bold text-[#514b3e]">
        Preparing your quest…
      </p>
    );

  if (!gate?.practiceCompleted && !questions.length) {
    const correct = gate?.correctActivityCount ?? 0;
    const required = gate?.requiredCorrect ?? 6;
    return (
      <main className="mx-auto max-w-4xl py-4">
        <Link
          className="inline-flex min-h-11 items-center gap-2 font-extrabold text-[#17150f] underline decoration-2 underline-offset-4"
          href={`/student/lessons/${lessonSlug}`}
        >
          <ArrowLeft aria-hidden="true" size={19} /> Back to lesson
        </Link>
        <section className="game-paper mt-4 rounded-[16px] p-6 sm:p-10">
          <span className="grid size-16 place-items-center rounded-[14px] border-2 border-[#17150f] bg-[#ffd95f] shadow-[4px_5px_0_#17150f]">
            <LockKeyhole aria-hidden="true" size={32} />
          </span>
          <h1 className="game-display mt-7 text-4xl font-semibold text-[#17150f] sm:text-6xl">
            Quiz locked—for now
          </h1>
          <p className="mt-4 max-w-[65ch] text-lg leading-8 font-bold text-[#514b3e]">
            Correctly complete {required} different practice challenges. You
            have {correct} so far.
          </p>
          <div
            className="mt-6 h-5 overflow-hidden rounded-full border-2 border-[#17150f] bg-white"
            role="progressbar"
            aria-label={`${correct} of ${required} required practice activities`}
            aria-valuemax={required}
            aria-valuemin={0}
            aria-valuenow={correct}
          >
            <div
              className="h-full bg-[#5cc98c]"
              style={{ width: `${Math.min(100, (correct / required) * 100)}%` }}
            />
          </div>
          {error && <p className="mt-5 font-bold text-[#7d1713]">{error}</p>}
          <LinkButton
            className="game-chip mt-7 rounded-[12px] border-2 border-[#17150f] bg-[#ff6b5d] text-[#17150f] shadow-none hover:bg-[#ff8074]"
            href={`/student/lessons/${lessonSlug}/practice`}
          >
            Continue practice <ArrowRight aria-hidden="true" size={18} />
          </LinkButton>
        </section>
      </main>
    );
  }

  if (!questions.length) {
    return (
      <main className="mx-auto max-w-4xl py-4">
        <Link
          className="inline-flex min-h-11 items-center gap-2 font-extrabold text-[#17150f] underline decoration-2 underline-offset-4"
          href={`/student/lessons/${lessonSlug}`}
        >
          <ArrowLeft aria-hidden="true" size={19} /> Back to lesson
        </Link>
        <section className="game-paper mt-4 overflow-hidden rounded-[16px]">
          <div className="bg-[#cfe8ff] p-7 sm:p-11">
            <ShieldCheck aria-hidden="true" size={54} strokeWidth={2.2} />
            <h1 className="game-display mt-5 text-4xl font-semibold text-[#17150f] sm:text-6xl">
              Ready for the Fraction Final?
            </h1>
            <p className="mt-4 max-w-[65ch] text-lg leading-8 font-bold text-[#514b3e]">
              Five questions will be selected from the question bank. Finish in
              one run to earn XP and achievement badges.
            </p>
          </div>
          <div className="p-7 sm:p-9">
            <ul className="grid gap-3 font-extrabold text-[#17150f] sm:grid-cols-3">
              <li className="rounded-[12px] bg-[#ffd95f] p-4">
                5 randomized questions
              </li>
              <li className="rounded-[12px] bg-[#91e3b7] p-4">Up to 100 XP</li>
              <li className="rounded-[12px] bg-[#ffc1b9] p-4">
                Perfect-score badge
              </li>
            </ul>
            {error && <p className="mt-5 font-bold text-[#7d1713]">{error}</p>}
            <Button
              className="game-chip mt-7 rounded-[12px] border-2 border-[#17150f] bg-[#ff6b5d] px-6 text-[#17150f] shadow-none hover:bg-[#ff8074]"
              disabled={loading}
              onClick={startQuiz}
            >
              <Sparkles aria-hidden="true" size={19} />{" "}
              {loading ? "Building your quiz…" : "Start randomized quiz"}
            </Button>
          </div>
        </section>
      </main>
    );
  }

  if (result) {
    const stars = result.score >= 80 ? 3 : result.score >= 60 ? 2 : 1;
    return (
      <main className="mx-auto max-w-4xl py-4">
        <section className="game-paper game-celebrate overflow-hidden rounded-[16px] text-center">
          <div className="bg-[#ffd95f] px-6 py-10 sm:py-14">
            <Trophy aria-hidden="true" className="mx-auto" size={58} />
            <h1 className="game-display mt-5 text-4xl font-semibold text-[#17150f] sm:text-6xl">
              Quest cleared!
            </h1>
            <p className="mt-3 text-lg font-bold text-[#514b3e]">
              Your result is saved to your Aral Tayo account.
            </p>
          </div>
          <div className="px-6 py-9 sm:px-10">
            <div
              aria-label={`${stars} out of 3 stars`}
              className="flex justify-center gap-2"
            >
              {[1, 2, 3].map((star) => (
                <Star
                  aria-hidden="true"
                  className={
                    star <= stars ? "fill-[#ffd02f]" : "fill-[#ded9cb]"
                  }
                  key={star}
                  size={42}
                />
              ))}
            </div>
            <dl className="mx-auto mt-7 grid max-w-xl grid-cols-3 gap-3 text-[#17150f]">
              <div className="rounded-[12px] bg-[#cfe8ff] p-4">
                <dt className="text-xs font-extrabold uppercase">Score</dt>
                <dd className="mt-1 text-2xl font-black">{result.score}%</dd>
              </div>
              <div className="rounded-[12px] bg-[#91e3b7] p-4">
                <dt className="text-xs font-extrabold uppercase">Correct</dt>
                <dd className="mt-1 text-2xl font-black">
                  {result.correctCount}/5
                </dd>
              </div>
              <div className="rounded-[12px] bg-[#ffc1b9] p-4">
                <dt className="text-xs font-extrabold uppercase">Earned</dt>
                <dd className="mt-1 text-2xl font-black">+{result.xp} XP</dd>
              </div>
            </dl>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <LinkButton
                className="game-chip rounded-[12px] border-2 border-[#17150f] bg-[#17150f] text-white shadow-none"
                href={`/student/lessons/${lessonSlug}`}
              >
                <Check aria-hidden="true" size={18} /> Finish
              </LinkButton>
              <Button
                className="game-chip rounded-[12px] border-2 border-[#17150f] bg-[#fffdf4] text-[#17150f] shadow-none"
                onClick={startQuiz}
              >
                <RotateCcw aria-hidden="true" size={18} /> New quiz
              </Button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const question = questions[index];
  const selected = answers[question.id];
  const isLast = index === questions.length - 1;

  return (
    <main className="mx-auto max-w-5xl py-4">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-[#17150f] pb-5">
        <div>
          <h1 className="game-display text-4xl font-semibold text-[#17150f] sm:text-5xl">
            Fraction Final
          </h1>
          <p className="mt-2 font-bold text-[#514b3e]">
            Question {index + 1} of {questions.length}
          </p>
        </div>
        <div className="game-chip flex items-center gap-2 rounded-[12px] bg-[#91e3b7] px-4 py-3 font-black text-[#17150f]">
          <Medal aria-hidden="true" size={21} /> {Object.keys(answers).length}{" "}
          answered
        </div>
      </div>
      <div className="mt-5 h-4 overflow-hidden rounded-full border-2 border-[#17150f] bg-[#fffdf4]">
        <div
          className="h-full bg-[#5cc98c] transition-[width] duration-500"
          style={{ width: `${((index + 1) / questions.length) * 100}%` }}
        />
      </div>
      <section className="game-paper mt-6 rounded-[16px] p-5 sm:p-8">
        <h2 className="game-display max-w-3xl text-2xl font-semibold text-[#17150f] sm:text-4xl">
          {question.prompt}
        </h2>
        <fieldset className="mt-7 grid gap-4 sm:grid-cols-2">
          <legend className="sr-only">Choose one answer</legend>
          {question.options.map((option) => (
            <label
              className={`game-choice flex min-h-16 cursor-pointer items-center gap-3 rounded-[12px] p-4 font-extrabold text-[#17150f] ${selected === option.id ? "bg-[#ffd95f]" : "bg-[#fffef9]"}`}
              key={option.id}
            >
              <input
                checked={selected === option.id}
                name={question.id}
                onChange={() =>
                  setAnswers((current) => ({
                    ...current,
                    [question.id]: option.id,
                  }))
                }
                type="radio"
              />
              {option.label}
            </label>
          ))}
        </fieldset>
      </section>
      {error && (
        <p className="game-paper mt-5 rounded-[12px] bg-[#ffc1b9] p-4 font-bold text-[#7d1713]">
          {error}
        </p>
      )}
      <div className="mt-6 flex justify-between gap-3">
        <Button
          className="game-chip rounded-[12px] border-2 border-[#17150f] bg-[#fffdf4] text-[#17150f] shadow-none"
          disabled={index === 0 || loading}
          onClick={() => setIndex((current) => current - 1)}
          variant="secondary"
        >
          <ArrowLeft aria-hidden="true" size={18} /> Previous
        </Button>
        {isLast ? (
          <Button
            className="game-chip rounded-[12px] border-2 border-[#17150f] bg-[#ff6b5d] text-[#17150f] shadow-none hover:bg-[#ff8074]"
            disabled={
              Object.keys(answers).length !== questions.length || loading
            }
            onClick={submitQuiz}
          >
            {loading ? "Saving result…" : "Finish quiz"}{" "}
            <Trophy aria-hidden="true" size={18} />
          </Button>
        ) : (
          <Button
            className="game-chip rounded-[12px] border-2 border-[#17150f] bg-[#17150f] text-white shadow-none"
            disabled={!selected}
            onClick={() => setIndex((current) => current + 1)}
          >
            Next question <ArrowRight aria-hidden="true" size={18} />
          </Button>
        )}
      </div>
    </main>
  );
}
