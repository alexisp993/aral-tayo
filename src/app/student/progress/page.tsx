import { GamificationDashboard } from "@/components/gamification-dashboard";

export default function ProgressPage() {
  return (
    <>
      <header className="border-b-2 border-[#17150f] pb-6">
        <h1 className="game-display text-4xl font-semibold text-[#17150f] md:text-6xl">
          Your progress
        </h1>
        <p className="mt-3 max-w-[65ch] text-lg font-bold text-[#514b3e]">
          See the XP, streaks, quiz results, and achievements saved to your
          account.
        </p>
      </header>
      <div className="mt-7">
        <GamificationDashboard />
      </div>
    </>
  );
}
