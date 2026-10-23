const asyncHandler = require("../utils/asyncHandler");

const {
  getQuestionSession,
  saveQuestionSessionResult,
} = require("../utils/questionSessionStore");

const {
  gradeShortAnswers,
} = require("../services/questionService");

function makeError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function normalize(value) {
  return value.trim().toLowerCase();
}

const submitQuizAnswers = asyncHandler(async (req, res) => {
  res.set("Cache-Control", "no-store");

  const { sessionId } = req.params;
  const session = getQuestionSession(sessionId);

  if (!session) {
    throw makeError(
      "This quiz session has expired. Please generate a new quiz.",
      404
    );
  }

  // Return the already calculated result instead of grading twice.
  if (session.submittedResult) {
    return res.status(200).json({
      success: true,
      result: session.submittedResult,
    });
  }

  const answers = req.body?.answers;

  if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
    throw makeError("Send your answers as an object.", 400);
  }

  const questions = session.questions;
  const questionIds = new Set(questions.map((question) => question.id));

  // Reject answers for questions that do not belong to this quiz.
  for (const id of Object.keys(answers)) {
    if (!questionIds.has(id)) {
      throw makeError("The submitted answers contain an invalid question ID.", 400);
    }
  }

  const preparedAnswers = questions.map((question) => {
    const rawAnswer = answers[question.id] ?? "";

    if (typeof rawAnswer !== "string") {
      throw makeError("Each answer must be text.", 400);
    }

    const userAnswer = rawAnswer.trim();

    if (userAnswer.length > 5000) {
      throw makeError("An answer cannot exceed 5000 characters.", 400);
    }

    if (
      question.type !== "Multiple Choice" &&
      question.type !== "True / False" &&
      question.type !== "Short Answer"
    ) {
      throw makeError("A question has an unsupported type.", 502);
    }

    let checkedAnswer = userAnswer;

    if (
      userAnswer &&
      (question.type === "Multiple Choice" ||
        question.type === "True / False")
    ) {
      const matchedOption = question.options.find(
        (option) => normalize(option) === normalize(userAnswer)
      );

      if (!matchedOption) {
        throw makeError(
          "One of your selected options is invalid. Please check your answers.",
          400
        );
      }

      checkedAnswer = matchedOption;
    }

    return {
      question,
      userAnswer: checkedAnswer,
    };
  });

  // Only short answers need AI evaluation.
  const shortAnswerItems = preparedAnswers
    .filter(
      ({ question, userAnswer }) =>
        question.type === "Short Answer" && userAnswer
    )
    .map(({ question, userAnswer }) => ({
      id: question.id,
      questionText: question.questionText,
      correctAnswer: question.correctAnswer,
      keyPoints: question.keyPoints || [],
      userAnswer,
    }));

  let grades = [];

  if (shortAnswerItems.length > 0) {
    try {
      grades = await gradeShortAnswers(shortAnswerItems);
    } catch (error) {
      console.error(
        "Short-answer grading failed:",
        error.status || error.code || error.name || "unknown error"
      );

      const isQuotaError =
        Number(error.status) === 429 || Number(error.code) === 429;

      throw makeError(
        isQuotaError
          ? "The AI grading quota has been reached. Please try again later."
          : "Short-answer grading is temporarily unavailable. Please try submitting again.",
        isQuotaError ? 429 : 503
      );
    }
  }

  const gradeMap = new Map(grades.map((grade) => [grade.id, grade]));

  const gradedAnswers = preparedAnswers.map(({ question, userAnswer }) => {
    let pointsEarned = 0;
    let isCorrect = false;
    let feedback = "";

    if (question.type === "Short Answer") {
      if (!userAnswer) {
        feedback = "No answer submitted.";
      } else {
        const grade = gradeMap.get(question.id);

        if (!grade) {
          throw makeError(
            "The grading service did not return every result. Please try again.",
            502
          );
        }

        pointsEarned = Number(grade.score.toFixed(2));
        isCorrect = pointsEarned >= 0.7;
        feedback =
          typeof grade.feedback === "string"
            ? grade.feedback.slice(0, 500)
            : "Your answer has been evaluated.";
      }
    } else {
      isCorrect =
        userAnswer !== "" &&
        normalize(userAnswer) === normalize(question.correctAnswer);

      pointsEarned = isCorrect ? 1 : 0;
      feedback = userAnswer
        ? isCorrect
          ? "Correct answer!"
          : "Not quite. Review the correct answer and explanation."
        : "No answer submitted.";
    }

    return {
      id: question.id,
      questionText: question.questionText,
      type: question.type,
      options: question.options,
      userAnswer,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      isCorrect,
      pointsEarned,
      feedback,
    };
  });

  const totalPoints = Number(
    gradedAnswers
      .reduce((total, answer) => total + answer.pointsEarned, 0)
      .toFixed(2)
  );

  const possiblePoints = questions.length;

  const result = {
    totalQuestions: questions.length,
    pointsEarned: totalPoints,
    possiblePoints,
    percentage: Math.round((totalPoints / possiblePoints) * 100),
    correctCount: gradedAnswers.filter((answer) => answer.isCorrect).length,
    answers: gradedAnswers,
  };

  saveQuestionSessionResult(sessionId, result);

  return res.status(200).json({
    success: true,
    result,
  });
});

module.exports = { submitQuizAnswers };