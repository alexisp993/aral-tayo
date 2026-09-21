"use client";

import { KeyRound, Lock, Unlock } from "lucide-react";
import { useState } from "react";
import type { PublicQuizQuestion } from "@/lib/quiz";
export function TreasureMatch({
  question,
  value = {},
  onChange,
  disabled,
}: {
  question: Extract<PublicQuizQuestion, { type: "treasure_match" }>;
  value?: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
  disabled?: boolean;
}) {
  const [selectedSource, setSelectedSource] = useState<string>();
  const matchedSources = question.sources.filter((source) => value[source]);
  const availableSources = question.sources.filter((source) => !value[source]);
  const usedTargets = new Set(Object.values(value));
  const remaining = question.sources.length - matchedSources.length;

  const chooseChest = (target: string) => {
    if (!selectedSource || usedTargets.has(target)) return;
    onChange({ ...value, [selectedSource]: target });
    setSelectedSource(undefined);
  };

  const editMatch = (source: string) => {
    const next = { ...value };
    delete next[source];
    onChange(next);
    setSelectedSource(source);
  };

  return (
    <fieldset className="mt-6 grid gap-5">
      <legend className="font-bold">
        Pick a fraction key, then unlock its matching treasure chest.
      </legend>
      <p aria-live="polite" className="sr-only">
        {selectedSource
          ? `Selected key: ${selectedSource}. Choose a treasure chest.`
          : `${remaining} pair${remaining === 1 ? "" : "s"} remaining.`}
      </p>
      <div className="grid gap-5 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
        <section aria-label="Fraction keys" className="grid gap-3">
          <h3 className="text-sm font-black tracking-wide text-[#514b3e] uppercase">
            Fraction keys
          </h3>
          {availableSources.length ? (
            availableSources.map((source) => (
              <button
                aria-pressed={selectedSource === source}
                className={`game-choice flex min-h-14 items-center gap-3 rounded-xl px-4 text-left font-black ${selectedSource === source ? "bg-[#ffd95f]" : ""}`}
                disabled={disabled}
                key={source}
                onClick={() => setSelectedSource(source)}
                type="button"
              >
                <KeyRound aria-hidden="true" size={22} />
                <span>{source}</span>
              </button>
            ))
          ) : (
            <p className="rounded-xl border-2 border-dashed border-[#17150f] bg-[#fffdf4] p-4 font-bold">
              Every key has found a chest.
            </p>
          )}
        </section>
        <div
          aria-hidden="true"
          className="hidden h-24 border-l-2 border-dashed border-[#17150f] lg:block"
        />
        <section aria-label="Treasure chests" className="grid gap-3">
          <h3 className="text-sm font-black tracking-wide text-[#514b3e] uppercase">
            Treasure chests
          </h3>
          {question.targets.map((target) => {
            const isUsed = usedTargets.has(target);
            return (
              <button
                aria-label={`${isUsed ? "Locked" : "Unlock"} chest ${target}`}
                className={`game-choice flex min-h-14 items-center gap-3 rounded-xl px-4 text-left font-black ${isUsed ? "bg-[#ded9cb]" : "bg-[#cfe8ff]"}`}
                disabled={disabled || !selectedSource || isUsed}
                key={target}
                onClick={() => chooseChest(target)}
                type="button"
              >
                {isUsed ? (
                  <Lock aria-hidden="true" size={22} />
                ) : (
                  <span
                    aria-hidden="true"
                    className="relative size-6 rounded-b-md border-2 border-[#17150f] bg-[#ffd95f] before:absolute before:-top-2 before:left-0 before:h-2 before:w-[calc(100%+4px)] before:-translate-x-[2px] before:rounded-t-md before:border-2 before:border-[#17150f] before:bg-[#ffc1b9] after:absolute after:top-2 after:left-1/2 after:size-1.5 after:-translate-x-1/2 after:rounded-full after:bg-[#17150f]"
                  />
                )}
                <span>{target}</span>
              </button>
            );
          })}
        </section>
      </div>
      <section
        aria-label="Unlocked pairs"
        className="border-t-2 border-[#17150f] pt-4"
      >
        <h3 className="text-sm font-black tracking-wide text-[#514b3e] uppercase">
          Unlocked tray · {matchedSources.length}/{question.sources.length}
        </h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {matchedSources.map((source) => (
            <button
              aria-label={`Matched ${source} with chest ${value[source]}. Edit match.`}
              className="treasure-unlocked flex min-h-12 items-center gap-2 rounded-xl border-2 border-[#17150f] bg-[#91e3b7] px-3 text-left font-black"
              disabled={disabled}
              key={source}
              onClick={() => editMatch(source)}
              type="button"
            >
              <Unlock aria-hidden="true" size={19} />
              <span className="min-w-0 flex-1">
                {source} → {value[source]}
              </span>
            </button>
          ))}
        </div>
      </section>
    </fieldset>
  );
}
