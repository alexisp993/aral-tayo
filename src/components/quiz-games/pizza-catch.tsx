"use client";

import {
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
import { useEffect, useMemo, useReducer, useState } from "react";
import type { PublicQuizQuestion } from "@/lib/quiz";
import {
  initialPizzaCatchState,
  reducePizzaCatchState,
} from "./pizza-catch-state";

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (!window.matchMedia) return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

export function PizzaCatch({
  question,
  value,
  onChange,
  disabled,
}: {
  question: Extract<PublicQuizQuestion, { type: "pizza_catch" }>;
  value?: string;
  onChange: (value?: string) => void;
  disabled?: boolean;
}) {
  const [game, dispatch] = useReducer(
    reducePizzaCatchState,
    initialPizzaCatchState,
  );
  const reducedMotion = useReducedMotion();
  const locked = Boolean(disabled);
  const { stepCount, stepDurationMs } = question.course;
  const sliceIds = useMemo(
    () => question.slices.map((slice) => slice.id),
    [question.slices],
  );

  useEffect(() => {
    if (game.phase !== "caught" || !game.caughtSliceId || value) return;
    onChange(game.caughtSliceId);
  }, [game.caughtSliceId, game.phase, onChange, value]);

  useEffect(() => {
    const pauseWhenHidden = () => {
      if (document.hidden) dispatch({ type: "pause" });
    };
    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () => document.removeEventListener("visibilitychange", pauseWhenHidden);
  }, []);

  useEffect(() => {
    const steer = (event: KeyboardEvent) => {
      if (locked || game.phase !== "running") return;
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        event.preventDefault();
        dispatch({ type: "move", direction: -1 });
      } else if (
        event.key === "ArrowRight" ||
        event.key.toLowerCase() === "d"
      ) {
        event.preventDefault();
        dispatch({ type: "move", direction: 1 });
      }
    };
    window.addEventListener("keydown", steer);
    return () => window.removeEventListener("keydown", steer);
  }, [game.phase, locked]);

  useEffect(() => {
    if (reducedMotion || locked || game.phase !== "running") return;
    let frame = 0;
    let last = performance.now();
    let accumulator = 0;
    const tick = (now: number) => {
      accumulator += Math.min(now - last, stepDurationMs * 2);
      last = now;
      let advances = 0;
      while (accumulator >= stepDurationMs && advances < 3) {
        dispatch({ type: "advance", stepCount, sliceIds });
        accumulator -= stepDurationMs;
        advances += 1;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [game.phase, locked, reducedMotion, sliceIds, stepCount, stepDurationMs]);

  const progress = Math.round((game.step / stepCount) * 100);
  const restart = () => {
    dispatch({ type: "reset" });
    onChange(undefined);
  };
  const caught = question.slices.find(
    (slice) => slice.id === (value ?? game.caughtSliceId),
  );

  return (
    <section className="pizza-catch mt-6" aria-label="Pizza Slice Catch game">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-bold">
          Slide the plate under the fraction you want to catch.
        </p>
        <span className="game-chip rounded-full bg-[#ffd95f] px-3 py-1 text-sm font-black">
          {game.phase === "caught" ? "Slice caught" : `${progress}% fallen`}
        </span>
      </div>
      <p aria-live="polite" className="sr-only">
        {game.phase === "paused"
          ? "Pizza catch paused."
          : caught
            ? `Caught ${caught.label}. The answer is ready to lock.`
            : `Plate in lane ${game.lane + 1}.`}
      </p>
      <div className="pizza-kitchen mt-5 overflow-hidden rounded-xl border-2 border-[#17150f] bg-[#fff1b8] p-3 sm:p-5">
        <div className="pizza-drop-zone grid grid-cols-3 gap-2" role="img" aria-label="Three falling fraction slices and a movable plate">
          {question.slices.map((slice, index) => (
            <div className="pizza-drop-lane" key={slice.id}>
              <div
                className="pizza-slice-card"
                style={{ transform: `translateY(${progress * 1.35}px)` }}
              >
                <CircleDot aria-hidden="true" size={24} />
                <span>{slice.label}</span>
              </div>
              <div
                aria-label={game.lane === index ? `Plate in lane ${index + 1}` : undefined}
                className={`pizza-plate ${game.lane === index ? "pizza-plate-active" : ""}`}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {game.phase === "ready" && (
          <button className="game-chip inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#ff6b5d] px-4 font-black" disabled={locked} onClick={() => dispatch({ type: "start" })} type="button">
            <Play aria-hidden="true" size={19} /> Start catching
          </button>
        )}
        {game.phase === "paused" && (
          <button className="game-chip inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#ff6b5d] px-4 font-black" disabled={locked} onClick={() => dispatch({ type: "resume" })} type="button">
            <Play aria-hidden="true" size={19} /> Resume
          </button>
        )}
        {game.phase === "running" && !reducedMotion && (
          <button className="game-chip inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#fffdf4] px-4 font-black" onClick={() => dispatch({ type: "pause" })} type="button">
            <Pause aria-hidden="true" size={19} /> Pause
          </button>
        )}
        {game.phase === "running" && reducedMotion && (
          <button className="game-chip min-h-11 rounded-xl bg-[#ff6b5d] px-4 font-black" onClick={() => dispatch({ type: "advance", stepCount, sliceIds })} type="button">
            Drop one step
          </button>
        )}
        {game.phase === "caught" && !locked && (
          <button className="game-chip inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#fffdf4] px-4 font-black" onClick={restart} type="button">
            <RotateCcw aria-hidden="true" size={19} /> Try another catch
          </button>
        )}
        <div className="ml-auto flex gap-2">
          <button aria-label="Move plate left" className="game-chip grid size-11 place-items-center rounded-lg bg-[#fffdf4]" disabled={locked || game.phase !== "running" || game.lane === 0} onClick={() => dispatch({ type: "move", direction: -1 })} type="button"><ChevronLeft aria-hidden="true" /></button>
          <button aria-label="Move plate right" className="game-chip grid size-11 place-items-center rounded-lg bg-[#fffdf4]" disabled={locked || game.phase !== "running" || game.lane === 2} onClick={() => dispatch({ type: "move", direction: 1 })} type="button"><ChevronRight aria-hidden="true" /></button>
        </div>
      </div>
      {reducedMotion && (
        <p className="mt-3 text-sm font-bold text-[#514b3e]">
          Step mode is on: move the plate, then drop the slices one step.
        </p>
      )}
    </section>
  );
}
