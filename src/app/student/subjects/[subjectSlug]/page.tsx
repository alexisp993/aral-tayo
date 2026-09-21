import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Calculator,
  Check,
  LockKeyhole,
} from "lucide-react";

import { Card, LinkButton } from "@/components/ui";
import { addingFractionsLesson, getSubject, mathUnits } from "@/lib/curriculum";

export function generateStaticParams() {
  return [{ subjectSlug: "mathematics" }];
}

export default async function SubjectDetailPage({
  params,
}: {
  params: Promise<{ subjectSlug: string }>;
}) {
  const { subjectSlug } = await params;
  const subject = getSubject(subjectSlug);
  if (!subject?.available || subject.slug !== "mathematics") notFound();

  return (
    <>
      <Link
        className="text-brand focus-visible:outline-brand inline-flex min-h-11 items-center gap-2 rounded-lg font-bold focus-visible:outline-3 focus-visible:outline-offset-2"
        href="/student/subjects"
      >
        <ArrowLeft aria-hidden="true" size={18} /> Back to subjects
      </Link>

      <header className="mt-2 border-b-2 border-[#17150f] pb-7">
        <div className="flex items-start gap-4">
          <span className="game-chip grid size-16 shrink-0 place-items-center rounded-[14px] bg-[#ffd95f] text-[#17150f]">
            <Calculator aria-hidden="true" size={34} strokeWidth={2.4} />
          </span>
          <div>
            <h1 className="game-display text-4xl font-semibold text-[#17150f] md:text-6xl">
              Mathematics
            </h1>
            <p className="text-ink mt-1 text-lg font-bold">Grade 5</p>
            <p className="text-ink-muted mt-3 max-w-[65ch] leading-7">
              Build your problem-solving skills and discover how mathematics is
              part of everyday life.
            </p>
          </div>
        </div>
      </header>

      <div className="mt-6 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <section aria-labelledby="units-heading">
          <h2 className="text-ink text-2xl font-black" id="units-heading">
            Units
          </h2>
          <div className="mt-4 space-y-3">
            {mathUnits.map((unit, index) => (
              <Card
                className={`flex items-center gap-4 p-4 ${unit.current ? "bg-brand-soft ring-brand/20 ring-2" : ""}`}
                key={unit.title}
              >
                <span
                  className={`grid size-11 shrink-0 place-items-center rounded-xl font-black ${unit.current ? "bg-brand text-white" : "text-ink-muted bg-slate-100"}`}
                >
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-ink font-black">{unit.title}</h3>
                  <p className="text-ink-muted mt-1 text-sm leading-5">
                    {unit.description}
                  </p>
                </div>
                <span className="text-ink-muted text-xs font-bold">
                  {unit.current ? `${unit.lessonCount} lesson` : "Coming soon"}
                </span>
              </Card>
            ))}
          </div>
        </section>

        <section aria-labelledby="fractions-heading">
          <Card className="p-6 md:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-brand text-sm font-bold">Unit 4</p>
                <h2
                  className="text-ink mt-1 text-2xl font-black"
                  id="fractions-heading"
                >
                  Fractions
                </h2>
                <p className="text-ink-muted mt-2">
                  Equivalent fractions and fraction operations.
                </p>
              </div>
              <span className="bg-brand-soft text-brand rounded-full px-3 py-1 text-sm font-bold">
                Available
              </span>
            </div>

            <div className="mt-6 rounded-2xl bg-[#f8fbff] p-4 md:p-5">
              <div className="flex items-start gap-3">
                <span className="bg-brand grid size-9 shrink-0 place-items-center rounded-xl font-black text-white">
                  1
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-ink font-black">
                    {addingFractionsLesson.title}
                  </h3>
                  <p className="text-ink-muted mt-1 text-sm leading-6">
                    {addingFractionsLesson.summary}
                  </p>
                </div>
                <Check
                  aria-label="Available"
                  className="text-[#12a65a]"
                  size={22}
                />
              </div>
              <LinkButton
                className="mt-4 w-full"
                href={`/student/lessons/${addingFractionsLesson.slug}`}
              >
                Open lesson <ArrowRight aria-hidden="true" size={18} />
              </LinkButton>
            </div>

            <div className="text-ink-muted mt-4 flex min-h-11 items-center gap-3 rounded-xl bg-slate-50 px-4 text-sm">
              <LockKeyhole aria-hidden="true" size={18} /> More lessons will
              appear when validated seed content is available.
            </div>
          </Card>
        </section>
      </div>
    </>
  );
}
