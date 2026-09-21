"use client";

import { useState } from "react";
import { Check, GripVertical } from "lucide-react";
import { Button } from "@/components/ui";

export type Activity = {
  id: string;
  ordinal: number;
  instruction: string;
  type:
    | "multiple_choice"
    | "drag_drop"
    | "match_pairs"
    | "sort_categorize"
    | "hotspot";
  config: Record<string, unknown>;
  hint?: string;
};

export type ActivityResponse = {
  activityId: string;
  type: Activity["type"];
  response: unknown;
};

export function ActivityRenderer({
  activity,
  onSubmit,
  disabled = false,
}: {
  activity: Activity;
  onSubmit: (response: ActivityResponse) => void;
  disabled?: boolean;
}) {
  const [values, setValues] = useState<Record<string, string | string[]>>({});
  const config = activity.config as {
    prompt?: string;
    expression?: string;
    options?: { id: string; label: string }[];
    items?: { id: string; label: string }[];
    drop_zones?: { id: string; label: string }[];
    categories?: { id: string; label: string }[];
    left?: { id: string; label: string }[];
    right?: { id: string; label: string }[];
    visual?: { regions: { id: string; label: string }[] };
    selection?: { min: number; max: number };
  };
  const set = (key: string, value: string) =>
    setValues((current) => ({ ...current, [key]: value }));
  const selected = (values.selected as string[] | undefined) ?? [];
  const toggle = (id: string) =>
    setValues((current) => ({
      ...current,
      selected: selected.includes(id)
        ? selected.filter((entry) => entry !== id)
        : [...selected, id],
    }));
  const choices =
    activity.type === "multiple_choice"
      ? config.options
      : activity.type === "match_pairs"
        ? config.left
        : activity.type === "sort_categorize"
          ? config.items
          : activity.type === "drag_drop"
            ? config.items
            : config.visual?.regions;
  const destinations =
    activity.type === "match_pairs"
      ? config.right
      : activity.type === "sort_categorize"
        ? config.categories
        : undefined;
  const dragDropZone =
    config.drop_zones?.length === 1 ? config.drop_zones[0] : undefined;
  const selectedDragItem = choices?.find(
    (item) => values[item.id] === dragDropZone?.id,
  );
  const ready =
    activity.type === "hotspot"
      ? selected.length >= (config.selection?.min ?? 1) &&
        selected.length <= (config.selection?.max ?? 1)
      : activity.type === "multiple_choice"
        ? Boolean(values.answer)
        : activity.type === "drag_drop" && dragDropZone
          ? Boolean(selectedDragItem)
          : Boolean(choices?.length) &&
            choices!.every((item) => Boolean(values[item.id]));

  return (
    <article className="game-paper rounded-[16px] p-5 sm:p-7 md:p-9">
      <h2 className="game-display max-w-3xl text-2xl font-semibold text-[#17150f] sm:text-3xl">
        {activity.instruction}
      </h2>
      <p className="mt-4 max-w-3xl text-lg leading-7 font-extrabold text-[#3b372c] sm:text-xl">
        {config.prompt ?? config.expression ?? "Complete the activity."}
      </p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit({
            activityId: activity.id,
            type: activity.type,
            response: activity.type === "hotspot" ? selected : values,
          });
        }}
      >
        {activity.type === "multiple_choice" && (
          <fieldset className="mt-5 grid gap-3">
            {config.options?.map((option) => (
              <label
                className={`game-choice flex min-h-14 cursor-pointer items-center gap-3 rounded-[12px] px-4 py-3 font-extrabold text-[#17150f] ${values.answer === option.id ? "bg-[#ffd95f]" : "bg-[#fffef9]"} ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
                key={option.id}
              >
                <input
                  checked={values.answer === option.id}
                  disabled={disabled}
                  name="answer"
                  onChange={() => set("answer", option.id)}
                  type="radio"
                />
                {option.label}
              </label>
            ))}
          </fieldset>
        )}
        {activity.type === "hotspot" && (
          <>
            <p aria-live="polite" className="text-ink-muted mt-3">
              {selected.length} regions selected
            </p>
            <div className="mt-5 grid grid-cols-4 gap-2">
              {config.visual?.regions.map((region, index) => (
                <button
                  aria-pressed={selected.includes(region.id)}
                  className={`game-choice min-h-14 rounded-[12px] font-black ${selected.includes(region.id) ? "bg-[#91e3b7] text-[#17150f]" : "bg-[#fffef9] text-[#17150f]"}`}
                  data-selected={selected.includes(region.id)}
                  disabled={disabled}
                  key={region.id}
                  onClick={() => toggle(region.id)}
                  type="button"
                >
                  {index + 1}
                  <span className="sr-only">{region.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
        {activity.type === "match_pairs" ? (
          <div className="mt-5">
            <p className="text-sm font-bold text-[#635d50]">
              Available equivalent fractions
            </p>
            <div
              aria-label="Available equivalent fractions"
              className="mt-2 flex flex-wrap gap-2"
            >
              {destinations?.map((target) => (
                <span
                  className="game-chip rounded-[10px] bg-[#ffd95f] px-3 py-2 font-black text-[#17150f]"
                  key={target.id}
                >
                  {target.label}
                </span>
              ))}
            </div>
            <fieldset className="mt-4 grid gap-3">
              <legend className="sr-only">Match each fraction</legend>
              {choices?.map((item) => (
                <label
                  className="flex flex-col gap-3 rounded-[12px] border-2 border-[#17150f] bg-[#cfe8ff] p-4 sm:flex-row sm:items-center sm:justify-between"
                  key={item.id}
                >
                  <span className="text-ink font-black">
                    {item.label} is equal to
                  </span>
                  <select
                    aria-label={`Equivalent fraction for ${item.label}`}
                    className="min-h-12 rounded-[10px] border-2 border-[#17150f] bg-[#fffef9] px-3 font-bold text-[#17150f] focus-visible:outline-3 focus-visible:outline-offset-2"
                    disabled={disabled}
                    onChange={(event) => set(item.id, event.target.value)}
                    value={(values[item.id] as string) ?? ""}
                  >
                    <option value="">Select an equivalent fraction</option>
                    {destinations?.map((target) => (
                      <option
                        disabled={Object.entries(values).some(
                          ([key, value]) =>
                            key !== item.id && value === target.id,
                        )}
                        key={target.id}
                        value={target.id}
                      >
                        {target.label}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </fieldset>
          </div>
        ) : activity.type === "drag_drop" && dragDropZone ? (
          <div className="mt-5">
            <div className="rounded-[12px] border-2 border-dashed border-[#17150f] bg-[#cfe8ff] p-5 text-center">
              <p className="text-sm font-bold text-[#635d50]">
                {dragDropZone.label}
              </p>
              <p
                aria-live="polite"
                className="mt-1 text-xl font-black text-[#17150f]"
              >
                {selectedDragItem?.label ?? "Choose a fraction below"}
              </p>
            </div>
            <fieldset className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <legend className="sr-only">Choose a fraction</legend>
              {choices?.map((item) => {
                const isSelected = selectedDragItem?.id === item.id;
                return (
                  <button
                    aria-pressed={isSelected}
                    className={`game-choice flex min-h-14 items-center justify-center gap-2 rounded-[12px] p-3 font-black text-[#17150f] ${isSelected ? "bg-[#ffd95f]" : "bg-[#fffef9]"}`}
                    data-selected={isSelected}
                    disabled={disabled}
                    key={item.id}
                    onClick={() => setValues({ [item.id]: dragDropZone.id })}
                    type="button"
                  >
                    <GripVertical aria-hidden="true" size={18} />
                    {item.label}
                  </button>
                );
              })}
            </fieldset>
          </div>
        ) : (
          activity.type !== "multiple_choice" &&
          activity.type !== "hotspot" && (
            <div className="mt-5 grid gap-3">
              {choices?.map((item) => (
                <label
                  className="flex flex-col gap-3 rounded-[12px] border-2 border-[#17150f] bg-[#cfe8ff] p-4 sm:flex-row sm:items-center sm:justify-between"
                  key={item.id}
                >
                  <span className="text-ink font-black">{item.label}</span>
                  <select
                    aria-label={`Destination for ${item.label}`}
                    className="min-h-12 rounded-[10px] border-2 border-[#17150f] bg-[#fffef9] px-3 font-bold text-[#17150f] focus-visible:outline-3 focus-visible:outline-offset-2"
                    disabled={disabled}
                    onChange={(event) => set(item.id, event.target.value)}
                    value={(values[item.id] as string) ?? ""}
                  >
                    <option value="">Choose</option>
                    {(
                      destinations ??
                      (activity.type === "drag_drop"
                        ? [{ id: "answer", label: "Answer" }]
                        : [])
                    ).map((target) => (
                      <option key={target.id} value={target.id}>
                        {target.label}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          )
        )}
        <Button
          className="game-chip mt-7 rounded-[12px] border-2 border-[#17150f] bg-[#ff6b5d] px-5 text-[#17150f] shadow-none hover:bg-[#ff8074] disabled:bg-[#ded9cb]"
          disabled={!ready || disabled}
          type="submit"
        >
          <Check aria-hidden="true" size={18} strokeWidth={3} /> Check answer
        </Button>
      </form>
    </article>
  );
}
