import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  FlaskConical,
  Globe2,
  Heart,
  Languages,
  Palette,
  Utensils,
} from "lucide-react";

import { Card } from "@/components/ui";
import { lessons, subjects } from "@/lib/curriculum";

const icons = {
  calculator: Calculator,
  flask: FlaskConical,
  book: BookOpen,
  languages: Languages,
  globe: Globe2,
  utensils: Utensils,
  palette: Palette,
  heart: Heart,
};

export default function SubjectsPage() {
  const mathematics = subjects[0];
  const lessonCount = lessons.length;

  return (
    <>
      <header className="border-b-2 border-[#17150f] pb-6">
        <h1 className="game-display text-4xl font-semibold text-[#17150f] md:text-6xl">
          Subjects
        </h1>
        <p className="mt-2 text-lg font-bold text-[#5d574a]">
          Choose a learning area and start exploring.
        </p>
      </header>

      <section aria-labelledby="available-subject" className="mt-6">
        <h2 className="sr-only" id="available-subject">
          Available subject
        </h2>
        <Link
          className="focus-visible:outline-brand block rounded-2xl focus-visible:outline-3 focus-visible:outline-offset-2"
          href={`/student/subjects/${mathematics.slug}`}
        >
          <Card
            className={`grid gap-6 p-6 transition hover:-translate-y-0.5 hover:shadow-lg motion-reduce:transform-none md:grid-cols-[auto_1fr_auto] md:items-center md:p-8 ${mathematics.theme}`}
          >
            <span className="grid size-16 place-items-center rounded-2xl bg-white/75">
              <Calculator aria-hidden="true" size={38} strokeWidth={2.2} />
            </span>
            <div>
              <p className="text-sm font-extrabold text-[#8b261f]">
                Available now
              </p>
              <h2 className="text-ink mt-1 text-3xl font-black tracking-[-0.03em]">
                {mathematics.name}
              </h2>
              <p className="text-ink-muted mt-2 max-w-[65ch] leading-7">
                {mathematics.description} Open the Grade 5 Fractions unit and
                explore {lessonCount} complete fraction lessons.
              </p>
            </div>
            <span className="text-brand flex min-h-11 items-center gap-2 font-bold">
              Open subject <ArrowRight aria-hidden="true" size={21} />
            </span>
          </Card>
        </Link>
      </section>

      <section aria-labelledby="upcoming-subjects" className="mt-8">
        <h2 className="text-ink text-xl font-black" id="upcoming-subjects">
          Upcoming subjects
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {subjects.slice(1).map((subject) => {
            const Icon = icons[subject.icon];
            return (
              <Card
                className={`flex min-h-28 items-start gap-3 p-4 ${subject.theme}`}
                key={subject.slug}
              >
                <Icon
                  aria-hidden="true"
                  className="shrink-0"
                  size={27}
                  strokeWidth={2.2}
                />
                <div className="min-w-0 flex-1">
                  <h3 className="text-ink font-black">{subject.name}</h3>
                  <p className="text-ink-muted mt-1 text-sm leading-5">
                    {subject.description}
                  </p>
                </div>
                <span className="rounded-full bg-white/75 px-2 py-1 text-xs font-bold tracking-wide uppercase">
                  Soon
                </span>
              </Card>
            );
          })}
        </div>
      </section>
    </>
  );
}
