import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function getAuthenticatedUser(request: Request) {
  const token = request.headers
    .get("authorization")
    ?.replace(/^Bearer\s+/i, "");
  const admin = createAdminClient();
  const { data: tokenData } = token
    ? await admin.auth.getUser(token)
    : { data: { user: null } };
  const client = await createClient();
  const {
    data: { user: cookieUser },
  } = await client.auth.getUser();

  return tokenData.user ?? cookieUser;
}
