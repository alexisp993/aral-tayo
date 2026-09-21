import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getClientEnv } from "@/lib/env/client";

const credentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const parsed = credentialsSchema.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json(
      { error: "Enter a valid email and password." },
      { status: 400 },
    );

  const env = getClientEnv();
  const pendingCookies: Array<{
    name: string;
    value: string;
    options: CookieOptions;
  }> = [];
  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookies) {
          pendingCookies.push(...cookies);
        },
      },
    },
  );
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error)
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: 401 },
    );

  const response = NextResponse.json({ authenticated: true });
  pendingCookies.forEach(({ name, value, options }) =>
    response.cookies.set(name, value, options),
  );
  return response;
}
