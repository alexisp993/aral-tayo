import addingFractionsSeed from "../../seed/grade-5-math/adding-fractions.seed.json";
import { getLesson } from "@/lib/curriculum";

const lessonSeeds = {
  "adding-fractions": addingFractionsSeed,
} as const;

export type LessonSlug = keyof typeof lessonSeeds;

export function isLessonSlug(slug: string): slug is LessonSlug {
  return getLesson(slug) !== undefined && slug in lessonSeeds;
}

export function getLessonSeed(slug: string) {
  return isLessonSlug(slug) ? lessonSeeds[slug] : undefined;
}
