"use client";

import {
  ChevronLeft,
  ChevronRight,
  Crosshair,
  RotateCcw,
  Send,
} from "lucide-react";
import { useEffect, useMemo, useReducer } from "react";
import type { PublicQuizQuestion } from "@/lib/quiz";
import {
  initialFractionCannonState,
  reduceFractionCannonState,
} from "./fraction-cannon-state";

export function FractionCannon({
  question,
  value,
  onChange,
  disabled,
}: {
  question: Extract<PublicQuizQuestion, { type: "fraction_cannon" }>;
  value?: string;
  onChange: (value?: string) => void;
  disabled?: boolean;
}) {
  const [game, dispatch] = useReducer(
    reduceFractionCannonState,
    initialFractionCannonState,
  );
  const targetIds = useMemo(
    () => question.targets.map((target) => target.id),
    [question.targets],
  );
  const locked = Boolean(disabled);

  useEffect(() => {
    if (game.phase !== "fired" || !game.firedTargetId || value) return;
    onChange(game.firedTargetId);
  }, [game.firedTargetId, game.phase, onChange, value]);

  useEffect(() => {
    const controls = (event: KeyboardEvent) => {
      if (locked || game.phase !== "aiming") return;
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        event.preventDefault();
        dispatch({ type: "aim", direction: -1 });
      } else if (
        event.key === "ArrowRight" ||
        event.key.toLowerCase() === "d"
      ) {
        event.preventDefault();
        dispatch({ type: "aim", direction: 1 });
      } else if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        dispatch({ type: "fire", targetIds });
      }
    };
    window.addEventListener("keydown", controls);
    return () => window.removeEventListener("keydown", controls);
  }, [game.phase, locked, targetIds]);

  const hit = question.targets.find(
    (target) => target.id === (value ?? game.firedTargetId),
  );
  const restart = () => {
    dispatch({ type: "reset" });
    onChange(undefined);
  };

  return (
    <section className="fraction-cannon mt-6" aria-label="Fraction Cannon game">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-bold">Aim with the arrows, then fire at a target.</p>
        <span className="game-chip rounded-full bg-[#ffd95f] px-3 py-1 text-sm font-black">
          {game.phase === "fired" ? "Target hit" : `Aiming at target ${game.target + 1}`}
        </span>
      </div>
      <p aria-live="polite" className="sr-only">
        {hit
          ? `Hit ${hit.label}. The answer is ready to lock.`
          : `Aiming at ${question.targets[game.target].label}.`}
      </p>
      <div className="cannon-field mt-5 overflow-hidden rounded-xl border-2 border-[#17150f] bg-[#cfe8ff] p-4 sm:p-6">
        <div className="cannon-targets grid grid-cols-3 gap-3">
          {question.targets.map((target, index) => (
            <div
              aria-label={`Target ${index + 1}: ${target.label}${game.target === index ? ", aimed" : ""}`}
              className={`cannon-target ${game.target === index ? "cannon-target-aimed" : ""} ${hit?.id === target.id ? "cannon-target-hit" : ""}`}
              key={target.id}
            >
              <Crosshair aria-hidden="true" size={24} />
              <strong>{target.label}</strong>
            </div>
          ))}
        </div>
        <div className={`cannon-shot cannon-aim-${game.target}`}>
          <div className="cannon-barrel" aria-hidden="true" />
          {game.phase === "fired" && <span className="cannon-projectile" aria-hidden="true" />}
          <div className="cannon-base" aria-label="Fraction cannon" />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {game.phase === "aiming" ? (
          <button className="game-chip inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#ff6b5d] px-4 font-black" disabled={locked} onClick={() => dispatch({ type: "fire", targetIds })} type="button"><Send aria-hidden="true" size={19} /> Fire</button>
        ) : !locked ? (
          <button className="game-chip inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#fffdf4] px-4 font-black" onClick={restart} type="button"><RotateCcw aria-hidden="true" size={19} /> Aim again</button>
        ) : null}
        <div className="ml-auto flex gap-2">
          <button aria-label="Aim left" className="game-chip grid size-11 place-items-center rounded-lg bg-[#fffdf4]" disabled={locked || game.phase !== "aiming" || game.target === 0} onClick={() => dispatch({ type: "aim", direction: -1 })} type="button"><ChevronLeft aria-hidden="true" /></button>
          <button aria-label="Aim right" className="game-chip grid size-11 place-items-center rounded-lg bg-[#fffdf4]" disabled={locked || game.phase !== "aiming" || game.target === 2} onClick={() => dispatch({ type: "aim", direction: 1 })} type="button"><ChevronRight aria-hidden="true" /></button>
        </div>
      </div>
    </section>
  );
}
