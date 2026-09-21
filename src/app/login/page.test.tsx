import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import LoginPage from "./page";

const mocks = vi.hoisted(() => ({
  refresh: vi.fn(),
  replace: vi.fn(),
  resend: vi.fn(),
  signUp: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mocks.replace, refresh: mocks.refresh }),
}));

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      resend: mocks.resend,
      signUp: mocks.signUp,
    },
  }),
}));

describe("LoginPage", () => {
  afterEach(cleanup);

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.resend.mockResolvedValue({ data: {}, error: null });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) }),
    );
  });

  it("creates and verifies the browser session before entering the app", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText("Email"), "learner@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() =>
      expect(fetch).toHaveBeenNthCalledWith(1, "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "learner@example.com",
          password: "password123",
        }),
        credentials: "include",
      }),
    );
    expect(fetch).toHaveBeenNthCalledWith(2, "/api/auth/session", {
      cache: "no-store",
      credentials: "include",
    });
    expect(mocks.replace).toHaveBeenCalledWith("/student/home");
    expect(mocks.refresh).toHaveBeenCalledOnce();
  });

  it("does not redirect when the browser rejects the server cookie", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      } as Response)
      .mockResolvedValueOnce({ ok: false } as Response);
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText("Email"), "learner@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(
      await screen.findByText(/browser rejected the session cookie/i),
    ).toBeVisible();
    expect(mocks.replace).not.toHaveBeenCalled();
  });

  it("offers to resend confirmation when Supabase reports an unverified email", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        code: "email_not_confirmed",
        error: "Email not confirmed",
      }),
    } as Response);
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText("Email"), "learner@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Sign in" }));
    await user.click(
      await screen.findByRole("button", {
        name: "Resend verification email",
      }),
    );

    expect(mocks.resend).toHaveBeenCalledWith({
      type: "signup",
      email: "learner@example.com",
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    expect(await screen.findByText(/verification email sent/i)).toBeVisible();
  });
});
