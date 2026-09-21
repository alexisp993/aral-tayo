"use client";

import { ArrowDown, ArrowUp, Building2 } from "lucide-react";
import { useState } from "react";
import type { PublicQuizQuestion } from "@/lib/quiz";

export function OrderTower({
  question,
  value,
  onChange,
  disabled,
}: {
  question: Extract<PublicQuizQuestion, { type: "order_tower" }>;
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
}) {
  const [reorderedId, setReorderedId] = useState<string>();
  const move = (from: number, to: number) => {
    const next = [...value];
    [next[from], next[to]] = [next[to], next[from]];
    setReorderedId(next[to]);
    onChange(next);
  };

  return (
    <section className="mt-6 overflow-hidden rounded-xl border-2 border-[#17150f] bg-[#cfe8ff] p-4 sm:p-6">
      <div className="flex items-center gap-2 text-sm font-black text-[#514b3e]">
        <Building2 aria-hidden="true" size={19} /> Stack the tower from first
        step to last
      </div>
      <ol
        aria-label="Tower floors"
        className="mx-auto mt-5 grid max-w-2xl gap-2"
      >
        {value.map((id, index) => {
          const item = question.items.find((candidate) => candidate.id === id)!;
          return (
            <li
              key={id}
              className={`game-choice flex items-center gap-2 rounded-xl p-3 font-bold sm:gap-3 ${reorderedId === id ? "tower-reordered" : ""}`}
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#ffd95f]">
                {index + 1}
              </span>
              <span className="flex-1">{item.label}</span>
              <button
                aria-label={`Move ${item.label} up`}
                className="game-chip grid size-11 shrink-0 place-items-center rounded-lg bg-[#fffdf4]"
                type="button"
                disabled={disabled || index === 0}
                onClick={() => move(index, index - 1)}
              >
                <ArrowUp aria-hidden="true" size={19} />
              </button>
              <button
                aria-label={`Move ${item.label} down`}
                className="game-chip grid size-11 shrink-0 place-items-center rounded-lg bg-[#fffdf4]"
                type="button"
                disabled={disabled || index === value.length - 1}
                onClick={() => move(index, index + 1)}
              >
                <ArrowDown aria-hidden="true" size={19} />
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
