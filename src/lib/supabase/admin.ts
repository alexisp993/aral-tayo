import "server-only";

import { createClient } from "@supabase/supabase-js";

import { getClientEnv } from "@/lib/env/client";
import { getSupabaseServiceRoleKey } from "@/lib/env/server";

export function createAdminClient() {
  const env = getClientEnv();

  return createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    getSupabaseServiceRoleKey(),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
