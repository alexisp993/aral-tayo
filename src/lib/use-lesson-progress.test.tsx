import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useLessonProgress } from "@/lib/use-lesson-progress";

const { getSession } = vi.hoisted(() => ({ getSession: vi.fn() }));

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({ auth: { getSession } }),
}));

describe("useLessonProgress", () => {
  afterEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("rolls back a failed completion and does not create legacy progress", async () => {
    getSession.mockResolvedValue({
      data: { session: { access_token: "token" } },
    });
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            learnCompleted: false,
            flashcardsCompleted: false,
            practiceCompleted: false,
            quizCompleted: false,
            correctActivityCount: 0,
            requiredCorrect: 6,
          }),
          { status: 200 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ error: "Could not save lesson progress." }),
          {
            status: 500,
          },
        ),
      );
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useLessonProgress("adding-fractions"));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    await act(async () => {
      await result.current.completeStep("learn");
    });

    expect(result.current.progress.learnCompleted).toBe(false);
    expect(result.current.error).toMatch(/could not save/i);
    expect(
      window.localStorage.getItem("taralearn:lesson-progress:adding-fractions"),
    ).toBeNull();
  });
});
