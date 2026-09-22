export const subjects = [
  {
    name: "Mathematics",
    slug: "mathematics",
    description: "Build problem-solving skills for real life.",
    theme: "bg-[#fff7dc] text-[#e88900]",
    icon: "calculator",
    available: true,
  },
  {
    name: "Science",
    slug: "science",
    description: "Discover the world around you.",
    theme: "bg-[#e8faee] text-[#12a65a]",
    icon: "flask",
    available: false,
  },
  {
    name: "English",
    slug: "english",
    description: "Read, write, and express your ideas.",
    theme: "bg-[#f2eaff] text-[#7c42df]",
    icon: "book",
    available: false,
  },
  {
    name: "Filipino",
    slug: "filipino",
    description: "Pagyamanin ang ating wika.",
    theme: "bg-[#fff0df] text-[#df7013]",
    icon: "languages",
    available: false,
  },
  {
    name: "Araling Panlipunan",
    slug: "araling-panlipunan",
    description: "Kilalanin ang ating bansa at ang mundo.",
    theme: "bg-[#e6f6ff] text-[#1672d8]",
    icon: "globe",
    available: false,
  },
  {
    name: "EPP / TLE",
    slug: "epp-tle",
    description: "Develop practical skills for everyday life.",
    theme: "bg-[#ffebed] text-[#db5262]",
    icon: "utensils",
    available: false,
  },
  {
    name: "MAPEH",
    slug: "mapeh",
    description: "Move, create, and become your best self.",
    theme: "bg-[#e4fbfa] text-[#009b95]",
    icon: "palette",
    available: false,
  },
  {
    name: "GMRC / Values Education",
    slug: "gmrc-values",
    description: "Be kind. Be responsible. Make a difference.",
    theme: "bg-[#f6e9ff] text-[#983de0]",
    icon: "heart",
    available: false,
  },
] as const;

export const mathUnits = [
  {
    title: "Numbers and Number Sense",
    description: "Place value, whole numbers, fractions, and decimals",
    lessonCount: null,
    current: false,
  },
  {
    title: "Operations",
    description: "Addition, subtraction, multiplication, and division",
    lessonCount: null,
    current: false,
  },
  {
    title: "Measurement",
    description: "Length, mass, volume, time, and area",
    lessonCount: null,
    current: false,
  },
  {
    title: "Fractions",
    description: "Equivalent fractions and fraction operations",
    lessonCount: 1,
    current: true,
  },
  {
    title: "Geometry",
    description: "Shapes, angles, and lines",
    lessonCount: null,
    current: false,
  },
  {
    title: "Data and Probability",
    description: "Gathering, organizing, and interpreting data",
    lessonCount: null,
    current: false,
  },
] as const;

export const addingFractionsLesson = {
  title: "Adding Fractions",
  slug: "adding-fractions",
  subject: "Mathematics",
  subjectSlug: "mathematics",
  grade: "Grade 5",
  quarter: "Quarter 1",
  unit: "Unit 4: Fractions",
  estimatedMinutes: 25,
  summary:
    "Learn to add fractions with like and unlike denominators using visual models, equivalent fractions, and common denominators.",
  competencies: [
    "Identify the numerator and denominator of a fraction.",
    "Recognize and generate simple equivalent fractions.",
    "Add fractions with the same denominator.",
    "Add fractions with different denominators by using a common denominator.",
    "Solve simple real-life problems involving addition of fractions.",
  ],
} as const;

export const lessons = [addingFractionsLesson] as const;

export function getSubject(slug: string) {
  return subjects.find((subject) => subject.slug === slug);
}

export function getLesson(slug: string) {
  return lessons.find((lesson) => lesson.slug === slug);
}
