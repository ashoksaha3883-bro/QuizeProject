const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const healthRoutes = require("./routes/healthRoutes");
const authRoutes = require("./routes/authRoutes");

const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const quizeRoutes = require('./routes/quizRoutes')

const rateLimit = require("express-rate-limit");

const {
  generateQuizQuestions,
} = require("./controller/questionController");

const questionRoutes = require("./routes/questionRoutes");
const router = express.Router();


const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));

// Parse cookies before protected routes.
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to QuizCraft API",
  });
});

app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizeRoutes)
app.use("/api/questions", questionRoutes);

// Keep these last.
app.use(notFound);
app.use(errorHandler);

module.exports = app;