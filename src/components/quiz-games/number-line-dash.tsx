"use client";

import {
  ChevronLeft,
  ChevronRight,
  Flag,
  MapPin,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
import { useEffect, useMemo, useReducer, useState } from "react";
import type { PublicQuizQuestion } from "@/lib/quiz";
import {
  initialNumberLineDashState,
  reduceNumberLineDashState,
} from "./number-line-dash-state";

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

export function NumberLineDash({
  question,
  value,
  onChange,
  disabled,
}: {
  question: Extract<PublicQuizQuestion, { type: "number_line_dash" }>;
  value?: string;
  onChange: (value?: string) => void;
  disabled?: boolean;
}) {
  const [game, dispatch] = useReducer(
    reduceNumberLineDashState,
    initialNumberLineDashState,
  );
  const reducedMotion = useReducedMotion();
  const locked = Boolean(disabled);
  const { stepCount, stepDurationMs } = question.course;
  const positionIds = useMemo(
    () => question.positions.map((position) => position.id),
    [question.positions],
  );

  useEffect(() => {
    if (game.phase !== "placed" || !game.placedPositionId || value) return;
    onChange(game.placedPositionId);
  }, [game.phase, game.placedPositionId, onChange, value]);

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
        dispatch({ type: "advance", stepCount, positionIds });
        accumulator -= stepDurationMs;
        advances += 1;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [game.phase, locked, positionIds, reducedMotion, stepCount, stepDurationMs]);

  const timeLeft = Math.max(0, stepCount - game.step);
  const placed = question.positions.find(
    (position) => position.id === (value ?? game.placedPositionId),
  );
  const restart = () => {
    dispatch({ type: "reset" });
    onChange(undefined);
  };

  return (
    <section className="number-line-dash mt-6" aria-label="Number-Line Dash game">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-bold">Move the marker before the flag drops.</p>
        <span className="game-chip rounded-full bg-[#ffd95f] px-3 py-1 text-sm font-black">
          {game.phase === "placed" ? "Position locked" : `${timeLeft} beats left`}
        </span>
      </div>
      <p aria-live="polite" className="sr-only">
        {game.phase === "paused"
          ? "Number line paused."
          : placed
            ? `Marker stopped at ${placed.label}. The answer is ready to lock.`
            : `Marker at ${question.positions[game.position].label}.`}
      </p>
      <div className="number-line-field mt-5 rounded-xl border-2 border-[#17150f] bg-[#cfe8ff] px-3 py-8 sm:px-6">
        <div className="number-line-track" role="img" aria-label="Number line from zero to one">
          {question.positions.map((position, index) => (
            <div className="number-line-point" key={position.id}>
              {game.position === index && (
                <MapPin aria-label={`Marker at ${position.label}`} className="number-line-marker" size={31} />
              )}
              <span className="number-line-tick" />
              <strong>{position.label}</strong>
            </div>
          ))}
        </div>
        <div className="mt-8 flex items-center gap-2 text-sm font-black text-[#514b3e]">
          <Flag aria-hidden="true" size={19} />
          Reach the right point before the last beat.
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {game.phase === "ready" && (
          <button className="game-chip inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#ff6b5d] px-4 font-black" disabled={locked} onClick={() => dispatch({ type: "start" })} type="button"><Play aria-hidden="true" size={19} /> Start dash</button>
        )}
        {game.phase === "paused" && (
          <button className="game-chip inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#ff6b5d] px-4 font-black" disabled={locked} onClick={() => dispatch({ type: "resume" })} type="button"><Play aria-hidden="true" size={19} /> Resume</button>
        )}
        {game.phase === "running" && !reducedMotion && (
          <button className="game-chip inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#fffdf4] px-4 font-black" onClick={() => dispatch({ type: "pause" })} type="button"><Pause aria-hidden="true" size={19} /> Pause</button>
        )}
        {game.phase === "running" && reducedMotion && (
          <button className="game-chip min-h-11 rounded-xl bg-[#ff6b5d] px-4 font-black" onClick={() => dispatch({ type: "advance", stepCount, positionIds })} type="button">Advance one beat</button>
        )}
        {game.phase === "placed" && !locked && (
          <button className="game-chip inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#fffdf4] px-4 font-black" onClick={restart} type="button"><RotateCcw aria-hidden="true" size={19} /> Dash again</button>
        )}
        <div className="ml-auto flex gap-2">
          <button aria-label="Move marker left" className="game-chip grid size-11 place-items-center rounded-lg bg-[#fffdf4]" disabled={locked || game.phase !== "running" || game.position === 0} onClick={() => dispatch({ type: "move", direction: -1 })} type="button"><ChevronLeft aria-hidden="true" /></button>
          <button aria-label="Move marker right" className="game-chip grid size-11 place-items-center rounded-lg bg-[#fffdf4]" disabled={locked || game.phase !== "running" || game.position === 4} onClick={() => dispatch({ type: "move", direction: 1 })} type="button"><ChevronRight aria-hidden="true" /></button>
        </div>
      </div>
      {reducedMotion && (
        <p className="mt-3 text-sm font-bold text-[#514b3e]">Step mode is on: move the marker, then advance one beat.</p>
      )}
    </section>
  );
}
