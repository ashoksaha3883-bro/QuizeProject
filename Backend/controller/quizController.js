const mongoose = require("mongoose");
const Quiz = require("../modals/Quize");
const asyncHandler = require("../utils/asyncHandler");

const questionTypes = [
  "Multiple Choice",
  "True / False",
  "Short Answer",
];

const difficulties = ["Easy", "Medium", "Hard"];

const validateQuizInput = (data, isUpdate = false) => {
  const errors = [];

  if (!isUpdate || data.title !== undefined) {
    if (
      typeof data.title !== "string" ||
      !data.title.trim() ||
      data.title.trim().length > 120
    ) {
      errors.push("Title is required and must be at most 120 characters.");
    }
  }

  if (!isUpdate || data.topic !== undefined) {
    if (
      typeof data.topic !== "string" ||
      !data.topic.trim() ||
      data.topic.trim().length > 100
    ) {
      errors.push("Topic is required and must be at most 100 characters.");
    }
  }

  if (!isUpdate || data.questionType !== undefined) {
    if (!questionTypes.includes(data.questionType)) {
      errors.push("Invalid question type.");
    }
  }

  if (!isUpdate || data.difficulty !== undefined) {
    if (
      data.difficulty !== undefined &&
      !difficulties.includes(data.difficulty)
    ) {
      errors.push("Difficulty must be Easy, Medium or Hard.");
    }
  }

  if (!isUpdate || data.questionCount !== undefined) {
    if (
      !Number.isInteger(data.questionCount) ||
      data.questionCount < 1 ||
      data.questionCount > 50
    ) {
      errors.push("Question count must be an integer between 1 and 50.");
    }
  }

  if (data.questions !== undefined) {
    if (!Array.isArray(data.questions) || data.questions.length > 50) {
      errors.push("Questions must be an array with at most 50 items.");
    } else {
      for (const question of data.questions) {
        if (
          !question ||
          typeof question.questionText !== "string" ||
          !question.questionText.trim() ||
          !questionTypes.includes(question.type) ||
          typeof question.correctAnswer !== "string" ||
          !question.correctAnswer.trim()
        ) {
          errors.push(
            "Each question needs questionText, a valid type and correctAnswer."
          );
          break;
        }

        if (
          question.type === "Multiple Choice" &&
          (
            !Array.isArray(question.options) ||
            question.options.length < 2 ||
            question.options.length > 6 ||
            question.options.some(
              (option) => typeof option !== "string" || !option.trim()
            ) ||
            !question.options.includes(question.correctAnswer)
          )
        ) {
          errors.push(
            "Multiple-choice questions need 2–6 options and a correct answer matching one option."
          );
          break;
        }

        if (
          question.type === "True / False" &&
          !["True", "False"].includes(question.correctAnswer)
        ) {
          errors.push(
            "True / False answers must be True or False."
          );
          break;
        }
      }
    }
  }

  return errors;
};

const createQuiz = asyncHandler(async (req, res) => {
  const errors = validateQuizInput(req.body);

  if (errors.length) {
    return res.status(400).json({
      success: false,
      message: "Please correct the quiz data.",
      errors,
    });
  }

  const quiz = await Quiz.create({
    userId: req.user._id,
    title: req.body.title.trim(),
    topic: req.body.topic.trim(),
    questionType: req.body.questionType,
    difficulty: req.body.difficulty || "Medium",
    questionCount: req.body.questionCount,
    settings: req.body.settings || {},
    questions: req.body.questions || [],
  });

  return res.status(201).json({
    success: true,
    message: "Quiz created successfully.",
    quiz,
  });
});

const getQuizzes = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(
    50,
    Math.max(1, Number.parseInt(req.query.limit, 10) || 10)
  );

  const filter = { userId: req.user._id };

  const [quizzes, total] = await Promise.all([
    Quiz.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),

    Quiz.countDocuments(filter),
  ]);

  return res.status(200).json({
    success: true,
    quizzes,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

const getQuizById = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid quiz ID.",
    });
  }

  const quiz = await Quiz.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!quiz) {
    return res.status(404).json({
      success: false,
      message: "Quiz not found.",
    });
  }

  return res.status(200).json({
    success: true,
    quiz,
  });
});

const updateQuiz = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid quiz ID.",
    });
  }

  const allowedFields = [
    "title",
    "topic",
    "questionType",
    "difficulty",
    "questionCount",
    "settings",
    "questions",
  ];

  const updates = {};

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Provide at least one field to update.",
    });
  }

  const errors = validateQuizInput(updates, true);

  if (errors.length) {
    return res.status(400).json({
      success: false,
      message: "Please correct the quiz data.",
      errors,
    });
  }

  if (updates.title !== undefined) {
    updates.title = updates.title.trim();
  }

  if (updates.topic !== undefined) {
    updates.topic = updates.topic.trim();
  }

  const quiz = await Quiz.findOneAndUpdate(
    {
      _id: req.params.id,
      userId: req.user._id,
    },
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!quiz) {
    return res.status(404).json({
      success: false,
      message: "Quiz not found.",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Quiz updated successfully.",
    quiz,
  });
});

const deleteQuiz = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid quiz ID.",
    });
  }

  const quiz = await Quiz.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!quiz) {
    return res.status(404).json({
      success: false,
      message: "Quiz not found.",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Quiz deleted successfully.",
  });
});

module.exports = {
  createQuiz,
  getQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
};