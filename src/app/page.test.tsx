import { describe, expect, it } from "vitest";

import { addingFractionsLesson, getLesson, getSubject } from "@/lib/curriculum";

describe("curriculum seed", () => {
  it("resolves the Mathematics to Adding Fractions slice", () => {
    expect(getSubject("mathematics")?.available).toBe(true);
    expect(getLesson("adding-fractions")).toBe(addingFractionsLesson);
    expect(getLesson("missing-lesson")).toBeUndefined();
  });
});
