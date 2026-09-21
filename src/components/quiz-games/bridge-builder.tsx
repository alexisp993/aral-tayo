import { Layers3, Waves } from "lucide-react";
import type { PublicQuizQuestion } from "@/lib/quiz";

export function BridgeBuilder({
  question,
  value,
  onChange,
  disabled,
}: {
  question: Extract<PublicQuizQuestion, { type: "bridge_builder" }>;
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const selected = question.options.find((option) => option.id === value);

  return (
    <fieldset className="mt-6 grid gap-5">
      <legend className="font-bold">
        Choose the fraction plank that completes the bridge.
      </legend>
      <div className="overflow-hidden rounded-xl border-2 border-[#17150f] bg-[#cfe8ff] p-4 sm:p-6">
        <div className="flex items-center gap-2 text-sm font-black text-[#514b3e]">
          <Waves aria-hidden="true" size={19} /> River crossing
        </div>
        <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
          <div className="h-14 rounded-l-lg border-2 border-[#17150f] bg-[#91e3b7]" />
          <div className="flex min-w-28 justify-center sm:min-w-44">
            {selected ? (
              <div className="game-choice flex min-h-14 w-full items-center justify-center rounded-lg bg-[#ffd95f] px-3 text-center font-black">
                {selected.label}
              </div>
            ) : (
              <div className="flex min-h-14 w-full items-center justify-center border-y-2 border-dashed border-[#17150f] px-3 text-center text-sm font-black text-[#514b3e]">
                Seat a plank
              </div>
            )}
          </div>
          <div className="h-14 rounded-r-lg border-2 border-[#17150f] bg-[#91e3b7]" />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {question.options.map((option) => (
          <button
            aria-pressed={value === option.id}
            className={`game-choice flex min-h-12 items-center gap-3 rounded-xl p-3 text-left font-extrabold ${value === option.id ? "bg-[#ffd95f]" : ""}`}
            disabled={disabled}
            key={option.id}
            onClick={() => onChange(option.id)}
            type="button"
          >
            <Layers3 aria-hidden="true" size={20} />
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
