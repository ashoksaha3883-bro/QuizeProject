import { API_URL } from "./config";

export async function generateQuizRequest(settings) {
  const requestSettings = {
    ...settings,
    questionCount: Number(settings.questionCount || 5),
    optionCount: Number(settings.optionCount || 4),
  };

  const response = await fetch(`${API_URL}/api/questions/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestSettings),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || data.error || "Could not generate the quiz. Please try again."
    );
  }

  const questions = data.quiz?.questions;

  if (!data.sessionId || !Array.isArray(questions) || questions.length === 0) {
    throw new Error("The server returned an invalid quiz response.");
  }

  return { sessionId: data.sessionId, questions, requestSettings };
}

export async function submitQuizRequest(sessionId, answers) {
  const response = await fetch(`${API_URL}/api/questions/${sessionId}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || "Could not submit the quiz.");
  }

  return data.result || data;
}