"use client";

import { useState } from "react";
import { generateQuizRequest, submitQuizRequest } from "../lib/quizApi";
import { shuffleArray } from "../lib/helper";

export default function useQuiz({ setError, onPreview }) {
  const [sessionId, setSessionId] = useState("");
  const [quiz, setQuiz] = useState(null);
  const [quizSettings, setQuizSettings] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGenerate = async (settings) => {
    setIsGenerating(true);
    setError("");

    try {
      const { sessionId, questions, requestSettings } =
        await generateQuizRequest(settings);

      const finalQuestions = requestSettings.shuffleQuestions
        ? shuffleArray(questions)
        : [...questions];

      setSessionId(sessionId);
      setQuiz({ questions: finalQuestions });
      setQuizSettings(requestSettings);
      setAnswers({});
      setCurrentIndex(0);
      setResult(null);

      setTimeout(onPreview, 100);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((previous) => ({ ...previous, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    if (!sessionId || !quiz || isSubmitting || result) return;

    setIsSubmitting(true);
    setError("");

    try {
      const quizResult = await submitQuizRequest(sessionId, answers);
      setResult(quizResult);
      setTimeout(onPreview, 100);
    } catch (err) {
      setError(err.message || "Could not submit your answers.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetQuiz = () => {
    setQuiz(null);
    setQuizSettings(null);
    setSessionId("");
    setAnswers({});
    setResult(null);
    setCurrentIndex(0);
    setError("");
  };

  return {
    sessionId,
    quiz,
    quizSettings,
    currentIndex,
    setCurrentIndex,
    answers,
    result,
    isGenerating,
    isSubmitting,
    handleGenerate,
    handleAnswerChange,
    handleSubmit,
    handleResetQuiz,
  };
}