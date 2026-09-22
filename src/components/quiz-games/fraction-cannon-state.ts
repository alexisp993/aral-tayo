export type FractionCannonState = {
  phase: "aiming" | "fired";
  target: number;
  firedTargetId?: string;
};

export const initialFractionCannonState: FractionCannonState = {
  phase: "aiming",
  target: 1,
};

export type FractionCannonAction =
  | { type: "aim"; direction: -1 | 1 }
  | { type: "fire"; targetIds: string[] }
  | { type: "reset" };

export function reduceFractionCannonState(
  state: FractionCannonState,
  action: FractionCannonAction,
): FractionCannonState {
  if (action.type === "reset") return initialFractionCannonState;
  if (state.phase === "fired") return state;
  if (action.type === "aim")
    return {
      ...state,
      target: Math.max(0, Math.min(2, state.target + action.direction)),
    };
  if (action.type === "fire")
    return {
      ...state,
      phase: "fired",
      firedTargetId: action.targetIds[state.target],
    };
  return state;
}
