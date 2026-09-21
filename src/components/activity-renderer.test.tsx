import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ActivityRenderer, type Activity } from "./activity-renderer";

const dragDropActivity: Activity = {
  id: "fraction-answer",
  ordinal: 2,
  instruction: "Choose the correct fraction for the answer box.",
  type: "drag_drop",
  config: {
    expression: "2/4 + 1/4 = ?",
    items: [
      { id: "one", label: "1/4" },
      { id: "three", label: "3/4" },
    ],
    drop_zones: [{ id: "answer", label: "Answer box" }],
  },
};

describe("ActivityRenderer", () => {
  afterEach(cleanup);

  it("submits only the fraction selected for a single answer box", async () => {
    const submit = vi.fn();
    const user = userEvent.setup();
    render(<ActivityRenderer activity={dragDropActivity} onSubmit={submit} />);

    const submitButton = screen.getByRole("button", {
      name: "Check answer",
    });
    expect(submitButton).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "3/4" }));
    expect(submitButton).toBeEnabled();
    await user.click(submitButton);

    expect(submit).toHaveBeenCalledWith({
      activityId: "fraction-answer",
      type: "drag_drop",
      response: { three: "answer" },
    });
  });

  it("shows equivalent-fraction choices before asking the learner to match", () => {
    const matchActivity: Activity = {
      ...dragDropActivity,
      type: "match_pairs",
      config: {
        left: [{ id: "half", label: "1/2" }],
        right: [{ id: "two-fourths", label: "2/4" }],
      },
    };

    render(<ActivityRenderer activity={matchActivity} onSubmit={vi.fn()} />);

    expect(screen.getByText("Available equivalent fractions")).toBeVisible();
    expect(
      screen.getByLabelText("Available equivalent fractions"),
    ).toHaveTextContent("2/4");
    expect(
      screen.getByLabelText("Equivalent fraction for 1/2"),
    ).toHaveDisplayValue("Select an equivalent fraction");
  });

  it("clears a previous activity's response when the activity changes", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <ActivityRenderer activity={dragDropActivity} onSubmit={vi.fn()} />,
    );
    const submitButton = screen.getByRole("button", {
      name: "Check answer",
    });

    await user.click(screen.getByRole("button", { name: "3/4" }));
    expect(submitButton).toBeEnabled();

    rerender(
      <ActivityRenderer
        activity={{
          ...dragDropActivity,
          id: "next-activity",
          config: {
            ...dragDropActivity.config,
            expression: "1/4 + 2/4 = ?",
          },
        }}
        key="next-activity"
        onSubmit={vi.fn()}
      />,
    );

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Check answer" }),
      ).toBeDisabled(),
    );
  });
});
