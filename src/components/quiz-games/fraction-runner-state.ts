export type RunnerObstacle = { step: number; lane: number };

export type RunnerState = {
  phase: "ready" | "running" | "paused" | "finished";
  lane: number;
  step: number;
  hitObstacleSteps: number[];
  penaltySteps: number;
  finishedOptionId?: string;
};

export const initialRunnerState: RunnerState = {
  phase: "ready",
  lane: 1,
  step: 0,
  hitObstacleSteps: [],
  penaltySteps: 0,
};

export type RunnerAction =
  | { type: "start" }
  | { type: "pause" }
  | { type: "resume" }
  | { type: "move"; direction: -1 | 1 }
  | { type: "advance"; stepCount: number; lanes: string[]; obstacles: RunnerObstacle[] }
  | { type: "reset" };

/** Deterministic game rules. Rendering supplies the clock; this reducer owns play. */
export function reduceRunnerState(
  state: RunnerState,
  action: RunnerAction,
): RunnerState {
  if (action.type === "reset") return initialRunnerState;
  if (action.type === "start" && state.phase === "ready")
    return { ...state, phase: "running" };
  if (action.type === "pause" && state.phase === "running")
    return { ...state, phase: "paused" };
  if (action.type === "resume" && state.phase === "paused")
    return { ...state, phase: "running" };
  if (action.type === "move" && state.phase === "running")
    return { ...state, lane: Math.max(0, Math.min(2, state.lane + action.direction)) };
  if (action.type !== "advance" || state.phase !== "running") return state;
  if (state.penaltySteps > 0)
    return { ...state, penaltySteps: state.penaltySteps - 1 };
  const nextStep = Math.min(state.step + 1, action.stepCount);
  const obstacle = action.obstacles.find(
    (item) => item.step === nextStep && item.lane === state.lane && !state.hitObstacleSteps.includes(item.step),
  );
  if (obstacle)
    return { ...state, hitObstacleSteps: [...state.hitObstacleSteps, obstacle.step], penaltySteps: 1 };
  if (nextStep === action.stepCount)
    return { ...state, step: nextStep, phase: "finished", finishedOptionId: action.lanes[state.lane] };
  return { ...state, step: nextStep };
}
