"use client";

import { ChevronLeft, ChevronRight, Pause, Play, Rabbit, RotateCcw } from "lucide-react";
import { useEffect, useReducer, useState } from "react";
import type { PublicQuizQuestion } from "@/lib/quiz";
import { initialRunnerState, reduceRunnerState } from "./fraction-runner-state";

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

export function FractionRunner({
  question,
  value,
  onChange,
  disabled,
}: {
  question: Extract<PublicQuizQuestion, { type: "fraction_runner" }>;
  value?: string;
  onChange: (value?: string) => void;
  disabled?: boolean;
}) {
  const [runner, dispatch] = useReducer(reduceRunnerState, initialRunnerState);
  const reducedMotion = useReducedMotion();
  const locked = Boolean(disabled);
  const track = question.course;

  useEffect(() => {
    if (runner.phase !== "finished" || !runner.finishedOptionId || value) return;
    onChange(runner.finishedOptionId);
  }, [onChange, runner.finishedOptionId, runner.phase, value]);

  useEffect(() => {
    const pauseWhenHidden = () => {
      if (document.hidden) dispatch({ type: "pause" });
    };
    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () => document.removeEventListener("visibilitychange", pauseWhenHidden);
  }, []);

  useEffect(() => {
    const controls = (event: KeyboardEvent) => {
      if (locked || runner.phase !== "running") return;
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        event.preventDefault();
        dispatch({ type: "move", direction: -1 });
      }
      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        event.preventDefault();
        dispatch({ type: "move", direction: 1 });
      }
    };
    window.addEventListener("keydown", controls);
    return () => window.removeEventListener("keydown", controls);
  }, [locked, runner.phase]);

  useEffect(() => {
    if (reducedMotion || locked || runner.phase !== "running") return;
    let frame = 0;
    let last = performance.now();
    let accumulator = 0;
    const tick = (now: number) => {
      accumulator += Math.min(now - last, track.stepDurationMs * 2);
      last = now;
      let advances = 0;
      while (accumulator >= track.stepDurationMs && advances < 3) {
        dispatch({ type: "advance", ...track, lanes: question.lanes.map((lane) => lane.id) });
        accumulator -= track.stepDurationMs;
        advances += 1;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [locked, question.lanes, reducedMotion, runner.phase, track]);

  const advance = () =>
    dispatch({ type: "advance", ...track, lanes: question.lanes.map((lane) => lane.id) });
  const restart = () => {
    dispatch({ type: "reset" });
    onChange(undefined);
  };
  const progress = Math.round((runner.step / track.stepCount) * 100);
  const obstacleAt = (lane: number) =>
    track.obstacles.some((obstacle) => obstacle.lane === lane && obstacle.step > runner.step);

  return (
    <section className="fraction-runner mt-6" aria-label="Fraction Runner game">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-bold">Steer around cones, then cross the finish gate.</p>
        <span className="game-chip rounded-full bg-[#ffd95f] px-3 py-1 text-sm font-black">
          {progress}% track cleared
        </span>
      </div>
      <p aria-live="polite" className="sr-only">
        {runner.phase === "paused" ? "Runner paused." : runner.penaltySteps ? "Bumped an obstacle. Recovering." : runner.phase === "finished" ? "Finish crossed. Your lane is ready to lock." : `Lane ${runner.lane + 1}, step ${runner.step} of ${track.stepCount}.`}
      </p>
      <div className="runner-track mt-5 overflow-hidden rounded-xl border-2 border-[#17150f] bg-[#cfe8ff] p-3 sm:p-5">
        <div className="runner-progress h-3 overflow-hidden rounded-full border-2 border-[#17150f] bg-[#fffdf4]" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>
        <div className="runner-road mt-4 grid gap-2" role="img" aria-label="Three lane fraction race track">
          {question.lanes.map((lane, index) => (
            <div className={`runner-lane ${runner.lane === index ? "runner-lane-active" : ""}`} key={lane.id}>
              <span className="runner-lane-number">{index + 1}</span>
              {runner.lane === index && <Rabbit aria-label="Runner" className={`runner-character ${runner.penaltySteps ? "runner-bump" : ""}`} size={30} />}
              {obstacleAt(index) && <span aria-label="Cone obstacle ahead" className="runner-cone">▲</span>}
              <span className="runner-finish-gate">{lane.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {runner.phase === "ready" && (
          <button className="game-chip inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#ff6b5d] px-4 font-black" disabled={locked} onClick={() => dispatch({ type: "start" })} type="button">
            <Play aria-hidden="true" size={19} /> Start run
          </button>
        )}
        {runner.phase === "paused" && (
          <button className="game-chip inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#ff6b5d] px-4 font-black" disabled={locked} onClick={() => dispatch({ type: "resume" })} type="button">
            <Play aria-hidden="true" size={19} /> Resume run
          </button>
        )}
        {runner.phase === "running" && !reducedMotion && (
          <button className="game-chip inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#fffdf4] px-4 font-black" onClick={() => dispatch({ type: "pause" })} type="button">
            <Pause aria-hidden="true" size={19} /> Pause
          </button>
        )}
        {runner.phase === "running" && reducedMotion && (
          <button className="game-chip inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#ff6b5d] px-4 font-black" onClick={advance} type="button">
            Advance step
          </button>
        )}
        {runner.phase === "finished" && !locked && (
          <button className="game-chip inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#fffdf4] px-4 font-black" onClick={restart} type="button">
            <RotateCcw aria-hidden="true" size={19} /> Run again
          </button>
        )}
        <div className="ml-auto flex gap-2">
          <button aria-label="Move left" className="game-chip grid size-11 place-items-center rounded-lg bg-[#fffdf4]" disabled={locked || runner.phase !== "running" || runner.lane === 0} onClick={() => dispatch({ type: "move", direction: -1 })} type="button"><ChevronLeft aria-hidden="true" /></button>
          <button aria-label="Move right" className="game-chip grid size-11 place-items-center rounded-lg bg-[#fffdf4]" disabled={locked || runner.phase !== "running" || runner.lane === 2} onClick={() => dispatch({ type: "move", direction: 1 })} type="button"><ChevronRight aria-hidden="true" /></button>
        </div>
      </div>
      {reducedMotion && <p className="mt-3 text-sm font-bold text-[#514b3e]">Step mode is on: use Advance step to play without automatic motion.</p>}
    </section>
  );
}
