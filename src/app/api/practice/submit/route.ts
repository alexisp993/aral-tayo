import { NextResponse } from "next/server";
import { z } from "zod";

import lessonSeed from "../../../../../seed/grade-5-math/adding-fractions.seed.json";
import { getAuthenticatedUser } from "@/lib/authenticated-user";
import { markPracticeComplete } from "@/lib/practice-progress";
import { createAdminClient } from "@/lib/supabase/admin";

const bodySchema = z.object({
  eventId: z.uuid(),
  lessonSlug: z.literal("adding-fractions"),
  activityKey: z.string().min(1),
  response: z.unknown(),
  attemptsUsed: z.number().int().min(1),
  hintUsed: z.boolean().default(false),
});

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success)
    return NextResponse.json(
      { error: "Invalid practice submission." },
      { status: 400 },
    );
  const user = await getAuthenticatedUser(request);
  const admin = createAdminClient();
  if (!user)
    return NextResponse.json(
      { error: "Sign in to submit practice." },
      { status: 401 },
    );
  const activity = lessonSeed.lesson.practice.activities.find(
    (item) => item.id === parsed.data.activityKey,
  );
  if (!activity)
    return NextResponse.json({ error: "Activity not found." }, { status: 404 });
  const answer = activity.answer_key as Record<string, unknown>;
  const response = parsed.data.response as Record<string, unknown>;
  const sameRecord = (
    actual: Record<string, unknown>,
    expected: Record<string, unknown>,
  ) =>
    Object.keys(expected).length === Object.keys(actual).length &&
    Object.entries(expected).every(([key, value]) => actual[key] === value);
  const isCorrect = (() => {
    if (activity.type === "multiple_choice")
      return response.answer === answer.option_id;
    if (activity.type === "drag_drop")
      return sameRecord(
        response,
        Object.fromEntries(
          Object.entries(
            (answer.placements as Record<string, string>) ?? {},
          ).map(([zone, item]) => [item, zone]),
        ),
      );
    if (activity.type === "sort_categorize")
      return sameRecord(
        response,
        (answer.mapping as Record<string, unknown>) ?? {},
      );
    if (activity.type === "match_pairs") {
      const actual = Object.entries(response).sort();
      const expected = (answer.pairs as string[][])
        .map(([left, right]) => [left, right])
        .sort();
      return JSON.stringify(actual) === JSON.stringify(expected);
    }
    if (activity.type === "hotspot") {
      const selected = Array.isArray(response) ? response.slice().sort() : [];
      return selected.length === Number(answer.selected_count);
    }
    return false;
  })();
  const { data, error } = await admin
    .from("practice_attempts")
    .upsert(
      {
        event_id: parsed.data.eventId,
        student_id: user.id,
        lesson_slug: parsed.data.lessonSlug,
        activity_key: activity.id,
        activity_version: activity.version,
        response_json: response,
        is_correct: isCorrect,
        score_fraction: isCorrect ? 1 : 0,
        attempts_used: parsed.data.attemptsUsed,
        hint_used: parsed.data.hintUsed,
      },
      { onConflict: "event_id" },
    )
    .select("id,is_correct,score_fraction,attempts_used")
    .single();
  if (error)
    return NextResponse.json(
      { error: "Could not save practice attempt." },
      { status: 500 },
    );
  try {
    const progress = await markPracticeComplete(user.id);
    return NextResponse.json({ ...data, ...progress });
  } catch {
    return NextResponse.json(data);
  }
}
