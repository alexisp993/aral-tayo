import { describe, expect, it, vi } from "vitest";

const { getAuthenticatedUser, admin } = vi.hoisted(() => ({
  getAuthenticatedUser: vi.fn(),
  admin: { from: vi.fn() },
}));

vi.mock("@/lib/authenticated-user", () => ({ getAuthenticatedUser }));
vi.mock("@/lib/practice-progress", () => ({ getPracticeProgress: vi.fn() }));
vi.mock("@/lib/supabase/admin", () => ({ createAdminClient: () => admin }));

import { POST } from "./route";

const context = { params: Promise.resolve({ lessonSlug: "adding-fractions" }) };

describe("POST /api/progress/[lessonSlug]", () => {
  it("rejects invalid bodies before authentication", async () => {
    const response = await POST(
      new Request("http://localhost", {
        method: "POST",
        body: JSON.stringify({ step: "quiz" }),
      }),
      context,
    );

    expect(response.status).toBe(400);
    expect(getAuthenticatedUser).not.toHaveBeenCalled();
  });

  it("requires an authenticated user", async () => {
    getAuthenticatedUser.mockResolvedValueOnce(null);

    const response = await POST(
      new Request("http://localhost", {
        method: "POST",
        body: JSON.stringify({ step: "learn" }),
      }),
      context,
    );

    expect(response.status).toBe(401);
  });

  it("preserves an existing completion timestamp when retried", async () => {
    const completedAt = "2026-09-22T00:00:00.000Z";
    getAuthenticatedUser.mockResolvedValueOnce({ id: "student-1" });
    const existingQuery = {
      eq: vi.fn(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: {
          learn_completed_at: completedAt,
          flashcards_completed_at: null,
          quiz_completed_at: null,
        },
        error: null,
      }),
    };
    existingQuery.eq.mockReturnValue(existingQuery);
    const savedQuery = {
      select: vi.fn(),
      single: vi.fn().mockResolvedValue({
        data: {
          learn_completed_at: completedAt,
          flashcards_completed_at: null,
          quiz_completed_at: null,
        },
        error: null,
      }),
    };
    savedQuery.select.mockReturnValue(savedQuery);
    const upsert = vi.fn().mockReturnValue(savedQuery);
    admin.from.mockReturnValue({
      select: vi.fn().mockReturnValue(existingQuery),
      upsert,
    });

    const response = await POST(
      new Request("http://localhost", {
        method: "POST",
        body: JSON.stringify({ step: "learn" }),
      }),
      context,
    );

    expect(response.status).toBe(200);
    expect(upsert.mock.calls[0][0]).toMatchObject({
      learn_completed_at: completedAt,
      student_id: "student-1",
    });
    await expect(response.json()).resolves.toMatchObject({
      learnCompleted: true,
      flashcardsCompleted: false,
    });
  });
});
