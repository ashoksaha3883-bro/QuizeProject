const { randomUUID } = require("crypto");
const asyncHandler = require("../utils/asyncHandler");
const {
  generateQuestions: askGemini,
} = require("../services/questionService");

const {
  createQuestionSession,
} = require("../utils/questionSessionStore");

const ALLOWED_DIFFICULTIES = ["Easy", "Medium", "Hard"];

const ALLOWED_TYPES = [
  "Multiple Choice",
  "True / False",
  "Short Answer",
];

function makeError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function normalizeQuestions(rawQuestions, settings) {
  if (
    !Array.isArray(rawQuestions) ||
    rawQuestions.length !== settings.questionCount
  ) {
    throw makeError(
      "The question provider returned an unexpected number of questions. Please try again.",
      502
    );
  }

  return rawQuestions.map((item) => {
    if (!item || typeof item !== "object") {
      throw makeError("The question provider returned invalid data.", 502);
    }

    const questionText =
      typeof item.questionText === "string"
        ? item.questionText.trim()
        : "";

    let correctAnswer =
      typeof item.correctAnswer === "string"
        ? item.correctAnswer.trim()
        : "";

    if (!questionText || questionText.length > 1000 || !correctAnswer) {
      throw makeError(
        "A generated question was missing required information. Please try again.",
        502
      );
    }

    let options = [];

    if (settings.questionType === "Multiple Choice") {
      if (!Array.isArray(item.options)) {
        throw makeError("The generated options were invalid. Please try again.", 502);
      }

      options = item.options
        .filter((option) => typeof option === "string")
        .map((option) => option.trim());

      if (
        options.length !== settings.optionCount ||
        options.some((option) => !option) ||
        new Set(options.map((option) => option.toLowerCase())).size !==
          settings.optionCount
      ) {
        throw makeError(
          "The generated options did not match your selected settings. Please try again.",
          502
        );
      }

      const matchingAnswer = options.find(
        (option) =>
          option.toLowerCase() === correctAnswer.toLowerCase()
      );

      if (!matchingAnswer) {
        throw makeError(
          "A generated answer did not match its options. Please try again.",
          502
        );
      }

      // Keep the answer exactly the same as the matching option.
      correctAnswer = matchingAnswer;
    }

    if (settings.questionType === "True / False") {
      const normalizedAnswer = correctAnswer.toLowerCase();

      if (!["true", "false"].includes(normalizedAnswer)) {
        throw makeError(
          "A generated True / False answer was invalid. Please try again.",
          502
        );
      }

      correctAnswer =
        normalizedAnswer === "true" ? "True" : "False";

      options = ["True", "False"];
    }

    const keyPoints = Array.isArray(item.keyPoints)
      ? item.keyPoints
          .filter((point) => typeof point === "string")
          .map((point) => point.trim())
          .filter(Boolean)
          .slice(0, 10)
      : [];

    return {
      id: randomUUID(),
      questionText,
      type: settings.questionType,
      options,
      correctAnswer,
      explanation:
        settings.includeExplanations &&
        typeof item.explanation === "string"
          ? item.explanation.slice(0, 2000)
          : "",
      keyPoints,
    };
  });
}

const generateQuizQuestions = asyncHandler(async (req, res) => {
  const body = req.body || {};

  const topic =
    typeof body.topic === "string" ? body.topic.trim() : "";

  const difficulty = body.difficulty;
  const questionType = body.questionType;
  const questionCount = Number(body.questionCount);

  const language =
    typeof body.language === "string" && body.language.trim()
      ? body.language.trim()
      : "English";

  const optionCount = Number(body.optionCount ?? 4);
  const includeExplanations = body.includeExplanations !== false;

  // Validate the user's settings before calling the external API.
  if (!topic || topic.length > 100) {
    throw makeError(
      "Topic is required and must be 100 characters or fewer.",
      400
    );
  }

  if (!ALLOWED_DIFFICULTIES.includes(difficulty)) {
    throw makeError("Select a valid difficulty.", 400);
  }

  if (!ALLOWED_TYPES.includes(questionType)) {
    throw makeError("Select a valid question type.", 400);
  }

  if (
    !Number.isInteger(questionCount) ||
    questionCount < 1 ||
    questionCount > 20
  ) {
    throw makeError("Question count must be between 1 and 20.", 400);
  }

  if (language.length > 30) {
    throw makeError("Language must be 30 characters or fewer.", 400);
  }

  if (
    questionType === "Multiple Choice" &&
    (!Number.isInteger(optionCount) || optionCount < 2 || optionCount > 6)
  ) {
    throw makeError("Choose between 2 and 6 options.", 400);
  }

  const settings = {
    topic,
    difficulty,
    questionType,
    questionCount,
    language,
    optionCount: questionType === "Multiple Choice" ? optionCount : 0,
    includeExplanations,
  };

  let rawQuestions;

  try {
    rawQuestions = await askGemini(settings);
  } catch (error) {
    // Do not send internal provider details or secrets to the browser.
    console.error(
      "Gemini request failed:",
      error.status || error.code || error.name || "unknown error"
    );

    const providerError = makeError(
      "Question generation is temporarily unavailable. Check your API key, model, or quota, then try again.",
      Number(error.status) === 429 || Number(error.code) === 429
        ? 429
        : 503
    );

    throw providerError;
  }

  const questions = normalizeQuestions(rawQuestions, settings);

  // Store correct answers only temporarily on the server.
  const sessionId = createQuestionSession(questions, settings);

  // Prevent browser and intermediary caching.
  res.set("Cache-Control", "no-store");

  // Never send correct answers, key points, or explanations yet.
  const publicQuestions = questions.map((question) => ({
    id: question.id,
    questionText: question.questionText,
    type: question.type,
    options: question.options,
  }));

  res.status(200).json({
    success: true,
    message: "Questions generated successfully.",
    sessionId,
    quiz: {
      topic,
      difficulty,
      questionType,
      questionCount,
      language,
      questions: publicQuestions,
    },
  });
});

module.exports = { generateQuizQuestions };