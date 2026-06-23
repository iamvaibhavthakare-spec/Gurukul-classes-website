import aboutTeaching from "@/assets/about-teaching.jpg";
import heroClassroom from "@/assets/hero-classroom.jpg";
import heroStudy from "@/assets/hero-study.jpg";
import heroStudents from "@/assets/hero-students.jpg";

export interface BlogPost {
  slug: string;
  detailPath: string;
  title: string;
  date: string;
  readTime: string;
  tag: string;
  excerpt: string;
  summary: string;
  image: string;
  alt: string;
  body: string[];
  highlights: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "study-routine-that-sticks",
    detailPath: "/blog/study-routine-that-sticks",
    title: "How to build a study routine that actually sticks",
    date: "June 2026",
    readTime: "4 min read",
    tag: "Study Routine",
    excerpt:
      "A practical routine for Class IX to XII students that keeps preparation steady without making every day feel overwhelming.",
    summary:
      "A good routine is not about studying for the longest hours. It is about repeating the right actions every day so revision, practice and rest all stay in balance.",
    image: heroStudy,
    alt: "Student studying with books and notes",
    body: [
      "At Gurukul, we see the strongest results when students work with a simple rhythm: one concept block, one practice block and one short revision block. That structure keeps attention fresh and makes it easier to finish the day with a clear sense of progress.",
      "The routine should also be realistic. A timetable that looks impressive on paper but fails after two days does more harm than good. We encourage students to choose fixed study hours, keep a short list of daily goals and review mistakes before sleep so the next day starts with clarity.",
    ],
    highlights: [
      "Keep one fixed study start time every day",
      "Finish each session with quick mistake review",
      "Reserve one block for practice questions",
      "Protect sleep so learning actually locks in",
    ],
  },
  {
    slug: "weekly-tests-matter",
    detailPath: "/blog/weekly-tests-matter",
    title: "Why weekly tests matter more than last-minute cramming",
    date: "June 2026",
    readTime: "5 min read",
    tag: "Exam Strategy",
    excerpt:
      "Weekly testing shows students where they stand, builds exam stamina and turns preparation into measurable improvement.",
    summary:
      "Last-minute reading can create the feeling of preparation, but regular tests reveal the real picture. They show which chapters are strong, which concepts are shaky and how a student performs under time pressure.",
    image: heroClassroom,
    alt: "Science classroom with students and teacher",
    body: [
      "Our classrooms use chapter tests and cumulative tests because repetition under pressure improves recall. Students begin to understand how much time to spend on each question, when to move on and how to return to difficult problems without panic.",
      "The other benefit is emotional. Once tests become a weekly habit, the exam feels familiar instead of frightening. Students also get regular feedback, which means correction happens early rather than after half the syllabus has drifted away.",
    ],
    highlights: [
      "Expose weak chapters before they become major gaps",
      "Train speed, accuracy and paper selection",
      "Reduce anxiety by making tests feel routine",
      "Turn every mistake into the next revision list",
    ],
  },
  {
    slug: "parent-support-without-pressure",
    detailPath: "/blog/parent-support-without-pressure",
    title: "How parents can support preparation without adding pressure",
    date: "June 2026",
    readTime: "4 min read",
    tag: "Parent Guide",
    excerpt:
      "The best support at home is calm consistency: a clear routine, steady encouragement and the confidence to let mentors guide the process.",
    summary:
      "Parents have a powerful role in exam preparation, but that role works best when it supports the system instead of replacing it. A student does better when home feels organised, calm and encouraging.",
    image: aboutTeaching,
    alt: "Teacher guiding students in a classroom",
    body: [
      "Instead of asking only about marks, we encourage families to ask about effort, revision and the next small target. Those questions reduce stress and keep the conversation focused on progress. A student who feels supported is more likely to ask for help early.",
      "Parents can also protect the basics that matter most: sleep, meals, attendance and a quiet place to study. When the home environment is stable, the student can use the coaching plan more effectively and the mentor-team updates become easier to act on.",
    ],
    highlights: [
      "Ask about progress, not only scores",
      "Keep the home routine calm and predictable",
      "Stay connected with the academic team",
      "Celebrate consistency as much as results",
    ],
  },
];
