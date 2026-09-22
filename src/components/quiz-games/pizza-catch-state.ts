export type PizzaCatchState = {
  phase: "ready" | "running" | "paused" | "caught";
  lane: number;
  step: number;
  caughtSliceId?: string;
};

export const initialPizzaCatchState: PizzaCatchState = {
  phase: "ready",
  lane: 1,
  step: 0,
};

export type PizzaCatchAction =
  | { type: "start" }
  | { type: "pause" }
  | { type: "resume" }
  | { type: "move"; direction: -1 | 1 }
  | { type: "advance"; stepCount: number; sliceIds: string[] }
  | { type: "reset" };

export function reducePizzaCatchState(
  state: PizzaCatchState,
  action: PizzaCatchAction,
): PizzaCatchState {
  if (action.type === "reset") return initialPizzaCatchState;
  if (action.type === "start" && state.phase === "ready")
    return { ...state, phase: "running" };
  if (action.type === "pause" && state.phase === "running")
    return { ...state, phase: "paused" };
  if (action.type === "resume" && state.phase === "paused")
    return { ...state, phase: "running" };
  if (action.type === "move" && state.phase === "running")
    return {
      ...state,
      lane: Math.max(0, Math.min(2, state.lane + action.direction)),
    };
  if (action.type !== "advance" || state.phase !== "running") return state;
  const step = Math.min(state.step + 1, action.stepCount);
  if (step === action.stepCount)
    return {
      ...state,
      step,
      phase: "caught",
      caughtSliceId: action.sliceIds[state.lane],
    };
  return { ...state, step };
}
