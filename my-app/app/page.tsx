"use client";

import { useRef, useState } from "react";

import Leftside from "./components/Leftside";
import Rightside from "./components/Rightside";
import Navbar from "./components/Navbar";
import PageHeading from "./components/PageHeading";
import ErrorAlert from "./components/ErrorAlert";
import Footer from "./components/Footer";
import SavedLibraryModal from "./components/SavedLibraryModal";

import useQuiz from "./hooks/useQuiz";
import useSavedLibrary from "./hooks/useSavedLibrary";

export default function Page() {
  const previewRef = useRef(null);
  const [error, setError] = useState("");

  const handlePreview = () => {
    previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const {
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
  } = useQuiz({ setError, onPreview: handlePreview });

  const {
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
  } = useSavedLibrary({ quiz, sessionId, quizSettings, answers, result, setError });

  const currentQuestion = quiz?.questions?.[currentIndex];

  const isCurrentQuestionSaved = Boolean(
    currentQuestion &&
      savedQuestions.some((item) => item.savedQuestionId === currentQuestion.id)
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar
        savedQuizzesCount={savedQuizzes.length}
        saved={saved}
        saveDisabled={!quiz || isGenerating || !storageReady}
        onPreview={handlePreview}
        onOpenLibrary={() => setShowSavedLibrary(true)}
        onSaveQuiz={handleSaveQuiz}
      />

      <main className="mx-auto w-full max-w-[1600px] px-3 py-4 sm:px-5 sm:py-5 lg:px-6">
        <PageHeading isGenerating={isGenerating} hasQuiz={Boolean(quiz)} />

        <ErrorAlert message={error} onDismiss={() => setError("")} />

        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(340px,0.88fr)_minmax(0,1.12fr)] xl:gap-5">
          <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <Leftside onGenerate={handleGenerate} isGenerating={isGenerating} />
          </section>

          <section
            ref={previewRef}
            className="min-w-0 scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
          >
            <Rightside
              quiz={quiz}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
              answers={answers}
              onAnswerChange={handleAnswerChange}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              result={result}
              onReset={handleResetQuiz}
              includeExplanations={quizSettings?.includeExplanations ?? true}
              isGenerating={isGenerating}
              onSaveQuestion={handleSaveQuestion}
              isQuestionSaved={isCurrentQuestionSaved}
            />
          </section>
        </div>

        <Footer />
      </main>

      {showSavedLibrary && (
        <SavedLibraryModal
          savedQuizzes={savedQuizzes}
          savedQuestions={savedQuestions}
          onClose={() => setShowSavedLibrary(false)}
          onDeleteQuiz={handleDeleteSavedQuiz}
          onDeleteQuestion={handleDeleteSavedQuestion}
        />
      )}
    </div>
  );
}