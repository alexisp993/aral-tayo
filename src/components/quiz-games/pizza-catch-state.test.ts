import { describe, expect, it } from "vitest";
import {
  initialPizzaCatchState,
  reducePizzaCatchState,
} from "./pizza-catch-state";

describe("pizza catch state", () => {
  it("moves the plate between three lanes and clamps the edges", () => {
    const running = reducePizzaCatchState(initialPizzaCatchState, {
      type: "start",
    });
    expect(
      reducePizzaCatchState(running, { type: "move", direction: -1 }).lane,
    ).toBe(0);
    expect(
      reducePizzaCatchState(
        { ...running, lane: 0 },
        { type: "move", direction: -1 },
      ).lane,
    ).toBe(0);
  });

  it("catches the slice above the plate at the final step", () => {
    const caught = reducePizzaCatchState(
      { ...initialPizzaCatchState, phase: "running", lane: 2, step: 2 },
      { type: "advance", stepCount: 3, sliceIds: ["a", "b", "c"] },
    );
    expect(caught).toMatchObject({
      phase: "caught",
      caughtSliceId: "c",
      step: 3,
    });
  });

  it("does not advance while paused", () => {
    const paused = { ...initialPizzaCatchState, phase: "paused" as const };
    expect(
      reducePizzaCatchState(paused, {
        type: "advance",
        stepCount: 3,
        sliceIds: ["a", "b", "c"],
      }),
    ).toEqual(paused);
  });
});
