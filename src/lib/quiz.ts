export type QuizQuestion = {
  id: string;
  prompt: string;
  options: { id: string; label: string }[];
  correctOptionId: string;
  explanation: string;
};

export type PublicQuizQuestion = Omit<
  QuizQuestion,
  "correctOptionId" | "explanation"
>;

export const addingFractionsQuiz: QuizQuestion[] = [
  {
    id: "af-q-01",
    prompt: "What is 2/7 + 3/7?",
    options: [
      { id: "a", label: "5/7" },
      { id: "b", label: "5/14" },
      { id: "c", label: "1/7" },
      { id: "d", label: "6/7" },
    ],
    correctOptionId: "a",
    explanation: "The denominators match, so add 2 + 3 and keep 7.",
  },
  {
    id: "af-q-02",
    prompt: "Which fraction is equivalent to 1/2?",
    options: [
      { id: "a", label: "1/4" },
      { id: "b", label: "2/4" },
      { id: "c", label: "3/4" },
      { id: "d", label: "2/3" },
    ],
    correctOptionId: "b",
    explanation:
      "Multiplying the numerator and denominator of 1/2 by 2 gives 2/4.",
  },
  {
    id: "af-q-03",
    prompt: "What is 1/2 + 1/4?",
    options: [
      { id: "a", label: "2/6" },
      { id: "b", label: "2/4" },
      { id: "c", label: "3/4" },
      { id: "d", label: "1/6" },
    ],
    correctOptionId: "c",
    explanation: "Rewrite 1/2 as 2/4, then add 2/4 + 1/4 = 3/4.",
  },
  {
    id: "af-q-04",
    prompt: "What is 3/8 + 2/8?",
    options: [
      { id: "a", label: "5/16" },
      { id: "b", label: "1/8" },
      { id: "c", label: "5/8" },
      { id: "d", label: "6/8" },
    ],
    correctOptionId: "c",
    explanation: "Add the numerators and keep the common denominator: 5/8.",
  },
  {
    id: "af-q-05",
    prompt: "Which common denominator works for 1/3 and 1/6?",
    options: [
      { id: "a", label: "3" },
      { id: "b", label: "6" },
      { id: "c", label: "9" },
      { id: "d", label: "12 only" },
    ],
    correctOptionId: "b",
    explanation: "Six is divisible by both 3 and 6.",
  },
  {
    id: "af-q-06",
    prompt: "What is 1/3 + 1/6?",
    options: [
      { id: "a", label: "2/9" },
      { id: "b", label: "2/6" },
      { id: "c", label: "1/2" },
      { id: "d", label: "1/9" },
    ],
    correctOptionId: "c",
    explanation: "Rewrite 1/3 as 2/6. Then 2/6 + 1/6 = 3/6 = 1/2.",
  },
  {
    id: "af-q-07",
    prompt: "Mia ate 1/4 of a pizza, then 2/4 more. How much did she eat?",
    options: [
      { id: "a", label: "2/8" },
      { id: "b", label: "3/4" },
      { id: "c", label: "3/8" },
      { id: "d", label: "1/2" },
    ],
    correctOptionId: "b",
    explanation:
      "The pieces are fourths, so add 1 + 2 and keep the denominator 4.",
  },
  {
    id: "af-q-08",
    prompt: "What is 2/5 + 1/10?",
    options: [
      { id: "a", label: "3/15" },
      { id: "b", label: "3/10" },
      { id: "c", label: "1/2" },
      { id: "d", label: "2/15" },
    ],
    correctOptionId: "c",
    explanation: "Rewrite 2/5 as 4/10. Then 4/10 + 1/10 = 5/10 = 1/2.",
  },
  {
    id: "af-q-09",
    prompt:
      "When adding fractions with the same denominator, what stays the same?",
    options: [
      { id: "a", label: "The numerator" },
      { id: "b", label: "The denominator" },
      { id: "c", label: "Both numbers" },
      { id: "d", label: "Neither number" },
    ],
    correctOptionId: "b",
    explanation: "Keep the common denominator and add the numerators.",
  },
  {
    id: "af-q-10",
    prompt: "Which sum equals one whole?",
    options: [
      { id: "a", label: "1/4 + 2/4" },
      { id: "b", label: "2/5 + 2/5" },
      { id: "c", label: "3/8 + 4/8" },
      { id: "d", label: "3/6 + 3/6" },
    ],
    correctOptionId: "d",
    explanation: "3/6 + 3/6 = 6/6, which is one whole.",
  },
];

export function selectQuizQuestions(count = 5, random = Math.random) {
  return [...addingFractionsQuiz]
    .map((question) => ({ question, order: random() }))
    .sort((a, b) => a.order - b.order)
    .slice(0, count)
    .map(({ question }) => question);
}

export function publicQuestion(question: QuizQuestion): PublicQuizQuestion {
  return {
    id: question.id,
    prompt: question.prompt,
    options: question.options,
  };
}

export function gradeQuiz(
  questionIds: string[],
  answers: Record<string, string>,
) {
  const questions = questionIds
    .map((id) => addingFractionsQuiz.find((question) => question.id === id))
    .filter((question): question is QuizQuestion => Boolean(question));
  const results = questions.map((question) => ({
    questionId: question.id,
    correct: answers[question.id] === question.correctOptionId,
    correctOptionId: question.correctOptionId,
    explanation: question.explanation,
  }));
  const correctCount = results.filter((result) => result.correct).length;
  const score = Math.round((correctCount / questions.length) * 100);
  const xp = 30 + correctCount * 10 + (score === 100 ? 20 : 0);
  return { correctCount, score, xp, results };
}
