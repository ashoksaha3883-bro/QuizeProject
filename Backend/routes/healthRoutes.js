const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/health", (req, res) => {
  const isDatabaseConnected =
    mongoose.connection.readyState === 1;

  return res.status(isDatabaseConnected ? 200 : 503).json({
    success: isDatabaseConnected,
    message: "QuizCraft API health check",
    server: "running",
    database: isDatabaseConnected
      ? "connected"
      : "disconnected",
  });
});

module.exports = router;