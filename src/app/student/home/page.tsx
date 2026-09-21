import { ArrowRight, BookOpen, Calculator, Compass } from "lucide-react";

import { GamificationDashboard } from "@/components/gamification-dashboard";
import { Card, LinkButton } from "@/components/ui";
import { addingFractionsLesson } from "@/lib/curriculum";

export default function StudentHomePage() {
  return (
    <>
      <section className="grid gap-7 border-b-2 border-[#17150f] pb-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div className="max-w-3xl">
          <h1 className="game-display text-4xl leading-[1.02] font-semibold text-[#17150f] md:text-6xl">
            Ready for today&apos;s learning quest?
          </h1>
          <p className="mt-4 max-w-[65ch] text-base leading-7 font-bold text-[#5d574a] md:text-lg">
            Small steps today can build a brighter tomorrow. Explore the
            featured Grade 5 Mathematics lesson.
          </p>
          <LinkButton
            className="mt-6"
            href={`/student/lessons/${addingFractionsLesson.slug}`}
          >
            Explore lesson <ArrowRight aria-hidden="true" size={18} />
          </LinkButton>
        </div>
        <GamificationDashboard compact />
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
        <Card className="bg-[#fffdf4] p-6 md:p-7">
          <div className="flex items-start gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-[12px] border-2 border-[#17150f] bg-[#ffd95f] text-[#17150f]">
              <Calculator aria-hidden="true" size={25} />
            </span>
            <div>
              <h2 className="text-ink text-2xl font-black tracking-[-0.025em]">
                {addingFractionsLesson.title}
              </h2>
              <p className="text-ink-muted mt-1 text-sm font-semibold">
                {addingFractionsLesson.subject} · {addingFractionsLesson.unit}
              </p>
              <p className="text-ink-muted mt-4 max-w-[65ch] leading-7">
                {addingFractionsLesson.summary}
              </p>
              <LinkButton
                className="mt-5"
                href={`/student/lessons/${addingFractionsLesson.slug}`}
                variant="secondary"
              >
                Open overview <BookOpen aria-hidden="true" size={18} />
              </LinkButton>
            </div>
          </div>
        </Card>

        <Card className="bg-[#91e3b7] p-6 md:p-7">
          <Compass aria-hidden="true" className="text-[#17150f]" size={29} />
          <h2 className="text-ink mt-4 text-xl font-black">
            Explore your subjects
          </h2>
          <p className="text-ink-muted mt-2 leading-6">
            Browse the Grade 5 learning areas and open the Mathematics path.
          </p>
          <LinkButton className="mt-5" href="/student/subjects" variant="ghost">
            View subjects <ArrowRight aria-hidden="true" size={18} />
          </LinkButton>
        </Card>
      </section>
    </>
  );
}
