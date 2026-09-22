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
    const questions = addingFractionsQuiz.slice(0, 5);
    const questionIds = questions.map(({ id }) => id);
    const answers = Object.fromEntries(
      questions.map((question) => [
        question.id,
        question.type === "bridge_builder"
          ? question.correctOptionId
          : question.type === "fraction_runner"
            ? question.correctLaneId
            : question.type === "pizza_catch"
              ? question.correctSliceId
              : question.type === "number_line_dash"
                ? question.correctPositionId
            : "",
      ]),
    );
    expect(gradeQuiz(questionIds, answers)).toMatchObject({
      correctCount: 5,
      score: 100,
      xp: 100,
    });
  });

  it("shuffles five distinct game types in a quest", () => {
    const selected = selectQuizQuestions(5, () => 0.5);
    expect(new Set(selected.map((q) => q.type))).toHaveLength(5);
    expect(selected).toHaveLength(5);
  });

  it("does not expose matching associations or ordering solution", () => {
    const match = publicQuestion(
      addingFractionsQuiz.find((q) => q.type === "treasure_match")!,
    );
    const order = publicQuestion(
      addingFractionsQuiz.find((q) => q.type === "order_tower")!,
    );
    const runner = publicQuestion(
      addingFractionsQuiz.find((q) => q.type === "fraction_runner")!,
    );
    const pizza = publicQuestion(
      addingFractionsQuiz.find((q) => q.type === "pizza_catch")!,
    );
    const numberLine = publicQuestion(
      addingFractionsQuiz.find((q) => q.type === "number_line_dash")!,
    );
    expect(match).not.toHaveProperty("pairs");
    expect(order).not.toHaveProperty("correctOrder");
    expect(runner).not.toHaveProperty("correctLaneId");
    expect(pizza).not.toHaveProperty("correctSliceId");
    expect(pizza).not.toHaveProperty("explanation");
    expect(numberLine).not.toHaveProperty("correctPositionId");
    expect(numberLine).not.toHaveProperty("explanation");
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
