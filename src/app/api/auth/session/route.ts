import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getClientEnv } from "@/lib/env/client";
import { createClient } from "@/lib/supabase/server";

const sessionSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
});

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return NextResponse.json({ authenticated: false }, { status: 401 });

  return NextResponse.json({ authenticated: true });
}

export async function POST(request: NextRequest) {
  const parsed = sessionSchema.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json({ authenticated: false }, { status: 400 });

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
  const {
    data: { user },
    error,
  } = await supabase.auth.setSession({
    access_token: parsed.data.accessToken,
    refresh_token: parsed.data.refreshToken,
  });

  if (error || !user)
    return NextResponse.json({ authenticated: false }, { status: 401 });

  const response = NextResponse.json({ authenticated: true });
  pendingCookies.forEach(({ name, value, options }) =>
    response.cookies.set(name, value, options),
  );
  return response;
}
