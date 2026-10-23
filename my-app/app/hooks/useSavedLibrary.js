"use client";

import { useEffect, useState } from "react";
import { STORAGE_KEYS } from "../lib/config";

export default function useSavedLibrary({
  quiz,
  sessionId,
  quizSettings,
  answers,
  result,
  setError,
}) {
  const [saved, setSaved] = useState(false);
const [savedQuestions, setSavedQuestions] = useState(
  /** @type {{ savedQuestionId: string | number; question: any; topic?: string; questionType?: string; selectedAnswer?: any; savedAt: string }[]} */ ([])
);
  const [savedQuizzes, setSavedQuizzes] = useState([]);
  const [storageReady, setStorageReady] = useState(false);
  const [showSavedLibrary, setShowSavedLibrary] = useState(false);

  // Load saved data when the page opens.
  useEffect(() => {
    try {
      const questions = JSON.parse(localStorage.getItem(STORAGE_KEYS.questions) || "[]");
      const quizzes = JSON.parse(localStorage.getItem(STORAGE_KEYS.quizzes) || "[]");

      setSavedQuestions(Array.isArray(questions) ? questions : []);
      setSavedQuizzes(Array.isArray(quizzes) ? quizzes : []);
    } catch {
      setSavedQuestions([]);
      setSavedQuizzes([]);
    } finally {
      setStorageReady(true);
    }
  }, []);

  // Store saved items in this browser.
  useEffect(() => {
    if (!storageReady) return;

    try {
      localStorage.setItem(STORAGE_KEYS.questions, JSON.stringify(savedQuestions));
      localStorage.setItem(STORAGE_KEYS.quizzes, JSON.stringify(savedQuizzes));
    } catch {
      setError("Could not save data in this browser. Storage may be full.");
    }
  }, [savedQuestions, savedQuizzes, storageReady, setError]);

  const handleSaveQuestion = (question) => {
    if (!question?.id) {
      setError("This question cannot be saved because its ID is missing.");
      return;
    }

    const savedQuestion = {
      savedQuestionId: question.id,
      question,
      topic: quizSettings?.topic || "General",
      questionType: quizSettings?.questionType || question.type || "",
      selectedAnswer: answers[question.id] ?? "",
      savedAt: new Date().toISOString(),
    };

    setSavedQuestions((previous) => {
      const alreadySaved = previous.some(
        (item) => item.savedQuestionId === question.id
      );
      if (alreadySaved) return previous;
      return [savedQuestion, ...previous];
    });

    setError("");
  };

  const handleSaveQuiz = () => {
    if (!quiz?.questions?.length) {
      setError("Generate a quiz before clicking Save Quiz.");
      return;
    }

    const savedQuiz = {
      id: sessionId,
      sessionId,
      title: `${quizSettings?.topic || "My"} Quiz`,
      settings: quizSettings,
      questions: quiz.questions,
      answers,
      result,
      savedAt: new Date().toISOString(),
    };

    setSavedQuizzes((previous) => {
      const alreadySaved = previous.some((item) => item.sessionId === sessionId);

      if (alreadySaved) {
        return previous.map((item) =>
          item.sessionId === sessionId
            ? { ...savedQuiz, id: item.id, savedAt: item.savedAt }
            : item
        );
      }

      return [savedQuiz, ...previous];
    });

    setSaved(true);
    setError("");
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDeleteSavedQuestion = (questionId) => {
    setSavedQuestions((previous) =>
      previous.filter((item) => item.savedQuestionId !== questionId)
    );
  };

  const handleDeleteSavedQuiz = (quizId) => {
    setSavedQuizzes((previous) => previous.filter((item) => item.id !== quizId));
  };

  return {
    saved,
    savedQuestions,
    savedQuizzes,
    storageReady,
    showSavedLibrary,
    setShowSavedLibrary,
    handleSaveQuestion,
    handleSaveQuiz,
    handleDeleteSavedQuestion,
    handleDeleteSavedQuiz,
  };
}