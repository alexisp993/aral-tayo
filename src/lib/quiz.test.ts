import { describe, expect, it } from "vitest";

import { addingFractionsQuiz, gradeQuiz, selectQuizQuestions } from "./quiz";

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
        .slice(0, 5)
        .map(({ id, correctOptionId }) => [id, correctOptionId]),
    );
    expect(gradeQuiz(questionIds, answers)).toMatchObject({
      correctCount: 5,
      score: 100,
      xp: 100,
    });
  });
});
