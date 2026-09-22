import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { OrderTower } from "./order-tower";
import { FractionRunner } from "./fraction-runner";
import { PizzaCatch } from "./pizza-catch";
import { TreasureMatch } from "./treasure-match";

const treasureQuestion = {
  id: "treasure-1",
  type: "treasure_match" as const,
  prompt: "Match the pairs",
  sources: ["1/2 and 1/4", "1/3 and 1/6"],
  targets: ["4", "6"],
};

const towerQuestion = {
  id: "tower-1",
  type: "order_tower" as const,
  prompt: "Order the steps",
  items: [
    { id: "first", label: "Find a common denominator" },
    { id: "second", label: "Add the fractions" },
  ],
};

const runnerQuestion = {
  id: "runner-1",
  type: "fraction_runner" as const,
  prompt: "Run to the answer",
  lanes: [
    { id: "a", label: "1/4" },
    { id: "b", label: "1/2" },
    { id: "c", label: "3/4" },
  ],
  course: { stepCount: 2, stepDurationMs: 99_999, obstacles: [] },
};

const pizzaQuestion = {
  id: "pizza-1",
  type: "pizza_catch" as const,
  prompt: "Catch the answer",
  slices: [
    { id: "a", label: "1/4" },
    { id: "b", label: "1/2" },
    { id: "c", label: "3/4" },
  ],
  course: { stepCount: 2, stepDurationMs: 99_999 },
};

describe("quiz game controls", () => {
  it("pairs a selected key with one unique chest and supports correcting it", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(
      <TreasureMatch question={treasureQuestion} onChange={onChange} />,
    );

    await user.click(screen.getByRole("button", { name: "1/2 and 1/4" }));
    await user.click(screen.getByRole("button", { name: "Unlock chest 4" }));
    expect(onChange).toHaveBeenLastCalledWith({ "1/2 and 1/4": "4" });

    rerender(
      <TreasureMatch
        question={treasureQuestion}
        value={{ "1/2 and 1/4": "4" }}
        onChange={onChange}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Locked chest 4" }),
    ).toBeDisabled();
    await user.click(
      screen.getByRole("button", {
        name: "Matched 1/2 and 1/4 with chest 4. Edit match.",
      }),
    );
    expect(onChange).toHaveBeenLastCalledWith({});
  });

  it("moves tower floors with labeled controls", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <OrderTower
        question={towerQuestion}
        value={["first", "second"]}
        onChange={onChange}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "Move Add the fractions up" }),
    );
    expect(onChange).toHaveBeenCalledWith(["second", "first"]);
    expect(
      screen.getByRole("button", { name: "Move Find a common denominator up" }),
    ).toBeDisabled();
  });

  it("starts, steers, finishes, and can restart before locking", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FractionRunner question={runnerQuestion} onChange={onChange} />);
    await user.click(screen.getByRole("button", { name: /start run/i }));
    await user.click(screen.getByRole("button", { name: "Move right" }));
    expect(screen.getByText("Lane 3, step 0 of 2.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /pause/i }));
    expect(screen.getByRole("button", { name: /resume run/i })).toBeInTheDocument();
  });

  it("starts Pizza Catch and moves the plate with accessible controls", async () => {
    const user = userEvent.setup();
    render(<PizzaCatch question={pizzaQuestion} onChange={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: /start catching/i }));
    expect(screen.getByLabelText("Plate in lane 2")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Move plate right" }));
    expect(screen.getByLabelText("Plate in lane 3")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /pause/i })).toBeEnabled();
  });
});
