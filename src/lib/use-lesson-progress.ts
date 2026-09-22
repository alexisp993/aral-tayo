"use client";

import { useCallback, useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";

export type LessonStep = "learn" | "flashcards";

export type LessonProgress = Record<`${LessonStep}Completed`, boolean> & {
  practiceCompleted: boolean;
  quizCompleted: boolean;
  correctActivityCount: number;
  requiredCorrect: number;
};

const emptyProgress: LessonProgress = {
  learnCompleted: false,
  flashcardsCompleted: false,
  practiceCompleted: false,
  quizCompleted: false,
  correctActivityCount: 0,
  requiredCorrect: 6,
};

const progressEvent = "taralearn:lesson-progress";
const accountProgressEvent = "aral-tayo:account-progress";

function storageKey(lessonSlug: string) {
  return `taralearn:lesson-progress:${lessonSlug}`;
}

function readProgress(lessonSlug: string): LessonProgress {
  try {
    const saved = window.localStorage.getItem(storageKey(lessonSlug));
    return saved ? { ...emptyProgress, ...JSON.parse(saved) } : emptyProgress;
  } catch {
    return emptyProgress;
  }
}

export function useLessonProgress(lessonSlug: string) {
  const [progress, setProgress] = useState<LessonProgress>(emptyProgress);
  const [loading, setLoading] = useState(true);
  const [savingStep, setSavingStep] = useState<LessonStep | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const sync = async () => {
      setLoading(true);
      try {
        const {
          data: { session },
        } = await createClient().auth.getSession();
        const response = await fetch(`/api/progress/${lessonSlug}`, {
          headers: session
            ? { Authorization: `Bearer ${session.access_token}` }
            : {},
        });
        if (!response.ok) throw new Error("Progress unavailable");
        const account = (await response.json()) as Partial<LessonProgress>;
        const legacy = readProgress(lessonSlug);
        const missingSteps = (["learn", "flashcards"] as const).filter(
          (step) => legacy[`${step}Completed`] && !account[`${step}Completed`],
        );
        let synced = account;
        for (const step of missingSteps) {
          const migration = await fetch(`/api/progress/${lessonSlug}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(session
                ? { Authorization: `Bearer ${session.access_token}` }
                : {}),
            },
            body: JSON.stringify({ step }),
          });
          if (!migration.ok)
            throw new Error("Legacy progress migration failed");
          synced = (await migration.json()) as Partial<LessonProgress>;
        }
        if (legacy.learnCompleted || legacy.flashcardsCompleted)
          window.localStorage.removeItem(storageKey(lessonSlug));
        if (active) setProgress({ ...emptyProgress, ...synced });
      } catch {
        if (active) setProgress(readProgress(lessonSlug));
      } finally {
        if (active) setLoading(false);
      }
    };
    void sync();
    window.addEventListener("storage", sync);
    window.addEventListener(progressEvent, sync);
    window.addEventListener(accountProgressEvent, sync);
    return () => {
      active = false;
      window.removeEventListener("storage", sync);
      window.removeEventListener(progressEvent, sync);
      window.removeEventListener(accountProgressEvent, sync);
    };
  }, [lessonSlug]);

  const completeStep = useCallback(
    async (step: LessonStep) => {
      const previous = progress;
      const optimistic = { ...previous, [`${step}Completed`]: true };
      setSavingStep(step);
      setError("");
      setProgress(optimistic);
      try {
        const {
          data: { session },
        } = await createClient().auth.getSession();
        const response = await fetch(`/api/progress/${lessonSlug}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(session
              ? { Authorization: `Bearer ${session.access_token}` }
              : {}),
          },
          body: JSON.stringify({ step }),
        });
        const body = (await response.json()) as Partial<LessonProgress> & {
          error?: string;
        };
        if (!response.ok)
          throw new Error(body.error ?? "Could not save progress.");
        setProgress((current) => ({ ...current, ...body }));
        window.dispatchEvent(new Event(accountProgressEvent));
        return true;
      } catch {
        setProgress(previous);
        setError("We could not save your progress. Please try again.");
        return false;
      } finally {
        setSavingStep(null);
      }
    },
    [lessonSlug, progress],
  );

  return { progress, loading, completeStep, savingStep, error };
}
