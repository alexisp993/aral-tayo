import { describe, expect, it } from "vitest";

import {
  addingFractionsQuiz,
  gradeQuiz,
  isQuizDraftComplete,
  publicQuestion,
  selectQuizQuestions,
} from "./quiz";
import type { PublicQuizQuestion } from "./quiz";

describe("quiz engine", () => {
  it("selects a bounded set without duplicates", () => {
    const selected = selectQuizQuestions(5, () => 0.5);
    expect(selected).toHaveLength(5);
    expect(new Set(selected.map((question) => question.id))).toHaveLength(5);
  });

  it("grades answers and awards the perfect-score bonus", () => {
    const questionIds = addingFractionsQuiz.slice(0, 5).map(({ id }) => id);
    const answers = Object.fromEntries(
      addingFractionsQuiz
        .filter((question) => question.type === "bridge_builder")
        .map((question) => [question.id, question.correctOptionId]),
    );
    expect(gradeQuiz(questionIds, answers)).toMatchObject({
      correctCount: 5,
      score: 100,
      xp: 100,
    });
  });

  it("includes each game type in a quest", () => {
    expect(
      new Set(selectQuizQuestions(5, () => 0.5).map((q) => q.type)),
    ).toEqual(new Set(["bridge_builder", "treasure_match", "order_tower"]));
  });

  it("does not expose matching associations or ordering solution", () => {
    const match = publicQuestion(
      addingFractionsQuiz.find((q) => q.type === "treasure_match")!,
    );
    const order = publicQuestion(
      addingFractionsQuiz.find((q) => q.type === "order_tower")!,
    );
    expect(match).not.toHaveProperty("pairs");
    expect(order).not.toHaveProperty("correctOrder");
  });

  it("requires a valid selected bridge option", () => {
    const bridge = publicQuestion(addingFractionsQuiz[0]);
    expect(isQuizDraftComplete(bridge, undefined)).toBe(false);
    expect(isQuizDraftComplete(bridge, "not-an-option")).toBe(false);
    expect(isQuizDraftComplete(bridge, "a")).toBe(true);
  });

  it("requires every treasure source to have a unique allowed target", () => {
    const treasure = publicQuestion(
      addingFractionsQuiz.find(
        (question) => question.type === "treasure_match",
      )!,
    ) as Extract<PublicQuizQuestion, { type: "treasure_match" }>;
    expect(
      isQuizDraftComplete(treasure, {
        [treasure.sources[0]]: treasure.targets[0],
      }),
    ).toBe(false);
    expect(
      isQuizDraftComplete(treasure, {
        [treasure.sources[0]]: treasure.targets[0],
        [treasure.sources[1]]: treasure.targets[0],
        [treasure.sources[2]]: treasure.targets[2],
      }),
    ).toBe(false);
    expect(
      isQuizDraftComplete(
        treasure,
        Object.fromEntries(
          treasure.sources.map((source, index) => [
            source,
            treasure.targets[index],
          ]),
        ),
      ),
    ).toBe(true);
  });

  it("treats the displayed initial tower order as ready to lock", () => {
    const tower = publicQuestion(
      addingFractionsQuiz.find((question) => question.type === "order_tower")!,
    ) as Extract<PublicQuizQuestion, { type: "order_tower" }>;
    expect(isQuizDraftComplete(tower, undefined)).toBe(true);
    expect(isQuizDraftComplete(tower, [tower.items[0].id])).toBe(false);
    expect(
      isQuizDraftComplete(
        tower,
        tower.items.map((item) => item.id),
      ),
    ).toBe(true);
  });
});
