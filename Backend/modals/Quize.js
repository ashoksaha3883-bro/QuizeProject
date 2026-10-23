const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema(
    {
      questionText: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

        type: {
      type: String,
      enum: ["Multiple Choice", "True / False", "Short Answer"],
      required: true,
    },
    options: {
      type: [String],
      default: [],
    },
       correctAnswer: {
      type: String,
      required: true,
      trim: true,
    },

        explanation: {
      type: String,
      default: "",
      maxlength: 2000,
    },
    },
    {_id: true }
)

const quizeSchema = new mongoose.Schema(
    {
        userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    topic: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    questionType: {
      type: String,
      enum: ["Multiple Choice", "True / False", "Short Answer"],
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },

    questionCount: {
      type: Number,
      required: true,
      min: 1,
      max: 50,
    },

    settings: {
      optionCount: {
        type: Number,
        default: 4,
        min: 2,
        max: 6,
      },

      timeLimit: {
        type: String,
        default: "No timer",
      },

      language: {
        type: String,
        default: "English",
      },

      includeExplanations: {
        type: Boolean,
        default: true,
      },

      shuffleQuestions: {
        type: Boolean,
        default: false,
      },
    },

    questions: {
      type: [questionSchema],
      default: [],
    },
  },
  { timestamps: true }
    
)

quizeSchema.index({userId: 1, createAT: -1})

module.exports = mongoose.model("Quize", quizeSchema)