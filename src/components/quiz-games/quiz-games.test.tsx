import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { OrderTower } from "./order-tower";
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
});
