import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { createClient } from "@/lib/supabase/server";

export default async function StudentLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const fullName = user.user_metadata.full_name;
  const learnerName =
    typeof fullName === "string" && fullName.trim()
      ? fullName.trim()
      : (user.email?.split("@")[0] ?? "Student");

  return (
    <AppShell learner={{ name: learnerName, email: user.email ?? "" }}>
      {children}
    </AppShell>
  );
}
