"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { BridgeBuilder } from "@/components/quiz-games/bridge-builder";
import { TreasureMatch } from "@/components/quiz-games/treasure-match";
import { OrderTower } from "@/components/quiz-games/order-tower";
import { FractionRunner } from "@/components/quiz-games/fraction-runner";
import { PizzaCatch } from "@/components/quiz-games/pizza-catch";
import { NumberLineDash } from "@/components/quiz-games/number-line-dash";
import { createClient } from "@/lib/supabase/client";
import { isQuizDraftComplete } from "@/lib/quiz";
import type { PublicQuizQuestion, QuizAnswer } from "@/lib/quiz";
type Locked = {
  correct: boolean;
  explanation: string;
  correctResponse: QuizAnswer;
};
async function headers(): Promise<Record<string, string>> {
  const {
    data: { session },
  } = await createClient().auth.getSession();
  return session ? { Authorization: `Bearer ${session.access_token}` } : {};
}
export function QuizMode({ lessonSlug }: { lessonSlug: string }) {
  const [state, setState] = useState("restoring");
  const [sessionId, setSessionId] = useState("");
  const [questions, setQuestions] = useState<PublicQuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [draft, setDraft] = useState<QuizAnswer>();
  const [locked, setLocked] = useState<Record<string, Locked>>({});
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    score: number;
    correctCount: number;
    xp: number;
  } | null>(null);
  const restore = async () => {
    try {
      const r = await fetch(`/api/quiz/session?lessonSlug=${lessonSlug}`, {
        headers: await headers(),
      });
      if (r.status === 204) {
        setState("ready");
        return;
      }
      const b = await r.json();
      if (!r.ok) throw Error(b.error);
      setSessionId(b.sessionId);
      setQuestions(b.questions);
      setLocked(b.locked);
      setIndex(b.index);
      setState("playing");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not restore quiz.");
      setState("ready");
    }
  };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void restore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonSlug]);
  const start = async () => {
    setResult(null);
    setError("");
    setDraft(undefined);
    setLocked({});
    setIndex(0);
    setState("starting");
    const r = await fetch("/api/quiz/start", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(await headers()) },
      body: JSON.stringify({ lessonSlug }),
    });
    const b = await r.json();
    if (!r.ok) {
      setError(b.error);
      setState("ready");
      return;
    }
    setSessionId(b.sessionId);
    setQuestions(b.questions);
    setResult(null);
    setError("");
    setDraft(undefined);
    setLocked(b.locked ?? {});
    setIndex(b.index ?? 0);
    setState("playing");
  };
  const answer = async () => {
    const q = questions[index];
    const response =
      draft ??
      (q.type === "order_tower" ? q.items.map((item) => item.id) : undefined);
    if (!isQuizDraftComplete(q, response)) return;
    setState("submitting");
    const r = await fetch("/api/quiz/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(await headers()) },
      body: JSON.stringify({ sessionId, questionId: q.id, response }),
    });
    const b = await r.json();
    if (!r.ok) {
      setError(b.error);
      setState("answer-ready");
      return;
    }
    setLocked((x) => ({ ...x, [q.id]: b }));
    setState("feedback");
  };
  const finish = async () => {
    setState("finalizing");
    const r = await fetch("/api/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(await headers()) },
      body: JSON.stringify({ sessionId }),
    });
    const b = await r.json();
    if (!r.ok) {
      setError(b.error);
      setState("playing");
      return;
    }
    setResult(b);
    setState("result");
    window.dispatchEvent(new Event("aral-tayo:account-progress"));
  };
  if (state === "restoring")
    return <p className="py-12 text-center font-bold">Preparing your quest…</p>;
  if (state === "ready")
    return (
      <main className="mx-auto max-w-3xl py-8">
        <section className="game-paper rounded-2xl p-7">
          <h1 className="game-display text-4xl">Fraction Quest</h1>
          <p className="mt-3 font-bold text-[#514b3e]">
            Five shuffled game checkpoints. Catch, dash, build, match, and
            reorder your way through fractions.
          </p>
          {error && <p className="mt-4 font-bold text-[#7d1713]">{error}</p>}
          <Button className="mt-6" onClick={start}>
            Start quest
          </Button>
        </section>
      </main>
    );
  if (result) {
    const stars = result.score >= 80 ? 3 : result.score >= 60 ? 2 : 1;
    return (
      <main className="mx-auto max-w-3xl py-8">
        <section className="game-paper game-celebrate rounded-2xl p-8 text-center">
          <h1 className="game-display text-4xl">Quest cleared!</h1>
          <p aria-label={`${stars} out of 3 stars`} className="mt-5 text-4xl">
            {"★".repeat(stars)}
            {"☆".repeat(3 - stars)}
          </p>
          <dl className="mt-7 grid grid-cols-3 gap-3 font-black">
            <div className="rounded-xl bg-[#cfe8ff] p-4">
              <dt className="text-xs">Score</dt>
              <dd className="text-2xl">{result.score}%</dd>
            </div>
            <div className="rounded-xl bg-[#91e3b7] p-4">
              <dt className="text-xs">Correct</dt>
              <dd className="text-2xl">{result.correctCount}/5</dd>
            </div>
            <div className="rounded-xl bg-[#ffc1b9] p-4">
              <dt className="text-xs">Earned</dt>
              <dd className="text-2xl">+{result.xp} XP</dd>
            </div>
          </dl>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              className="game-chip inline-flex min-h-11 items-center justify-center rounded-xl bg-[#17150f] px-4 font-bold text-white"
              href={`/student/lessons/${lessonSlug}`}
            >
              Finish
            </Link>
            <Button onClick={start}>New quiz</Button>
          </div>
        </section>
      </main>
    );
  }
  if (index >= questions.length) {
    return (
      <main className="mx-auto max-w-3xl py-8">
        <section className="game-paper rounded-2xl p-7 text-center">
          <h1 className="game-display text-4xl">All checkpoints answered!</h1>
          <p className="mt-3 font-bold text-[#514b3e]">
            Your answers are locked in. Finish the quest to see your results.
          </p>
          {error && <p className="mt-4 font-bold text-[#7d1713]">{error}</p>}
          <Button
            className="mt-6"
            disabled={state === "finalizing"}
            onClick={() => void finish()}
          >
            {state === "finalizing" ? "Finishing…" : "Finish quest"}
          </Button>
        </section>
      </main>
    );
  }
  const q = questions[index];
  const currentLocked = locked[q.id];
  const name = {
    bridge_builder: "Bridge Builder",
    fraction_runner: "Fraction Runner",
    pizza_catch: "Pizza Slice Catch",
    number_line_dash: "Number-Line Dash",
    treasure_match: "Treasure Match",
    order_tower: "Order Tower",
  }[q.type];
  const initial =
    q.type === "order_tower" ? q.items.map((i) => i.id) : undefined;
  const value = draft ?? initial;
  const rendered =
    q.type === "bridge_builder" ? (
      <BridgeBuilder
        question={q}
        value={typeof value === "string" ? value : undefined}
        onChange={setDraft}
        disabled={!!currentLocked}
      />
    ) : q.type === "fraction_runner" ? (
      <FractionRunner
        question={q}
        value={typeof value === "string" ? value : undefined}
        onChange={setDraft}
        disabled={!!currentLocked}
      />
    ) : q.type === "pizza_catch" ? (
      <PizzaCatch
        question={q}
        value={typeof value === "string" ? value : undefined}
        onChange={setDraft}
        disabled={!!currentLocked}
      />
    ) : q.type === "number_line_dash" ? (
      <NumberLineDash
        question={q}
        value={typeof value === "string" ? value : undefined}
        onChange={setDraft}
        disabled={!!currentLocked}
      />
    ) : q.type === "treasure_match" ? (
      <TreasureMatch
        question={q}
        value={
          typeof value === "object" && !Array.isArray(value) ? value : undefined
        }
        onChange={setDraft}
        disabled={!!currentLocked}
      />
    ) : (
      <OrderTower
        question={q}
        value={Array.isArray(value) ? value : q.items.map((i) => i.id)}
        onChange={setDraft}
        disabled={!!currentLocked}
      />
    );
  return (
    <main className="mx-auto max-w-4xl py-5">
      <p aria-live="polite" className="sr-only">
        {currentLocked
          ? `${currentLocked.correct ? "Correct" : "Not quite"}. ${currentLocked.explanation}`
          : ""}
      </p>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#17150f] pb-4">
        <div>
          <h1 className="game-display text-3xl">Fraction Quest</h1>
          <p className="font-bold text-[#514b3e]">
            Checkpoint {index + 1} of {questions.length} · {name}
          </p>
        </div>
        <div className="flex gap-1" aria-label="Quest checkpoints">
          {questions.map((x, i) => (
            <span
              key={x.id}
              aria-label={`Checkpoint ${i + 1}${locked[x.id] ? " answered" : ""}`}
              className={`size-6 rounded-full border-2 border-[#17150f] ${locked[x.id] ? "bg-[#5cc98c]" : i === index ? "checkpoint-current bg-[#ffd95f]" : "bg-[#fffdf4]"}`}
            />
          ))}
        </div>
      </header>
      <section className="game-paper mt-6 min-h-[31rem] rounded-2xl p-5 sm:p-8">
        <h2 className="game-display text-2xl sm:text-4xl">{q.prompt}</h2>
        {rendered}
        {currentLocked && (
          <div
            className={`mt-6 rounded-xl p-4 font-bold ${currentLocked.correct ? "bg-[#91e3b7]" : "bg-[#ffd95f]"}`}
          >
            {currentLocked.correct ? "Correct! " : "Keep learning. "}
            {currentLocked.explanation}
          </div>
        )}
      </section>
      {error && <p className="mt-4 font-bold text-[#7d1713]">{error}</p>}
      <div className="mt-6 flex justify-end">
        {currentLocked ? (
          <Button
            onClick={() => {
              if (index === questions.length - 1) void finish();
              else {
                setIndex(index + 1);
                setDraft(undefined);
                setState("playing");
              }
            }}
            disabled={state === "finalizing"}
          >
            {index === questions.length - 1 ? "Finish quest" : "Continue"}
          </Button>
        ) : (
          <Button
            disabled={!isQuizDraftComplete(q, draft) || state === "submitting"}
            onClick={answer}
          >
            {state === "submitting" ? "Checking…" : "Lock answer"}
          </Button>
        )}
      </div>
    </main>
  );
}
