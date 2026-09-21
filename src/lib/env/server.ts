import "server-only";

import { z } from "zod";

const serverIntegrationEnvSchema = z.object({
  SUPABASE_SECRET_KEY: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
});

export function getServerIntegrationEnv() {
  return serverIntegrationEnvSchema.parse({
    SUPABASE_SECRET_KEY:
      process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  });
}

export function getSupabaseServiceRoleKey() {
  return z
    .string()
    .min(1)
    .parse(
      process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY,
    );
}
