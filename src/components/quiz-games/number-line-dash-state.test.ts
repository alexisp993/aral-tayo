import { describe, expect, it } from "vitest";
import {
  initialNumberLineDashState,
  reduceNumberLineDashState,
} from "./number-line-dash-state";

describe("number line dash state", () => {
  it("moves across five positions and clamps both ends", () => {
    const running = { ...initialNumberLineDashState, phase: "running" as const };
    expect(reduceNumberLineDashState(running, { type: "move", direction: -1 }).position).toBe(1);
    expect(reduceNumberLineDashState({ ...running, position: 0 }, { type: "move", direction: -1 }).position).toBe(0);
    expect(reduceNumberLineDashState({ ...running, position: 4 }, { type: "move", direction: 1 }).position).toBe(4);
  });

  it("locks the current point when time reaches the final step", () => {
    const result = reduceNumberLineDashState(
      { ...initialNumberLineDashState, phase: "running", position: 3, step: 2 },
      { type: "advance", stepCount: 3, positionIds: ["a", "b", "c", "d", "e"] },
    );
    expect(result).toMatchObject({ phase: "placed", placedPositionId: "d" });
  });
});
