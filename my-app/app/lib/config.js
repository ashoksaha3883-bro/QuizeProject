export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "https://quizecraft-backend.onrender.com"
).replace(/\/$/, "");

export const STORAGE_KEYS = {
  questions: "quizcraft:savedQuestions",
  quizzes: "quizcraft:savedQuizzes",
};