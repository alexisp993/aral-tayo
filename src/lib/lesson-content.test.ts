import { describe, expect, it } from "vitest";

import { getLessonSeed, isLessonSlug } from "@/lib/lesson-content";

describe("lesson content registry", () => {
  it("registers a complete Comparing Fractions lesson", () => {
    const seed = getLessonSeed("comparing-fractions");
    expect(seed?.lesson.title).toBe("Comparing Fractions");
    expect(seed?.lesson.learn_blocks).toHaveLength(5);
    expect(seed?.lesson.flashcards).toHaveLength(8);
    expect(seed?.lesson.practice.activities).toHaveLength(7);
    expect(
      seed?.lesson.practice.activities.every((activity) =>
        activity.id.startsWith("cf-pr-"),
      ),
    ).toBe(true);
  });

  it("rejects lessons without registered content", () => {
    expect(isLessonSlug("adding-fractions")).toBe(true);
    expect(isLessonSlug("comparing-fractions")).toBe(true);
    expect(isLessonSlug("missing-lesson")).toBe(false);
    expect(getLessonSeed("missing-lesson")).toBeUndefined();
  });
});
