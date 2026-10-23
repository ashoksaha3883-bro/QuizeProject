const express = require("express");
const rateLimit = require("express-rate-limit");

const {
  generateQuizQuestions,
} = require("../controller/questionController");

const {
  submitQuizAnswers,
} = require("../controller/submitQuestionController");

const router = express.Router();

const generateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many generation requests. Please try again later.",
  },
});

const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: process.env.NODE_ENV === "production" ? 20 : 1000,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many submissions. Please try again later.",
  },
});

router.post("/generate", generateLimiter, generateQuizQuestions);

router.post(
  "/:sessionId/submit",
  submitLimiter,
  submitQuizAnswers
);

module.exports = router;