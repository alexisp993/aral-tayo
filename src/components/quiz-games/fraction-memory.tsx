"use client";

import { Brain, Check, RotateCcw } from "lucide-react";
import { useState } from "react";
import type { PublicQuizQuestion } from "@/lib/quiz";

type Question = Extract<PublicQuizQuestion, { type: "fraction_memory" }>;

function fractionValue(label: string) {
  const [numerator, denominator] = label.split("/").map(Number);
  return numerator / denominator;
}

function pairToken(ids: string[]) {
  return [...ids].sort().join(":");
}

export function FractionMemory({
  question,
  value = [],
  onChange,
  disabled,
}: {
  question: Question;
  value?: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
}) {
  const completed = value.length === question.cards.length / 2;
  const pairCount = question.cards.length / 2;
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [pairs, setPairs] = useState<string[]>([]);
  const [mismatch, setMismatch] = useState(false);
  const visibleIds = completed
    ? question.cards.map((card) => card.id)
    : [...matched, ...flipped];

  const flip = (id: string) => {
    if (
      disabled ||
      completed ||
      mismatch ||
      matched.includes(id) ||
      flipped.includes(id)
    )
      return;
    if (flipped.length === 0) {
      setFlipped([id]);
      return;
    }
    const first = question.cards.find((card) => card.id === flipped[0])!;
    const second = question.cards.find((card) => card.id === id)!;
    const nextFlipped = [first.id, second.id];
    setFlipped(nextFlipped);
    if (fractionValue(first.label) !== fractionValue(second.label)) {
      setMismatch(true);
      return;
    }
    const nextMatched = [...matched, ...nextFlipped];
    const nextPairs = [...pairs, pairToken(nextFlipped)];
    setMatched(nextMatched);
    setPairs(nextPairs);
    setFlipped([]);
    if (nextMatched.length === question.cards.length) onChange(nextPairs);
  };

  const resetBoard = () => {
    setFlipped([]);
    setMatched([]);
    setPairs([]);
    setMismatch(false);
    onChange([]);
  };

  return (
    <div className="mt-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-bold text-[#514b3e]">
          Flip two cards. Equivalent fractions stay face up.
        </p>
        <span className="game-chip rounded-full bg-[#ffd95f] px-3 py-1 text-sm font-black">
          {completed ? pairCount : matched.length / 2} of {pairCount} pairs
        </span>
      </div>

      <div aria-label="Fraction memory cards" className="memory-board mt-5">
        {question.cards.map((card, index) => {
          const visible = visibleIds.includes(card.id);
          const isMatched = completed || matched.includes(card.id);
          return (
            <button
              aria-label={
                visible
                  ? `${card.label}${isMatched ? ", matched" : ", face up"}`
                  : `Card ${index + 1}, face down`
              }
              className="memory-card"
              data-matched={isMatched}
              data-visible={visible}
              disabled={disabled || completed || mismatch || isMatched}
              key={card.id}
              onClick={() => flip(card.id)}
              type="button"
            >
              <span aria-hidden="true" className="memory-card-face memory-card-back">
                <Brain size={30} strokeWidth={2.4} />
              </span>
              <span aria-hidden="true" className="memory-card-face memory-card-front">
                {isMatched && <Check className="memory-check" size={20} />}
                {card.label}
              </span>
            </button>
          );
        })}
      </div>

      <div aria-live="polite" className="memory-status mt-5">
        {completed ? (
          <p className="font-black">Board cleared! Lock in your matches.</p>
        ) : mismatch ? (
          <>
            <p className="font-black">Those fractions are not equivalent yet.</p>
            <button
              className="game-choice mt-3 min-h-11 rounded-xl px-4 font-black"
              onClick={() => {
                setFlipped([]);
                setMismatch(false);
              }}
              type="button"
            >
              Flip cards back
            </button>
          </>
        ) : flipped.length === 1 ? (
          <p className="font-black">Choose one more card.</p>
        ) : (
          <p className="font-black">Find your first pair.</p>
        )}
      </div>

      <button
        className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-[#17150f] bg-[#fffdf4] px-4 font-black disabled:opacity-45"
        disabled={disabled || (matched.length === 0 && flipped.length === 0)}
        onClick={resetBoard}
        type="button"
      >
        <RotateCcw aria-hidden="true" size={18} />
        Reset board
      </button>
    </div>
  );
}
