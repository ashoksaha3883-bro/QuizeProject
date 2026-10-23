require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 6000;

const startServer = async () => {
  try {
    // Connect to the database first.
    await connectDB();

    // Start Express only after MongoDB connects.
    app.listen(PORT, () => {
      console.log(`QuizCraft API running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();