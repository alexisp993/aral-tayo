"use client";

import { CookingPot, Plus, RotateCcw } from "lucide-react";
import type { PublicQuizQuestion } from "@/lib/quiz";

type Question = Extract<PublicQuizQuestion, { type: "recipe_builder" }>;

export function RecipeBuilder({
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
  const selected = value.filter((id) =>
    question.ingredients.some((ingredient) => ingredient.id === id),
  );
  const toggle = (id: string) => {
    if (disabled) return;
    if (selected.includes(id)) {
      onChange(selected.filter((ingredientId) => ingredientId !== id));
      return;
    }
    if (selected.length < 2) onChange([...selected, id]);
  };
  const chosenIngredients = selected.map((id) =>
    question.ingredients.find((ingredient) => ingredient.id === id),
  );

  return (
    <div className="mt-7">
      <p className="font-bold text-[#514b3e]">
        Pick two measuring cups. Tap a selected ingredient to put it back.
      </p>
      <div className="recipe-workspace mt-5">
        <div>
          <p className="game-display text-lg">Ingredient shelf</p>
          <div className="recipe-pantry mt-3">
            {question.ingredients.map((ingredient) => {
              const isSelected = selected.includes(ingredient.id);
              const shelfFull = selected.length === 2 && !isSelected;
              return (
                <button
                  aria-pressed={isSelected}
                  className="game-choice recipe-ingredient min-h-14 rounded-xl px-4 py-3 text-left font-black"
                  data-selected={isSelected}
                  disabled={disabled || shelfFull}
                  key={ingredient.id}
                  onClick={() => toggle(ingredient.id)}
                  type="button"
                >
                  <span aria-hidden="true" className="recipe-measure">
                    {ingredient.label.split(" ")[0]}
                  </span>
                  <span>{ingredient.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <section aria-label="Mixing bowl" className="recipe-bowl-station">
          <CookingPot aria-hidden="true" size={38} strokeWidth={2.4} />
          <h3 className="game-display mt-2 text-xl">Mixing bowl</h3>
          <div className="recipe-bowl mt-4">
            {[0, 1].map((slot) => {
              const ingredient = chosenIngredients[slot];
              return (
                <div className="recipe-bowl-slot" key={slot}>
                  {ingredient ? ingredient.label : "Empty measure"}
                </div>
              );
            })}
            <Plus aria-hidden="true" className="recipe-plus" size={20} />
          </div>
          <p aria-live="polite" className="mt-4 text-sm font-bold">
            {selected.length === 2
              ? "Recipe ready to lock in."
              : `${2 - selected.length} ingredient${selected.length === 1 ? "" : "s"} left to add.`}
          </p>
          <button
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-[#17150f] bg-[#fffdf4] px-4 font-black disabled:opacity-45"
            disabled={disabled || selected.length === 0}
            onClick={() => onChange([])}
            type="button"
          >
            <RotateCcw aria-hidden="true" size={18} />
            Empty bowl
          </button>
        </section>
      </div>
    </div>
  );
}
