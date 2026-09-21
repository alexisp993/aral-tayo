"use client";

import { useEffect, useState } from "react";
import { Award, Flame, Medal, Sparkles, Star, Trophy } from "lucide-react";

type Summary = {
  stats: {
    xp_total: number;
    quizzes_completed: number;
    best_quiz_score: number;
    current_streak: number;
    best_streak: number;
  };
  achievements: { achievement_key: string; awarded_at: string }[];
  leaderboard: {
    rank: number;
    displayName: string;
    xp: number;
    bestScore: number;
    isCurrentUser: boolean;
  }[];
};

const achievementCopy = {
  first_quiz: {
    title: "Quest Starter",
    description: "Completed your first quiz.",
    icon: Sparkles,
  },
  perfect_score: {
    title: "Fraction Master",
    description: "Earned a perfect quiz score.",
    icon: Star,
  },
} as const;

export function GamificationDashboard({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    void fetch("/api/gamification/summary")
      .then(async (response) => {
        const body = (await response.json()) as Summary & { error?: string };
        if (!response.ok) throw new Error(body.error);
        if (active) setSummary(body);
      })
      .catch((caught) => {
        if (active)
          setError(
            caught instanceof Error
              ? caught.message
              : "Could not load progress.",
          );
      });
    return () => {
      active = false;
    };
  }, []);

  if (error)
    return (
      <p className="rounded-[12px] bg-[#fff1b8] p-4 font-bold text-[#514b3e]">
        {error}
      </p>
    );
  if (!summary)
    return (
      <p className="py-8 text-center font-bold text-[#514b3e]">
        Loading your rewards…
      </p>
    );

  const stats = summary.stats;
  if (compact)
    return (
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-[12px] bg-[#ffd95f] p-4 text-[#17150f]">
          <Medal aria-hidden="true" size={22} />
          <p className="mt-3 text-2xl font-black tabular-nums">
            {stats.xp_total}
          </p>
          <p className="text-xs font-extrabold uppercase">Total XP</p>
        </div>
        <div className="rounded-[12px] bg-[#ffc1b9] p-4 text-[#17150f]">
          <Flame aria-hidden="true" size={22} />
          <p className="mt-3 text-2xl font-black tabular-nums">
            {stats.current_streak}
          </p>
          <p className="text-xs font-extrabold uppercase">Day streak</p>
        </div>
        <div className="rounded-[12px] bg-[#91e3b7] p-4 text-[#17150f]">
          <Trophy aria-hidden="true" size={22} />
          <p className="mt-3 text-2xl font-black tabular-nums">
            {stats.best_quiz_score}%
          </p>
          <p className="text-xs font-extrabold uppercase">Best quiz</p>
        </div>
      </div>
    );

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
      <section className="game-paper rounded-[16px] p-6 sm:p-8">
        <h2 className="game-display text-3xl font-semibold text-[#17150f]">
          Your trophy shelf
        </h2>
        <p className="mt-2 font-bold text-[#514b3e]">
          Achievements appear here as you complete learning quests.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {(
            Object.keys(achievementCopy) as (keyof typeof achievementCopy)[]
          ).map((key) => {
            const item = achievementCopy[key];
            const earned = summary.achievements.some(
              ({ achievement_key }) => achievement_key === key,
            );
            const Icon = item.icon;
            return (
              <div
                className={`rounded-[12px] border-2 p-5 ${earned ? "border-[#17150f] bg-[#ffd95f]" : "border-dashed border-[#8f897a] bg-[#ebe7dc] text-[#625d51]"}`}
                key={key}
              >
                <Icon aria-hidden="true" size={27} />
                <h3 className="mt-4 font-black">{item.title}</h3>
                <p className="mt-1 text-sm font-bold">{item.description}</p>
                <p className="mt-4 text-xs font-extrabold uppercase">
                  {earned ? "Earned" : "Locked"}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="game-paper rounded-[16px] p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <Award aria-hidden="true" size={30} />
          <h2 className="game-display text-3xl font-semibold text-[#17150f]">
            XP leaderboard
          </h2>
        </div>
        <ol className="mt-6 space-y-3">
          {summary.leaderboard.length ? (
            summary.leaderboard.map((leader) => (
              <li
                className={`flex items-center gap-3 rounded-[12px] p-4 ${leader.isCurrentUser ? "bg-[#91e3b7]" : "bg-[#f0ecdf]"}`}
                key={`${leader.rank}-${leader.displayName}`}
              >
                <span className="grid size-9 place-items-center rounded-full border-2 border-[#17150f] bg-[#fffdf4] font-black">
                  {leader.rank}
                </span>
                <span className="flex-1 font-black text-[#17150f]">
                  {leader.displayName}
                </span>
                <span className="font-black text-[#17150f] tabular-nums">
                  {leader.xp} XP
                </span>
              </li>
            ))
          ) : (
            <li className="rounded-[12px] bg-[#f0ecdf] p-5 font-bold text-[#514b3e]">
              Complete a quiz to claim the first spot.
            </li>
          )}
        </ol>
      </section>
    </div>
  );
}
