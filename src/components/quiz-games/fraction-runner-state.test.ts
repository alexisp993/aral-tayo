import { describe, expect, it } from "vitest";
import { initialRunnerState, reduceRunnerState } from "./fraction-runner-state";

const track = { stepCount: 4, lanes: ["a", "b", "c"], obstacles: [{ step: 2, lane: 0 }] };

describe("fraction runner state", () => {
  it("moves between three lanes and clamps the track edges", () => {
    const running = reduceRunnerState(initialRunnerState, { type: "start" });
    expect(reduceRunnerState(running, { type: "move", direction: -1 }).lane).toBe(0);
    expect(reduceRunnerState({ ...running, lane: 0 }, { type: "move", direction: -1 }).lane).toBe(0);
    expect(reduceRunnerState({ ...running, lane: 2 }, { type: "move", direction: 1 }).lane).toBe(2);
  });

  it("applies each obstacle only once and delays the next advance", () => {
    const running = { ...initialRunnerState, phase: "running" as const, lane: 0, step: 1 };
    const hit = reduceRunnerState(running, { type: "advance", ...track });
    expect(hit).toMatchObject({ step: 1, hitObstacleSteps: [2], penaltySteps: 1 });
    const delayed = reduceRunnerState(hit, { type: "advance", ...track });
    expect(delayed).toMatchObject({ step: 1, penaltySteps: 0 });
    expect(reduceRunnerState(delayed, { type: "advance", ...track }).step).toBe(2);
  });

  it("finishes by mapping the current lane to its opaque option id", () => {
    const done = reduceRunnerState(
      { ...initialRunnerState, phase: "running", lane: 2, step: 3 },
      { type: "advance", ...track },
    );
    expect(done).toMatchObject({ phase: "finished", step: 4, finishedOptionId: "c" });
  });
});
