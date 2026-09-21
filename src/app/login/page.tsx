"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button, Card } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const emailRedirectTo = () => `${window.location.origin}/auth/callback`;

  const submit = async (mode: "signIn" | "signUp") => {
    setBusy(true);
    setMessage("");
    setNeedsVerification(false);
    const auth = createClient().auth;
    if (mode === "signIn") {
      const loginResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const loginResult = (await loginResponse.json()) as {
        error?: string;
        code?: string;
      };
      if (!loginResponse.ok) {
        setBusy(false);
        if (loginResult.code === "email_not_confirmed") {
          setNeedsVerification(true);
          return setMessage(
            "Your account exists, but the email address is not verified yet.",
          );
        }
        return setMessage(loginResult.error ?? "Could not sign in.");
      }

      const serverSession = await fetch("/api/auth/session", {
        cache: "no-store",
        credentials: "include",
      });
      setBusy(false);
      if (!serverSession.ok)
        return setMessage(
          "Sign-in succeeded, but this browser rejected the session cookie. Please enable cookies for localhost and try again.",
        );
      router.replace("/student/home");
      router.refresh();
      return;
    }

    const result = await auth.signUp({
      email,
      password,
      options: { emailRedirectTo: emailRedirectTo() },
    });
    if (result.error) {
      setBusy(false);
      if (result.error.code === "email_not_confirmed") {
        setNeedsVerification(true);
        return setMessage(
          "Your account exists, but the email address is not verified yet.",
        );
      }
      return setMessage(result.error.message);
    }
    setBusy(false);
    if (result.data.user?.identities?.length === 0) {
      setNeedsVerification(true);
      return setMessage(
        "An account already exists for this email. Resend its verification email or sign in.",
      );
    }
    setNeedsVerification(true);
    return setMessage(
      "Check your email to confirm your account, then sign in.",
    );
  };

  const resendVerification = async () => {
    setBusy(true);
    setMessage("");
    const { error } = await createClient().auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: emailRedirectTo() },
    });
    setBusy(false);
    setMessage(
      error
        ? error.message
        : "Verification email sent. Check your inbox and spam folder.",
    );
  };
  return (
    <main className="bg-canvas grid min-h-screen place-items-center p-4">
      <Card className="w-full max-w-md p-7">
        <h1 className="text-ink text-3xl font-black">Welcome to Aral Tayo</h1>
        <p className="text-ink-muted mt-2">
          Sign in to save your learning progress.
        </p>
        <label className="text-ink mt-6 block font-bold">
          Email
          <input
            className="border-brand/20 mt-2 min-h-11 w-full rounded-xl border px-3"
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            value={email}
          />
        </label>
        <label className="text-ink mt-4 block font-bold">
          Password
          <input
            className="border-brand/20 mt-2 min-h-11 w-full rounded-xl border px-3"
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            value={password}
          />
        </label>
        {message && (
          <p aria-live="polite" className="text-ink mt-4">
            {message}
          </p>
        )}
        <div className="mt-6 flex gap-3">
          <Button disabled={busy} onClick={() => submit("signIn")}>
            Sign in
          </Button>
          <Button
            disabled={busy}
            onClick={() => submit("signUp")}
            variant="secondary"
          >
            Create account
          </Button>
        </div>
        {needsVerification && (
          <Button
            className="mt-3"
            disabled={busy || !email}
            onClick={resendVerification}
            variant="secondary"
          >
            Resend verification email
          </Button>
        )}
      </Card>
    </main>
  );
}
