import addingFractionsSeed from "../../seed/grade-5-math/adding-fractions.seed.json";
import { getLesson } from "@/lib/curriculum";

const comparingFractionsSeed = {
  lesson: {
    title: "Comparing Fractions",
    slug: "comparing-fractions",
    version: 1,
    learn_blocks: [
      {
        type: "intro",
        ordinal: 1,
        title: "What does comparison mean?",
        body: "Comparing fractions tells us which fraction is greater, which is less, or whether both fractions have the same value.",
      },
      {
        type: "worked_example",
        ordinal: 2,
        title: "Compare like fractions",
        body: "When denominators match, the fraction with the larger numerator is greater.",
        example: {
          expression: "3/8 ? 5/8",
          steps: [
            "Both denominators are 8.",
            "Compare the numerators: 3 is less than 5.",
            "Use the less-than symbol.",
          ],
          answer: "3/8 < 5/8",
        },
      },
      {
        type: "key_takeaway",
        ordinal: 3,
        title: "Same denominator",
        body: "Equal-size parts are easy to compare: more parts means the greater fraction.",
      },
      {
        type: "worked_example",
        ordinal: 4,
        title: "Use equivalent fractions",
        body: "For unlike denominators, rewrite the fractions with a common denominator before comparing.",
        example: {
          expression: "2/3 ? 3/4",
          steps: [
            "Use 12 as a common denominator.",
            "Rewrite 2/3 as 8/12 and 3/4 as 9/12.",
            "Eight twelfths is less than nine twelfths.",
          ],
          answer: "2/3 < 3/4",
        },
      },
      {
        type: "real_life",
        ordinal: 5,
        title: "Sharing bibingka",
        body: "If one plate has 3/4 of a bibingka and another has 2/3, the first plate has more because 9/12 is greater than 8/12.",
      },
    ],
    flashcards: [
      { ordinal: 1, front: "Greater than", back: "The symbol > means the value on the left is larger." },
      { ordinal: 2, front: "Less than", back: "The symbol < means the value on the left is smaller." },
      { ordinal: 3, front: "Equal to", back: "The symbol = means both values represent the same amount." },
      { ordinal: 4, front: "Like denominators", back: "Compare the numerators when denominators are the same." },
      { ordinal: 5, front: "Unlike denominators", back: "Use equivalent fractions with a common denominator." },
      { ordinal: 6, front: "1/2 ? 2/4", back: "1/2 = 2/4" },
      { ordinal: 7, front: "3/5 ? 2/5", back: "3/5 > 2/5" },
      { ordinal: 8, front: "2/3 ? 3/4", back: "2/3 < 3/4" },
    ],
    practice: {
      activities: [
        {
          id: "cf-pr-01",
          version: 1,
          type: "multiple_choice",
          ordinal: 1,
          instruction: "Choose the correct comparison.",
          config: {
            prompt: "Which statement is true?",
            options: [
              { id: "a", label: "3/7 < 2/7" },
              { id: "b", label: "3/7 > 2/7" },
              { id: "c", label: "3/7 = 2/7" },
              { id: "d", label: "3/7 > 7/7" },
            ],
          },
          answer_key: { option_id: "b" },
          hint: "The denominators match, so compare 3 and 2.",
          explanation: "Three sevenths is greater than two sevenths.",
        },
        {
          id: "cf-pr-02",
          version: 1,
          type: "drag_drop",
          ordinal: 2,
          instruction: "Choose the symbol that makes the comparison true.",
          config: {
            expression: "5/8 ? 3/8",
            items: [
              { id: "i1", label: "<" },
              { id: "i2", label: ">" },
              { id: "i3", label: "=" },
            ],
            drop_zones: [{ id: "answer", label: "Comparison symbol" }],
          },
          answer_key: { placements: { answer: "i2" } },
          hint: "Both fractions have eighths. Which has more eighths?",
          explanation: "Five eighths is greater than three eighths.",
        },
        {
          id: "cf-pr-03",
          version: 1,
          type: "match_pairs",
          ordinal: 3,
          instruction: "Match each fraction with an equivalent fraction.",
          config: {
            left: [
              { id: "l1", label: "1/2" },
              { id: "l2", label: "2/3" },
              { id: "l3", label: "3/4" },
            ],
            right: [
              { id: "r1", label: "6/8" },
              { id: "r2", label: "2/4" },
              { id: "r3", label: "4/6" },
            ],
          },
          answer_key: { pairs: [["l1", "r2"], ["l2", "r3"], ["l3", "r1"]] },
          hint: "Multiply the numerator and denominator by the same number.",
          explanation: "Each matched pair represents the same amount.",
        },
        {
          id: "cf-pr-04",
          version: 1,
          type: "sort_categorize",
          ordinal: 4,
          instruction: "Sort each fraction by comparing it with 1/2.",
          config: {
            categories: [
              { id: "less", label: "Less than 1/2" },
              { id: "equal", label: "Equal to 1/2" },
              { id: "greater", label: "Greater than 1/2" },
            ],
            items: [
              { id: "s1", label: "1/4" },
              { id: "s2", label: "2/4" },
              { id: "s3", label: "3/4" },
              { id: "s4", label: "2/6" },
              { id: "s5", label: "3/6" },
              { id: "s6", label: "5/6" },
            ],
          },
          answer_key: { mapping: { s1: "less", s4: "less", s2: "equal", s5: "equal", s3: "greater", s6: "greater" } },
          hint: "Rewrite one half using fourths or sixths.",
          explanation: "Equivalent fractions help place each value around one half.",
        },
        {
          id: "cf-pr-05",
          version: 1,
          type: "hotspot",
          ordinal: 5,
          instruction: "Select 4 of the 8 parts to show a fraction equal to 1/2.",
          config: {
            visual: {
              kind: "fraction_circle",
              parts: 8,
              regions: Array.from({ length: 8 }, (_, index) => ({ id: `part-${index + 1}`, label: `Part ${index + 1} of 8` })),
            },
            selection: { min: 4, max: 4, rule: "selection_count" },
          },
          answer_key: { selected_count: 4 },
          hint: "Half of eight equal parts is four parts.",
          explanation: "Four eighths equals one half.",
        },
        {
          id: "cf-pr-06",
          version: 1,
          type: "multiple_choice",
          ordinal: 6,
          instruction: "Compare fractions with unlike denominators.",
          config: {
            prompt: "Which fraction is greater: 2/3 or 3/4?",
            options: [
              { id: "a", label: "2/3" },
              { id: "b", label: "3/4" },
              { id: "c", label: "They are equal" },
              { id: "d", label: "Not enough information" },
            ],
          },
          answer_key: { option_id: "b" },
          hint: "Rewrite both fractions with denominator 12.",
          explanation: "2/3 = 8/12 and 3/4 = 9/12, so 3/4 is greater.",
        },
        {
          id: "cf-pr-07",
          version: 1,
          type: "multiple_choice",
          ordinal: 7,
          instruction: "Solve the story comparison.",
          config: {
            prompt: "Ana walked 3/5 km and Ben walked 4/5 km. Who walked farther?",
            options: [
              { id: "a", label: "Ana" },
              { id: "b", label: "Ben" },
              { id: "c", label: "They walked the same distance" },
              { id: "d", label: "Cannot be compared" },
            ],
          },
          answer_key: { option_id: "b" },
          hint: "The denominators match. Compare the numerators.",
          explanation: "Four fifths is greater than three fifths, so Ben walked farther.",
        },
      ],
    },
  },
} as unknown as typeof addingFractionsSeed;

const subtractingFractionsSeed = {
  lesson: {
    title: "Subtracting Fractions", slug: "subtracting-fractions", version: 1,
    learn_blocks: [
      { type: "intro", ordinal: 1, title: "Taking parts away", body: "Subtracting fractions means taking equal parts away from a whole or from another fraction." },
      { type: "worked_example", ordinal: 2, title: "Subtract like fractions", body: "When denominators match, subtract the numerators and keep the denominator.", example: { expression: "5/8 − 2/8", steps: ["Both fractions use eighths.", "Subtract the numerators: 5 − 2 = 3.", "Keep the denominator 8."], answer: "5/8 − 2/8 = 3/8" } },
      { type: "key_takeaway", ordinal: 3, title: "Keep equal-size parts", body: "You can only subtract parts that are the same size. The denominator stays the same when it is already common." },
      { type: "worked_example", ordinal: 4, title: "Make a common denominator", body: "For unlike denominators, rewrite one or both fractions as equivalent fractions before subtracting.", example: { expression: "3/4 − 1/2", steps: ["Use 4 as the common denominator.", "Rewrite 1/2 as 2/4.", "Subtract 3/4 − 2/4."], answer: "3/4 − 1/2 = 1/4" } },
      { type: "real_life", ordinal: 5, title: "Saving a slice", body: "If 3/4 of a bibingka is on a plate and 1/4 is eaten, 2/4 remains. That is the same as 1/2." },
    ],
    flashcards: [
      { ordinal: 1, front: "Difference", back: "The answer after subtracting." },
      { ordinal: 2, front: "Like denominators", back: "Subtract the numerators and keep the common denominator." },
      { ordinal: 3, front: "5/8 − 2/8", back: "3/8" },
      { ordinal: 4, front: "4/4 − 1/4", back: "3/4" },
      { ordinal: 5, front: "Unlike denominators", back: "Use equivalent fractions to make a common denominator first." },
      { ordinal: 6, front: "3/4 − 1/2", back: "1/4, because 1/2 = 2/4." },
      { ordinal: 7, front: "8/8 − 3/8", back: "5/8" },
      { ordinal: 8, front: "2/4", back: "It is equivalent to 1/2." },
    ],
    practice: { activities: [
      { id: "sf-pr-01", version: 1, type: "multiple_choice", ordinal: 1, instruction: "Choose the correct difference.", config: { prompt: "What is 5/7 − 2/7?", options: [{ id: "a", label: "3/7" }, { id: "b", label: "3/14" }, { id: "c", label: "7/7" }, { id: "d", label: "2/5" }] }, answer_key: { option_id: "a" }, hint: "The denominators match, so subtract 5 − 2.", explanation: "Five sevenths minus two sevenths is three sevenths." },
      { id: "sf-pr-02", version: 1, type: "drag_drop", ordinal: 2, instruction: "Drag the correct difference into the answer box.", config: { expression: "4/4 − 1/4 = ?", items: [{ id: "i1", label: "2/4" }, { id: "i2", label: "3/4" }, { id: "i3", label: "1/4" }], drop_zones: [{ id: "answer", label: "Difference" }] }, answer_key: { placements: { answer: "i2" } }, hint: "Subtract one fourth from four fourths.", explanation: "Four fourths minus one fourth leaves three fourths." },
      { id: "sf-pr-03", version: 1, type: "match_pairs", ordinal: 3, instruction: "Match each subtraction with its difference.", config: { left: [{ id: "l1", label: "5/8 − 2/8" }, { id: "l2", label: "4/6 − 1/6" }, { id: "l3", label: "7/10 − 3/10" }], right: [{ id: "r1", label: "4/10" }, { id: "r2", label: "3/8" }, { id: "r3", label: "3/6" }] }, answer_key: { pairs: [["l1", "r2"], ["l2", "r3"], ["l3", "r1"]] }, hint: "Keep each denominator and subtract the numerators.", explanation: "Each expression uses like denominators." },
      { id: "sf-pr-04", version: 1, type: "sort_categorize", ordinal: 4, instruction: "Sort each expression by its difference.", config: { categories: [{ id: "quarter", label: "Difference is 1/4" }, { id: "half", label: "Difference is 1/2" }, { id: "threequarters", label: "Difference is 3/4" }], items: [{ id: "s1", label: "2/4 − 1/4" }, { id: "s2", label: "3/4 − 1/4" }, { id: "s3", label: "4/4 − 1/4" }, { id: "s4", label: "3/4 − 2/4" }, { id: "s5", label: "4/4 − 2/4" }, { id: "s6", label: "4/4 − 3/4" }] }, answer_key: { mapping: { s1: "quarter", s4: "quarter", s6: "quarter", s2: "half", s5: "half", s3: "threequarters" } }, hint: "Subtract the top numbers because all fractions are in fourths.", explanation: "The denominator tells the size of every equal part." },
      { id: "sf-pr-05", version: 1, type: "hotspot", ordinal: 5, instruction: "Select 5 of the 8 parts to show 8/8 − 3/8.", config: { visual: { kind: "fraction_circle", parts: 8, regions: Array.from({ length: 8 }, (_, index) => ({ id: `part-${index + 1}`, label: `Part ${index + 1} of 8` })) }, selection: { min: 5, max: 5, rule: "selection_count" } }, answer_key: { selected_count: 5 }, hint: "Taking away three of eight equal parts leaves five parts.", explanation: "Eight eighths minus three eighths equals five eighths." },
      { id: "sf-pr-06", version: 1, type: "multiple_choice", ordinal: 6, instruction: "Subtract unlike fractions.", config: { prompt: "What is 3/4 − 1/2?", options: [{ id: "a", label: "2/2" }, { id: "b", label: "1/4" }, { id: "c", label: "2/4" }, { id: "d", label: "1/2" }] }, answer_key: { option_id: "b" }, hint: "Rewrite one half as two fourths.", explanation: "3/4 − 2/4 = 1/4." },
      { id: "sf-pr-07", version: 1, type: "multiple_choice", ordinal: 7, instruction: "Solve the story problem.", config: { prompt: "Lina had 7/8 of a ribbon and used 2/8. How much ribbon is left?", options: [{ id: "a", label: "5/8" }, { id: "b", label: "5/16" }, { id: "c", label: "9/8" }, { id: "d", label: "2/6" }] }, answer_key: { option_id: "a" }, hint: "The ribbon pieces are all eighths.", explanation: "Seven eighths minus two eighths leaves five eighths." },
    ] },
  },
} as unknown as typeof addingFractionsSeed;

const lessonSeeds = {
  "adding-fractions": addingFractionsSeed,
  "comparing-fractions": comparingFractionsSeed,
  "subtracting-fractions": subtractingFractionsSeed,
} as const;

export type LessonSlug = keyof typeof lessonSeeds;

export function isLessonSlug(slug: string): slug is LessonSlug {
  return getLesson(slug) !== undefined && slug in lessonSeeds;
}

export function getLessonSeed(slug: string) {
  return isLessonSlug(slug) ? lessonSeeds[slug] : undefined;
}
