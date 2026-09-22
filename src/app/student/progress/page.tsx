import { GamificationDashboard } from "@/components/gamification-dashboard";
import { LessonDashboard } from "@/components/lesson-dashboard";
import { Card } from "@/components/ui";
import { lessons } from "@/lib/curriculum";

export default function ProgressPage() {
  return (
    <>
      <header className="border-b-2 border-[#17150f] pb-6">
        <h1 className="game-display text-4xl font-semibold text-[#17150f] md:text-6xl">
          Your progress
        </h1>
        <p className="mt-3 max-w-[65ch] text-lg font-bold text-[#514b3e]">
          See what you have completed, continue each lesson, and review the
          rewards saved to your account.
        </p>
      </header>
      <Card className="mt-7 p-6 md:p-7">
        <div className="mb-5">
          <h2 className="game-display text-3xl font-semibold text-[#17150f]">
            Curriculum progress
          </h2>
          <p className="mt-2 max-w-[65ch] font-bold text-[#514b3e]">
            Each lesson keeps its own Learn, Flashcards, Practice, and Quiz
            progress.
          </p>
        </div>
        <LessonDashboard lessons={lessons} showSummary />
      </Card>

      <section className="mt-9" aria-labelledby="rewards-heading">
        <h2
          className="game-display text-3xl font-semibold text-[#17150f]"
          id="rewards-heading"
        >
          Rewards and milestones
        </h2>
        <p className="mt-2 max-w-[65ch] font-bold text-[#514b3e]">
          Your XP, achievements, streak, and leaderboard standing update as
          you finish quests.
        </p>
        <div className="mt-5">
          <GamificationDashboard />
        </div>
      </section>
    </>
  );
}
