import { NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/authenticated-user";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const user = await getAuthenticatedUser(request);
  if (!user)
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const admin = createAdminClient();
  const [statsResult, achievementsResult, leaderboardResult] =
    await Promise.all([
      admin
        .from("learner_stats")
        .select(
          "xp_total,quizzes_completed,best_quiz_score,current_streak,best_streak",
        )
        .eq("student_id", user.id)
        .maybeSingle(),
      admin
        .from("learner_achievements")
        .select("achievement_key,awarded_at")
        .eq("student_id", user.id)
        .order("awarded_at", { ascending: false }),
      admin
        .from("learner_stats")
        .select("student_id,xp_total,best_quiz_score")
        .order("xp_total", { ascending: false })
        .limit(5),
    ]);

  if (statsResult.error || achievementsResult.error || leaderboardResult.error)
    return NextResponse.json(
      {
        error:
          "Gamification tables are not ready. Install the latest migration.",
      },
      { status: 503 },
    );

  const leaders = leaderboardResult.data ?? [];
  const ids = leaders.map(({ student_id }) => student_id);
  const profilesResult = ids.length
    ? await admin.from("profiles").select("id,display_name").in("id", ids)
    : { data: [] };
  const names = new Map(
    (profilesResult.data ?? []).map((profile) => [
      profile.id,
      profile.display_name,
    ]),
  );

  return NextResponse.json({
    stats: statsResult.data ?? {
      xp_total: 0,
      quizzes_completed: 0,
      best_quiz_score: 0,
      current_streak: 0,
      best_streak: 0,
    },
    achievements: achievementsResult.data ?? [],
    leaderboard: leaders.map((leader, index) => ({
      rank: index + 1,
      studentId: leader.student_id,
      displayName:
        leader.student_id === user.id
          ? "You"
          : (names.get(leader.student_id) ?? "Learner"),
      xp: leader.xp_total,
      bestScore: leader.best_quiz_score,
      isCurrentUser: leader.student_id === user.id,
    })),
  });
}
