import { describe, expect, it, vi } from "vitest";

const { getAuthenticatedUser, admin } = vi.hoisted(() => ({
  getAuthenticatedUser: vi.fn(),
  admin: { from: vi.fn(), rpc: vi.fn() },
}));

vi.mock("@/lib/authenticated-user", () => ({ getAuthenticatedUser }));
vi.mock("@/lib/supabase/admin", () => ({ createAdminClient: () => admin }));

import { POST } from "./route";

describe("POST /api/quiz/answer", () => {
  it("returns the immutable saved response instead of overwriting it", async () => {
    getAuthenticatedUser.mockResolvedValueOnce({ id: "student-1" });
    const query = {
      eq: vi.fn(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: {
          question_ids: ["af-q-01"],
          answers_json: { "af-q-01": "a" },
          status: "in_progress",
        },
        error: null,
      }),
    };
    query.eq.mockReturnValue(query);
    admin.from.mockReturnValue({ select: vi.fn().mockReturnValue(query) });

    const response = await POST(
      new Request("http://localhost/api/quiz/answer", {
        method: "POST",
        body: JSON.stringify({
          sessionId: "c2e13e60-4ca1-4ec9-8a7d-61448fb1c53f",
          questionId: "af-q-01",
          response: "b",
        }),
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ correct: true });
    expect(admin.rpc).not.toHaveBeenCalled();
  });
});
