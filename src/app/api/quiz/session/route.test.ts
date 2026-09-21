import { describe, expect, it, vi } from "vitest";

const { getAuthenticatedUser, admin } = vi.hoisted(() => ({
  getAuthenticatedUser: vi.fn(),
  admin: { from: vi.fn() },
}));

vi.mock("@/lib/authenticated-user", () => ({ getAuthenticatedUser }));
vi.mock("@/lib/supabase/admin", () => ({ createAdminClient: () => admin }));

import { GET } from "./route";

describe("GET /api/quiz/session", () => {
  it("returns index 5 when every saved checkpoint is answered", async () => {
    getAuthenticatedUser.mockResolvedValueOnce({ id: "student-1" });
    const query = {
      eq: vi.fn(),
      order: vi.fn(),
      limit: vi.fn(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: {
          id: "c2e13e60-4ca1-4ec9-8a7d-61448fb1c53f",
          question_ids: ["af-q-01", "af-q-02", "af-q-03", "af-q-04", "af-q-05"],
          answers_json: {
            "af-q-01": "a",
            "af-q-02": "b",
            "af-q-03": "c",
            "af-q-04": "c",
            "af-q-05": "b",
          },
        },
        error: null,
      }),
    };
    query.eq.mockReturnValue(query);
    query.order.mockReturnValue(query);
    query.limit.mockReturnValue(query);
    admin.from.mockReturnValue({ select: vi.fn().mockReturnValue(query) });

    const response = await GET(
      new Request(
        "http://localhost/api/quiz/session?lessonSlug=adding-fractions",
      ),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ index: 5 });
  });
});
