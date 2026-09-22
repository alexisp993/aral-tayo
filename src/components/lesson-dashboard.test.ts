import { describe, expect, it } from "vitest";

import {
  getNextLessonAction,
  summarizeLessonProgress,
} from "@/components/lesson-dashboard";
import type { LessonProgress } from "@/lib/use-lesson-progress";

const progress = (completed: number): LessonProgress => ({
  learnCompleted: completed >= 1,
  flashcardsCompleted: completed >= 2,
  practiceCompleted: completed >= 3,
  quizCompleted: completed >= 4,
  correctActivityCount: completed >= 3 ? 6 : 0,
  requiredCorrect: 6,
});

describe("lesson dashboard next action", () => {
  it.each([
    [0, "Start learning", "learn"],
    [1, "Review flashcards", "flashcards"],
    [2, "Start practice", "practice"],
    [3, "Take the quiz", "quiz"],
    [4, "Review lesson", ""],
  ])("routes %i completed steps to the right action", (count, label, path) => {
    expect(getNextLessonAction(progress(count))).toEqual({ label, path });
  });

  it("summarizes independent lesson snapshots", () => {
    expect(
      summarizeLessonProgress(2, {
        "adding-fractions": { completed: 4, loading: false },
        "comparing-fractions": { completed: 2, loading: false },
      }),
    ).toEqual({
      completedSteps: 6,
      totalSteps: 8,
      completedLessons: 1,
      activeLessons: 1,
      loading: false,
    });
  });

  it("keeps totals loading until every lesson reports", () => {
    expect(
      summarizeLessonProgress(2, {
        "adding-fractions": { completed: 4, loading: false },
      }).loading,
    ).toBe(true);
  });
});
