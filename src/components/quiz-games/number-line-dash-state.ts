export type NumberLineDashState = {
  phase: "ready" | "running" | "paused" | "placed";
  position: number;
  step: number;
  placedPositionId?: string;
};

export const initialNumberLineDashState: NumberLineDashState = {
  phase: "ready",
  position: 2,
  step: 0,
};

export type NumberLineDashAction =
  | { type: "start" }
  | { type: "pause" }
  | { type: "resume" }
  | { type: "move"; direction: -1 | 1 }
  | { type: "advance"; stepCount: number; positionIds: string[] }
  | { type: "reset" };

export function reduceNumberLineDashState(
  state: NumberLineDashState,
  action: NumberLineDashAction,
): NumberLineDashState {
  if (action.type === "reset") return initialNumberLineDashState;
  if (action.type === "start" && state.phase === "ready")
    return { ...state, phase: "running" };
  if (action.type === "pause" && state.phase === "running")
    return { ...state, phase: "paused" };
  if (action.type === "resume" && state.phase === "paused")
    return { ...state, phase: "running" };
  if (action.type === "move" && state.phase === "running")
    return {
      ...state,
      position: Math.max(0, Math.min(4, state.position + action.direction)),
    };
  if (action.type !== "advance" || state.phase !== "running") return state;
  const step = Math.min(state.step + 1, action.stepCount);
  if (step === action.stepCount)
    return {
      ...state,
      step,
      phase: "placed",
      placedPositionId: action.positionIds[state.position],
    };
  return { ...state, step };
}
