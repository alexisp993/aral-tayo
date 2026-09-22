import { describe, expect, it } from "vitest";
import {
  initialFractionCannonState,
  reduceFractionCannonState,
} from "./fraction-cannon-state";

describe("fraction cannon state", () => {
  it("aims across three targets and clamps the edges", () => {
    expect(reduceFractionCannonState(initialFractionCannonState, { type: "aim", direction: -1 }).target).toBe(0);
    expect(reduceFractionCannonState({ ...initialFractionCannonState, target: 0 }, { type: "aim", direction: -1 }).target).toBe(0);
    expect(reduceFractionCannonState({ ...initialFractionCannonState, target: 2 }, { type: "aim", direction: 1 }).target).toBe(2);
  });

  it("fires at the opaque id for the aimed target", () => {
    expect(
      reduceFractionCannonState(
        { ...initialFractionCannonState, target: 2 },
        { type: "fire", targetIds: ["a", "b", "c"] },
      ),
    ).toMatchObject({ phase: "fired", firedTargetId: "c" });
  });
});
