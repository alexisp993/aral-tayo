import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL("/student/home", url));
  }

  const loginUrl = new URL("/login", url);
  loginUrl.searchParams.set("error", "verification_failed");
  return NextResponse.redirect(loginUrl);
}
