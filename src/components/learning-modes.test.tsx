import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { LearnMode } from "@/components/learning-modes";

const { useLessonProgress } = vi.hoisted(() => ({
  useLessonProgress: vi.fn(),
}));

vi.mock("@/lib/use-lesson-progress", () => ({ useLessonProgress }));

describe("LearnMode", () => {
  it("keeps Continue hidden while completion is saving", () => {
    useLessonProgress.mockReturnValue({
      progress: {
        learnCompleted: true,
        flashcardsCompleted: false,
        practiceCompleted: false,
        quizCompleted: false,
        correctActivityCount: 0,
        requiredCorrect: 6,
      },
      completeStep: vi.fn(),
      savingStep: "learn",
      error: "",
    });

    render(<LearnMode blocks={[]} lessonSlug="adding-fractions" />);

    expect(screen.getByRole("button", { name: /saving/i })).toBeDisabled();
    expect(
      screen.queryByRole("link", { name: /continue to flashcards/i }),
    ).not.toBeInTheDocument();
  });
});
