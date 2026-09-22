import { describe, expect, it } from "vitest";

import {
  addingFractionsLesson,
  comparingFractionsLesson,
  getLesson,
  getSubject,
  lessons,
} from "@/lib/curriculum";

describe("curriculum seed", () => {
  it("resolves the Mathematics to Adding Fractions slice", () => {
    expect(getSubject("mathematics")?.available).toBe(true);
    expect(getLesson("adding-fractions")).toBe(addingFractionsLesson);
    expect(getLesson("comparing-fractions")).toBe(comparingFractionsLesson);
    expect(lessons).toHaveLength(2);
    expect(getLesson("missing-lesson")).toBeUndefined();
  });
});
