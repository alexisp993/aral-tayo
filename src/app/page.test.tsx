import { describe, expect, it } from "vitest";

import {
  addingFractionsLesson,
  comparingFractionsLesson,
  subtractingFractionsLesson,
  equivalentFractionsLesson,
  getLesson,
  getSubject,
  lessons,
} from "@/lib/curriculum";

describe("curriculum seed", () => {
  it("resolves the Mathematics to Adding Fractions slice", () => {
    expect(getSubject("mathematics")?.available).toBe(true);
    expect(getLesson("adding-fractions")).toBe(addingFractionsLesson);
    expect(getLesson("comparing-fractions")).toBe(comparingFractionsLesson);
    expect(getLesson("subtracting-fractions")).toBe(subtractingFractionsLesson);
    expect(getLesson("equivalent-fractions")).toBe(equivalentFractionsLesson);
    expect(lessons).toHaveLength(4);
    expect(getLesson("missing-lesson")).toBeUndefined();
  });
});
