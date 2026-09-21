export type QuizAnswer = string | Record<string, string> | string[];

type BaseQuestion = { id: string; prompt: string; explanation: string };
export type MultipleChoiceQuestion = BaseQuestion & {
  type: "bridge_builder";
  options: { id: string; label: string }[];
  correctOptionId: string;
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
  MultipleChoiceQuestion | MatchPairsQuestion | OrderingQuestion;
export type PublicQuizQuestion =
  | Omit<MultipleChoiceQuestion, "correctOptionId" | "explanation">
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
export const addingFractionsQuiz: QuizQuestion[] = [
  choice(
    "af-q-01",
    "What is 2/7 + 3/7?",
    ["5/7", "5/14", "1/7", "6/7"],
    "a",
    "The denominators match, so add 2 + 3 and keep 7.",
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
export function findQuestion(id: string) {
  return addingFractionsQuiz.find((q) => q.id === id);
}
function shuffle<T>(items: T[], random: () => number) {
  return items
    .map((item) => ({ item, order: random() }))
    .sort((a, b) => a.order - b.order)
    .map(({ item }) => item);
}
export function selectQuizQuestions(count = 5, random = Math.random) {
  const required = ["bridge_builder", "treasure_match", "order_tower"] as const;
  const selected = required.map(
    (type) =>
      shuffle(
        addingFractionsQuiz.filter((q) => q.type === type),
        random,
      )[0],
  );
  return shuffle(
    [
      ...selected,
      ...shuffle(
        addingFractionsQuiz.filter((q) => !selected.includes(q)),
        random,
      ).slice(0, count - selected.length),
    ],
    random,
  ).slice(0, count);
}
export function publicQuestion(question: QuizQuestion): PublicQuizQuestion {
  if (question.type === "bridge_builder")
    return {
      id: question.id,
      type: question.type,
      prompt: question.prompt,
      options: question.options,
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
