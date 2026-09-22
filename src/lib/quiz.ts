export type QuizAnswer = string | Record<string, string> | string[];

type BaseQuestion = { id: string; prompt: string; explanation: string };
export type MultipleChoiceQuestion = BaseQuestion & {
  type: "bridge_builder";
  options: { id: string; label: string }[];
  correctOptionId: string;
};
export type FractionRunnerQuestion = BaseQuestion & {
  type: "fraction_runner";
  lanes: { id: string; label: string }[];
  course: {
    stepCount: number;
    stepDurationMs: number;
    obstacles: { step: number; lane: number }[];
  };
  correctLaneId: string;
};
export type PizzaCatchQuestion = BaseQuestion & {
  type: "pizza_catch";
  slices: { id: string; label: string }[];
  course: { stepCount: number; stepDurationMs: number };
  correctSliceId: string;
};
export type NumberLineDashQuestion = BaseQuestion & {
  type: "number_line_dash";
  positions: { id: string; label: string }[];
  course: { stepCount: number; stepDurationMs: number };
  correctPositionId: string;
};
export type FractionCannonQuestion = BaseQuestion & {
  type: "fraction_cannon";
  targets: { id: string; label: string }[];
  correctTargetId: string;
};
export type RecipeBuilderQuestion = BaseQuestion & {
  type: "recipe_builder";
  ingredients: { id: string; label: string }[];
  correctIngredientIds: string[];
};
export type FractionMemoryQuestion = BaseQuestion & {
  type: "fraction_memory";
  cards: { id: string; label: string }[];
  correctPairs: [string, string][];
};
export type MatchPairsQuestion = BaseQuestion & {
  type: "treasure_match";
  pairs: { source: string; target: string }[];
};
export type OrderingQuestion = BaseQuestion & {
  type: "order_tower";
  items: { id: string; label: string }[];
  correctOrder: string[];
};
export type QuizQuestion =
  | MultipleChoiceQuestion
  | FractionRunnerQuestion
  | PizzaCatchQuestion
  | NumberLineDashQuestion
  | FractionCannonQuestion
  | RecipeBuilderQuestion
  | FractionMemoryQuestion
  | MatchPairsQuestion
  | OrderingQuestion;
export type PublicQuizQuestion =
  | Omit<MultipleChoiceQuestion, "correctOptionId" | "explanation">
  | Omit<FractionRunnerQuestion, "correctLaneId" | "explanation">
  | Omit<PizzaCatchQuestion, "correctSliceId" | "explanation">
  | Omit<NumberLineDashQuestion, "correctPositionId" | "explanation">
  | Omit<FractionCannonQuestion, "correctTargetId" | "explanation">
  | Omit<RecipeBuilderQuestion, "correctIngredientIds" | "explanation">
  | Omit<FractionMemoryQuestion, "correctPairs" | "explanation">
  | {
      id: string;
      type: "treasure_match";
      prompt: string;
      sources: string[];
      targets: string[];
    }
  | Omit<OrderingQuestion, "correctOrder" | "explanation">;

const choice = (
  id: string,
  prompt: string,
  options: string[],
  correct: string,
  explanation: string,
): MultipleChoiceQuestion => ({
  id,
  type: "bridge_builder",
  prompt,
  options: options.map((label, index) => ({
    id: String.fromCharCode(97 + index),
    label,
  })),
  correctOptionId: correct,
  explanation,
});
const runner = (
  id: string,
  prompt: string,
  lanes: string[],
  correct: string,
  explanation: string,
  course: FractionRunnerQuestion["course"],
): FractionRunnerQuestion => ({
  id,
  type: "fraction_runner",
  prompt,
  lanes: lanes.map((label, index) => ({
    id: String.fromCharCode(97 + index),
    label,
  })),
  correctLaneId: correct,
  explanation,
  course,
});
const pizzaCatch = (
  id: string,
  prompt: string,
  slices: string[],
  correct: string,
  explanation: string,
): PizzaCatchQuestion => ({
  id,
  type: "pizza_catch",
  prompt,
  slices: slices.map((label, index) => ({
    id: String.fromCharCode(97 + index),
    label,
  })),
  course: { stepCount: 14, stepDurationMs: 460 },
  correctSliceId: correct,
  explanation,
});
const numberLineDash = (
  id: string,
  prompt: string,
  correct: string,
  explanation: string,
): NumberLineDashQuestion => ({
  id,
  type: "number_line_dash",
  prompt,
  positions: ["0", "1/4", "1/2", "3/4", "1"].map((label, index) => ({
    id: String.fromCharCode(97 + index),
    label,
  })),
  course: { stepCount: 12, stepDurationMs: 500 },
  correctPositionId: correct,
  explanation,
});
const fractionCannon = (
  id: string,
  prompt: string,
  targets: string[],
  correct: string,
  explanation: string,
): FractionCannonQuestion => ({
  id,
  type: "fraction_cannon",
  prompt,
  targets: targets.map((label, index) => ({
    id: String.fromCharCode(97 + index),
    label,
  })),
  correctTargetId: correct,
  explanation,
});
const recipeBuilder = (
  id: string,
  prompt: string,
  ingredients: string[],
  correctIngredientIds: string[],
  explanation: string,
): RecipeBuilderQuestion => ({
  id,
  type: "recipe_builder",
  prompt,
  ingredients: ingredients.map((label, index) => ({
    id: String.fromCharCode(97 + index),
    label,
  })),
  correctIngredientIds,
  explanation,
});
const fractionMemory = (
  id: string,
  prompt: string,
  cards: string[],
  correctPairs: [string, string][],
  explanation: string,
): FractionMemoryQuestion => ({
  id,
  type: "fraction_memory",
  prompt,
  cards: cards.map((label, index) => ({
    id: String.fromCharCode(97 + index),
    label,
  })),
  correctPairs,
  explanation,
});
export const addingFractionsQuiz: QuizQuestion[] = [
  choice(
    "af-q-01",
    "What is 2/7 + 3/7?",
    ["5/7", "5/14", "1/7", "6/7"],
    "a",
    "The denominators match, so add 2 + 3 and keep 7.",
  ),
  runner(
    "af-run-01",
    "Run to the fraction that equals 1/2.",
    ["2/4", "3/4", "2/3"],
    "a",
    "Two out of four equal parts is the same amount as one out of two.",
    {
      stepCount: 18,
      stepDurationMs: 420,
      obstacles: [
        { step: 4, lane: 0 },
        { step: 7, lane: 2 },
        { step: 11, lane: 1 },
        { step: 14, lane: 0 },
      ],
    },
  ),
  pizzaCatch(
    "af-pizza-01",
    "Catch the pizza slice card that completes 1/4 + 2/4.",
    ["2/4", "3/4", "3/8"],
    "b",
    "The denominators match, so add 1 + 2 and keep the denominator 4.",
  ),
  numberLineDash(
    "af-line-01",
    "Dash to the point that shows 1/4 + 1/4.",
    "c",
    "One fourth plus one fourth is two fourths, which equals one half.",
  ),
  fractionCannon(
    "af-cannon-01",
    "Aim at the fraction equivalent to 2/4.",
    ["1/4", "1/2", "3/4"],
    "b",
    "Two fourths simplifies to one half.",
  ),
  fractionCannon(
    "af-cannon-02",
    "Aim at the sum of 2/8 + 3/8.",
    ["5/16", "5/8", "6/8"],
    "b",
    "The denominators match, so add 2 + 3 and keep the denominator 8.",
  ),
  recipeBuilder(
    "af-recipe-01",
    "Mix exactly two ingredients to make 3/4 cup.",
    ["1/4 cup berries", "2/4 cup oats", "1/8 cup seeds", "3/8 cup yogurt"],
    ["a", "b"],
    "One fourth plus two fourths equals three fourths of a cup.",
  ),
  recipeBuilder(
    "af-recipe-02",
    "Mix exactly two ingredients to make 1 whole cup.",
    ["1/4 cup mango", "3/4 cup milk", "1/8 cup oats", "1/2 cup yogurt"],
    ["a", "b"],
    "One fourth plus three fourths equals four fourths, or one whole cup.",
  ),
  fractionMemory(
    "af-memory-01",
    "Clear the board by matching equivalent fractions.",
    ["1/2", "2/3", "2/4", "6/8", "4/6", "3/4"],
    [["a", "c"], ["b", "e"], ["d", "f"]],
    "Each pair names the same amount: 1/2 = 2/4, 2/3 = 4/6, and 6/8 = 3/4.",
  ),
  fractionMemory(
    "af-memory-02",
    "Find all three equivalent-fraction pairs.",
    ["1/3", "3/5", "2/6", "6/10", "4/8", "1/2"],
    [["a", "c"], ["b", "d"], ["e", "f"]],
    "Equivalent fractions keep the same value when the numerator and denominator are multiplied by the same number.",
  ),
  numberLineDash(
    "af-line-02",
    "Dash to the point that shows 1/2 + 1/4.",
    "d",
    "Rewrite one half as two fourths, then add one fourth to make three fourths.",
  ),
  pizzaCatch(
    "af-pizza-02",
    "Catch the pizza slice card equivalent to 1/2.",
    ["1/4", "2/4", "3/4"],
    "b",
    "Two of four equal slices cover the same amount as one of two equal slices.",
  ),
  runner(
    "af-run-02",
    "Run to the sum of 1/4 + 2/4.",
    ["2/4", "3/4", "3/8"],
    "b",
    "The denominators match, so add 1 + 2 and keep the denominator 4.",
    {
      stepCount: 18,
      stepDurationMs: 420,
      obstacles: [
        { step: 3, lane: 1 },
        { step: 7, lane: 0 },
        { step: 12, lane: 2 },
        { step: 15, lane: 1 },
      ],
    },
  ),
  choice(
    "af-q-02",
    "Which fraction is equivalent to 1/2?",
    ["1/4", "2/4", "3/4", "2/3"],
    "b",
    "Multiplying both parts of 1/2 by 2 gives 2/4.",
  ),
  choice(
    "af-q-03",
    "What is 1/2 + 1/4?",
    ["2/6", "2/4", "3/4", "1/6"],
    "c",
    "Rewrite 1/2 as 2/4, then add 2/4 + 1/4.",
  ),
  choice(
    "af-q-04",
    "What is 3/8 + 2/8?",
    ["5/16", "1/8", "5/8", "6/8"],
    "c",
    "Add the numerators and keep the common denominator.",
  ),
  choice(
    "af-q-05",
    "Which common denominator works for 1/3 and 1/6?",
    ["3", "6", "9", "12 only"],
    "b",
    "Six is divisible by both 3 and 6.",
  ),
  choice(
    "af-q-06",
    "What is 1/3 + 1/6?",
    ["2/9", "2/6", "1/2", "1/9"],
    "c",
    "Rewrite 1/3 as 2/6, then add to make 3/6 = 1/2.",
  ),
  choice(
    "af-q-07",
    "Mia ate 1/4 of a pizza, then 2/4 more. How much did she eat?",
    ["2/8", "3/4", "3/8", "1/2"],
    "b",
    "The pieces are fourths, so add 1 + 2 and keep the denominator 4.",
  ),
  choice(
    "af-q-08",
    "What is 2/5 + 1/10?",
    ["3/15", "3/10", "1/2", "2/15"],
    "c",
    "Rewrite 2/5 as 4/10. Then 4/10 + 1/10 = 5/10 = 1/2.",
  ),
  choice(
    "af-q-09",
    "When adding fractions with the same denominator, what stays the same?",
    ["The numerator", "The denominator", "Both numbers", "Neither number"],
    "b",
    "Keep the common denominator and add the numerators.",
  ),
  choice(
    "af-q-10",
    "Which sum equals one whole?",
    ["1/4 + 2/4", "2/5 + 2/5", "3/8 + 4/8", "3/6 + 3/6"],
    "d",
    "3/6 + 3/6 = 6/6, which is one whole.",
  ),
  {
    id: "af-match-01",
    type: "treasure_match",
    prompt: "Match each fraction pair with its common denominator.",
    pairs: [
      { source: "1/2 and 1/4", target: "4" },
      { source: "1/3 and 1/6", target: "6" },
      { source: "1/4 and 1/8", target: "8" },
    ],
    explanation:
      "Choose a denominator that both original denominators divide into.",
  },
  {
    id: "af-match-02",
    type: "treasure_match",
    prompt: "Match each addition with its correct sum.",
    pairs: [
      { source: "1/4 + 2/4", target: "3/4" },
      { source: "2/6 + 1/6", target: "3/6" },
      { source: "3/8 + 2/8", target: "5/8" },
    ],
    explanation:
      "When denominators already match, add numerators and keep the denominator.",
  },
  {
    id: "af-order-01",
    type: "order_tower",
    prompt: "Put these steps for 1/2 + 1/4 in order.",
    items: [
      { id: "b", label: "Rewrite 1/2 as 2/4" },
      { id: "c", label: "Add 2/4 + 1/4 = 3/4" },
      { id: "a", label: "Find a common denominator of 4" },
    ],
    correctOrder: ["a", "b", "c"],
    explanation: "Find the shared denominator first, rewrite, then add.",
  },
  {
    id: "af-order-02",
    type: "order_tower",
    prompt: "Put these steps for 1/3 + 1/6 in order.",
    items: [
      { id: "b", label: "Rewrite 1/3 as 2/6" },
      { id: "c", label: "Add 2/6 + 1/6 = 3/6" },
      { id: "a", label: "Choose 6 as the common denominator" },
    ],
    correctOrder: ["a", "b", "c"],
    explanation:
      "A shared denominator comes before equivalent fractions and addition.",
  },
];
export const comparingFractionsQuiz: QuizQuestion[] = [
  choice(
    "cf-bridge-01",
    "Build the bridge to the true comparison.",
    ["3/5 > 2/5", "3/5 < 2/5", "3/5 = 2/5"],
    "a",
    "The denominators match, and 3 is greater than 2.",
  ),
  runner(
    "cf-run-01",
    "Run to the fraction equivalent to 2/3.",
    ["3/6", "4/6", "5/6"],
    "b",
    "Multiplying both parts of 2/3 by 2 gives 4/6.",
    {
      stepCount: 18,
      stepDurationMs: 420,
      obstacles: [
        { step: 4, lane: 2 },
        { step: 8, lane: 0 },
        { step: 12, lane: 1 },
        { step: 15, lane: 2 },
      ],
    },
  ),
  pizzaCatch(
    "cf-pizza-01",
    "Catch the smallest fraction.",
    ["3/4", "1/4", "2/4"],
    "b",
    "With equal denominators, the smallest numerator gives the smallest fraction.",
  ),
  numberLineDash(
    "cf-line-01",
    "Dash to the point greater than 1/2 but less than 1.",
    "d",
    "Three fourths lies between one half and one whole.",
  ),
  fractionCannon(
    "cf-cannon-01",
    "Aim at the fraction equivalent to 3/5.",
    ["5/10", "6/10", "8/10"],
    "b",
    "Multiplying both 3 and 5 by 2 gives 6/10.",
  ),
  recipeBuilder(
    "cf-recipe-01",
    "Mix exactly two ingredients to make an amount greater than 1/2 cup.",
    ["1/4 cup fruit", "2/4 cup oats", "1/8 cup seeds", "1/8 cup milk"],
    ["a", "b"],
    "One fourth plus two fourths is three fourths, which is greater than one half.",
  ),
  fractionMemory(
    "cf-memory-01",
    "Clear the board by matching equivalent fractions.",
    ["1/2", "2/3", "2/4", "6/8", "4/6", "3/4"],
    [["a", "c"], ["b", "e"], ["d", "f"]],
    "Equivalent fractions name the same value even when their numbers differ.",
  ),
  {
    id: "cf-match-01",
    type: "treasure_match",
    prompt: "Match each fraction with its relationship to 1/2.",
    pairs: [
      { source: "1/4", target: "Less than 1/2" },
      { source: "3/6", target: "Equal to 1/2" },
      { source: "3/4", target: "Greater than 1/2" },
    ],
    explanation:
      "One fourth is below one half, three sixths equals one half, and three fourths is above one half.",
  },
  {
    id: "cf-order-01",
    type: "order_tower",
    prompt: "Put the steps for comparing 2/3 and 3/4 in order.",
    items: [
      { id: "b", label: "Rewrite them as 8/12 and 9/12" },
      { id: "c", label: "Compare 8 and 9, so 2/3 < 3/4" },
      { id: "a", label: "Choose 12 as a common denominator" },
    ],
    correctOrder: ["a", "b", "c"],
    explanation:
      "Choose a common denominator, rewrite both fractions, then compare their numerators.",
  },
];
export const subtractingFractionsQuiz: QuizQuestion[] = [
  choice("sf-bridge-01", "Which subtraction has a difference of 3/5?", ["4/5 − 1/5", "5/5 − 1/5", "3/5 − 1/5"], "a", "Four fifths minus one fifth is three fifths."),
  runner("sf-run-01", "Run to the difference: 5/8 − 2/8.", ["3/8", "3/16", "2/8"], "a", "Keep eighths and subtract 5 − 2.", { stepCount: 18, stepDurationMs: 420, obstacles: [{ step: 4, lane: 1 }, { step: 8, lane: 2 }, { step: 12, lane: 0 }, { step: 15, lane: 1 }] }),
  pizzaCatch("sf-pizza-01", "Catch the slice card for 3/4 − 1/2.", ["1/4", "1/2", "2/4"], "a", "One half is two fourths, so three fourths minus two fourths is one fourth."),
  numberLineDash("sf-line-01", "Dash to the point that shows 1 − 1/4.", "d", "One whole is four fourths; subtract one fourth to reach three fourths."),
  fractionCannon("sf-cannon-01", "Aim at the difference: 3/4 − 1/2.", ["1/4", "1/2", "2/4"], "a", "Rewrite one half as two fourths, then subtract."),
  recipeBuilder("sf-recipe-01", "Mix exactly two ingredients to make the amount left after 1 cup − 1/4 cup.", ["1/4 cup berries", "2/4 cup oats", "1/8 cup seeds", "3/8 cup yogurt"], ["a", "b"], "One whole minus one fourth is three fourths; one fourth plus two fourths makes three fourths."),
  fractionMemory("sf-memory-01", "Clear the board by matching equivalent fractions before you subtract.", ["1/2", "2/4", "3/4", "6/8", "1/4", "2/8"], [["a", "b"], ["c", "d"], ["e", "f"]], "Equivalent fractions let you make common denominators for subtraction."),
  { id: "sf-match-01", type: "treasure_match", prompt: "Match each subtraction with its difference.", pairs: [{ source: "5/8 − 2/8", target: "3/8" }, { source: "4/6 − 1/6", target: "3/6" }, { source: "3/4 − 1/2", target: "1/4" }], explanation: "Use a common denominator, then subtract the numerators." },
  { id: "sf-order-01", type: "order_tower", prompt: "Put the steps for 3/4 − 1/2 in order.", items: [{ id: "b", label: "Rewrite 1/2 as 2/4" }, { id: "c", label: "Subtract 3/4 − 2/4 = 1/4" }, { id: "a", label: "Choose 4 as a common denominator" }], correctOrder: ["a", "b", "c"], explanation: "Find a common denominator, rewrite, then subtract." },
];
const quizBanks: Record<string, QuizQuestion[]> = {
  "adding-fractions": addingFractionsQuiz,
  "comparing-fractions": comparingFractionsQuiz,
  "subtracting-fractions": subtractingFractionsQuiz,
};
export function findQuestion(id: string) {
  return Object.values(quizBanks)
    .flat()
    .find((q) => q.id === id);
}
function shuffle<T>(items: T[], random: () => number) {
  return items
    .map((item) => ({ item, order: random() }))
    .sort((a, b) => a.order - b.order)
    .map(({ item }) => item);
}
export function selectQuizQuestions(
  lessonSlug: string,
  count = 5,
  random = Math.random,
) {
  const quiz = quizBanks[lessonSlug];
  if (!quiz) return [];
  const gameTypes = [
    "bridge_builder",
    "fraction_runner",
    "pizza_catch",
    "number_line_dash",
    "fraction_cannon",
    "recipe_builder",
    "fraction_memory",
    "treasure_match",
    "order_tower",
  ] as const;
  const selectedTypes = shuffle([...gameTypes], random).slice(0, count);
  const selected = selectedTypes.map(
    (type) =>
      shuffle(
        quiz.filter((q) => q.type === type),
        random,
      )[0],
  );
  return shuffle(selected, random);
}
export function publicQuestion(question: QuizQuestion): PublicQuizQuestion {
  if (question.type === "bridge_builder")
    return {
      id: question.id,
      type: question.type,
      prompt: question.prompt,
      options: question.options,
    };
  if (question.type === "fraction_runner")
    return {
      id: question.id,
      type: question.type,
      prompt: question.prompt,
      lanes: question.lanes,
      course: question.course,
    };
  if (question.type === "pizza_catch")
    return {
      id: question.id,
      type: question.type,
      prompt: question.prompt,
      slices: question.slices,
      course: question.course,
    };
  if (question.type === "number_line_dash")
    return {
      id: question.id,
      type: question.type,
      prompt: question.prompt,
      positions: question.positions,
      course: question.course,
    };
  if (question.type === "fraction_cannon")
    return {
      id: question.id,
      type: question.type,
      prompt: question.prompt,
      targets: question.targets,
    };
  if (question.type === "recipe_builder")
    return {
      id: question.id,
      type: question.type,
      prompt: question.prompt,
      ingredients: question.ingredients,
    };
  if (question.type === "fraction_memory")
    return {
      id: question.id,
      type: question.type,
      prompt: question.prompt,
      cards: question.cards,
    };
  if (question.type === "treasure_match")
    return {
      id: question.id,
      type: question.type,
      prompt: question.prompt,
      sources: question.pairs.map((p) => p.source),
      targets: [...question.pairs.map((p) => p.target)].reverse(),
    };
  return {
    id: question.id,
    type: question.type,
    prompt: question.prompt,
    items: question.items,
  };
}
export function isAnswerShape(
  question: QuizQuestion,
  answer: unknown,
): answer is QuizAnswer {
  if (question.type === "bridge_builder")
    return (
      typeof answer === "string" &&
      question.options.some((o) => o.id === answer)
    );
  if (question.type === "fraction_runner")
    return (
      typeof answer === "string" &&
      question.lanes.some((lane) => lane.id === answer)
    );
  if (question.type === "pizza_catch")
    return (
      typeof answer === "string" &&
      question.slices.some((slice) => slice.id === answer)
    );
  if (question.type === "number_line_dash")
    return (
      typeof answer === "string" &&
      question.positions.some((position) => position.id === answer)
    );
  if (question.type === "fraction_cannon")
    return (
      typeof answer === "string" &&
      question.targets.some((target) => target.id === answer)
    );
  if (question.type === "recipe_builder")
    return (
      Array.isArray(answer) &&
      answer.length === 2 &&
      new Set(answer).size === 2 &&
      answer.every((id) =>
        question.ingredients.some((ingredient) => ingredient.id === id),
      )
    );
  if (question.type === "fraction_memory") {
    if (!Array.isArray(answer) || answer.length !== question.correctPairs.length)
      return false;
    const cardIds = new Set(question.cards.map((card) => card.id));
    const usedIds = answer.flatMap((pair) => pair.split(":"));
    return (
      answer.every((pair) => /^[a-z]:[a-z]$/.test(pair)) &&
      usedIds.length === question.cards.length &&
      new Set(usedIds).size === question.cards.length &&
      usedIds.every((id) => cardIds.has(id))
    );
  }
  if (question.type === "treasure_match")
    return (
      !!answer &&
      typeof answer === "object" &&
      !Array.isArray(answer) &&
      question.pairs.every(
        (p) => typeof (answer as Record<string, string>)[p.source] === "string",
      ) &&
      new Set(Object.values(answer as Record<string, string>)).size ===
        question.pairs.length &&
      Object.values(answer as Record<string, string>).every((target) =>
        question.pairs.some((p) => p.target === target),
      )
    );
  return (
    Array.isArray(answer) &&
    answer.length === question.items.length &&
    new Set(answer).size === answer.length &&
    answer.every((id) => question.items.some((item) => item.id === id))
  );
}

/** Whether a learner has supplied a complete, valid response for a public quiz challenge. */
export function isQuizDraftComplete(
  question: PublicQuizQuestion,
  draft: QuizAnswer | undefined,
) {
  if (question.type === "bridge_builder")
    return (
      typeof draft === "string" &&
      question.options.some((option) => option.id === draft)
    );
  if (question.type === "fraction_runner")
    return (
      typeof draft === "string" &&
      question.lanes.some((lane) => lane.id === draft)
    );
  if (question.type === "pizza_catch")
    return (
      typeof draft === "string" &&
      question.slices.some((slice) => slice.id === draft)
    );
  if (question.type === "number_line_dash")
    return (
      typeof draft === "string" &&
      question.positions.some((position) => position.id === draft)
    );
  if (question.type === "fraction_cannon")
    return (
      typeof draft === "string" &&
      question.targets.some((target) => target.id === draft)
    );
  if (question.type === "recipe_builder")
    return (
      Array.isArray(draft) &&
      draft.length === 2 &&
      new Set(draft).size === 2 &&
      draft.every((id) =>
        question.ingredients.some((ingredient) => ingredient.id === id),
      )
    );
  if (question.type === "fraction_memory") {
    if (!Array.isArray(draft) || draft.length !== question.cards.length / 2)
      return false;
    const cardIds = new Set(question.cards.map((card) => card.id));
    const usedIds = draft.flatMap((pair) => pair.split(":"));
    return (
      draft.every((pair) => /^[a-z]:[a-z]$/.test(pair)) &&
      usedIds.length === question.cards.length &&
      new Set(usedIds).size === question.cards.length &&
      usedIds.every((id) => cardIds.has(id))
    );
  }

  if (question.type === "treasure_match") {
    if (!draft || typeof draft !== "object" || Array.isArray(draft))
      return false;
    const matches = draft as Record<string, string>;
    return (
      question.sources.every(
        (source) =>
          typeof matches[source] === "string" &&
          question.targets.includes(matches[source]),
      ) &&
      new Set(question.sources.map((source) => matches[source])).size ===
        question.sources.length
    );
  }

  const order = Array.isArray(draft)
    ? draft
    : question.items.map((item) => item.id);
  return (
    order.length === question.items.length &&
    new Set(order).size === order.length &&
    order.every((id) => question.items.some((item) => item.id === id))
  );
}
export function evaluateQuizAnswer(question: QuizQuestion, answer: QuizAnswer) {
  const correct =
    question.type === "bridge_builder"
      ? answer === question.correctOptionId
      : question.type === "fraction_runner"
        ? answer === question.correctLaneId
      : question.type === "pizza_catch"
        ? answer === question.correctSliceId
      : question.type === "number_line_dash"
        ? answer === question.correctPositionId
      : question.type === "fraction_cannon"
        ? answer === question.correctTargetId
      : question.type === "recipe_builder"
        ? [...(answer as string[])].sort().every(
            (id, index) =>
              id === [...question.correctIngredientIds].sort()[index],
          )
      : question.type === "fraction_memory"
        ? [...(answer as string[])].sort().every(
            (pair, index) =>
              pair ===
              question.correctPairs
                .map((ids) => [...ids].sort().join(":"))
                .sort()[index],
          )
      : question.type === "treasure_match"
        ? question.pairs.every(
            (p) => (answer as Record<string, string>)[p.source] === p.target,
          )
        : question.correctOrder.every(
            (id, index) => (answer as string[])[index] === id,
          );
  const correctResponse: QuizAnswer =
    question.type === "bridge_builder"
      ? question.correctOptionId
      : question.type === "fraction_runner"
        ? question.correctLaneId
      : question.type === "pizza_catch"
        ? question.correctSliceId
      : question.type === "number_line_dash"
        ? question.correctPositionId
      : question.type === "fraction_cannon"
        ? question.correctTargetId
      : question.type === "recipe_builder"
        ? question.correctIngredientIds
      : question.type === "fraction_memory"
        ? question.correctPairs.map((ids) => [...ids].sort().join(":"))
      : question.type === "treasure_match"
        ? Object.fromEntries(question.pairs.map((p) => [p.source, p.target]))
        : question.correctOrder;
  return { correct, explanation: question.explanation, correctResponse };
}
export function gradeQuiz(ids: string[], answers: Record<string, QuizAnswer>) {
  const questions = ids
    .map(findQuestion)
    .filter((q): q is QuizQuestion => Boolean(q));
  const results = questions.map((question) => ({
    questionId: question.id,
    ...evaluateQuizAnswer(question, answers[question.id]),
  }));
  const correctCount = results.filter((r) => r.correct).length;
  const score = questions.length
    ? Math.round((correctCount / questions.length) * 100)
    : 0;
  return {
    correctCount,
    score,
    xp: 30 + correctCount * 10 + (score === 100 ? 20 : 0),
    results,
  };
}
