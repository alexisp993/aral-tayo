import { GamificationDashboard } from "@/components/gamification-dashboard";

export default function AchievementsPage() {
  return (
    <>
      <header className="border-b-2 border-[#17150f] pb-6">
        <h1 className="game-display text-4xl font-semibold text-[#17150f] md:text-6xl">
          Achievements
        </h1>
        <p className="mt-3 max-w-[65ch] text-lg font-bold text-[#514b3e]">
          Turn completed learning quests into badges—and climb the XP board.
        </p>
      </header>
      <div className="mt-7">
        <GamificationDashboard />
      </div>
    </>
  );
}
