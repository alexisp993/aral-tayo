"use client";

import { useCallback, useEffect, useState } from "react";

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

  useEffect(() => {
    let active = true;
    const sync = async () => {
      const local = readProgress(lessonSlug);
      try {
        const response = await fetch(`/api/progress/${lessonSlug}`);
        const account = response.ok
          ? ((await response.json()) as Partial<LessonProgress>)
          : {};
        if (active) setProgress({ ...local, ...account });
      } catch {
        if (active) setProgress(local);
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
    (step: LessonStep) => {
      const local = readProgress(lessonSlug);
      const next = { ...local, [`${step}Completed`]: true };
      try {
        window.localStorage.setItem(
          storageKey(lessonSlug),
          JSON.stringify(next),
        );
      } catch {
        // Keep the current session usable when storage is blocked or full.
      }
      setProgress(next);
      window.dispatchEvent(new Event(progressEvent));
    },
    [lessonSlug],
  );

  return { progress, completeStep };
}
