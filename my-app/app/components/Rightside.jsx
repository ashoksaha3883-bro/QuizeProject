"use client";

import { Bookmark, BookmarkCheck, ChevronLeft, ChevronRight, Send } from "lucide-react";

export default function Rightside({
  quiz,
  currentIndex,
  setCurrentIndex,
  answers,
  onAnswerChange,
  onSubmit,
  isSubmitting,
  result,
  onReset,
  includeExplanations,
  isGenerating = false,
  onSaveQuestion,
  isQuestionSaved = false,
}) {
  // 1. Loading screen
  if (isGenerating) {
     return (
      <div className="flex min-h-[280px] flex-col items-center justify-center p-5 text-center sm:min-h-[400px] sm:p-8">
        <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />

        <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
          Creating your quiz...
        </h2>

        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
          Please wait while AI generates your questions.
        </p>
      </div>
    );
  }

  // Welcome screen
  if (!quiz) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center p-5 text-center sm:min-h-[400px] sm:p-8">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <Send size={25} />
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Your Quiz
        </h2>

        <p className="mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
          Select your quiz settings, then click Generate Quiz to get started.
          Your questions and answers will appear here.
        </p>
      </div>
    );
  }

  const questions = quiz.questions || [];
  const question = questions[currentIndex];

  // Results screen
  if (result) {
    return (
      <div className="min-w-0">
        <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-indigo-50 p-5 text-center sm:p-8">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm">
            <BookmarkCheck size={25} />
          </div>

          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
            Quiz Completed!
          </h2>

          <p className="mt-3 text-4xl font-extrabold tracking-tight text-indigo-700 sm:text-5xl">
            {result.percentage ?? 0}%
          </p>

          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Correct answers: {result.correctCount ?? 0}
          </p>
        </div>

        <div className="mt-5 space-y-3 sm:mt-6 sm:space-y-4">
          {(result.answers || []).map((item, index) => (
            <article
              key={item.id || index}
              className="min-w-0 rounded-xl border border-slate-200 p-3 sm:p-5"
            >
              <h3 className="break-words text-sm font-semibold leading-6 text-slate-900 sm:text-base">
                {index + 1}. {item.question || item.questionText}
              </h3>

              <p className="mt-3 break-words text-sm leading-6 text-slate-600">
                <span className="font-medium text-slate-700">
                  Your answer:
                </span>{" "}
                {String(item.userAnswer ?? "Not answered")}
              </p>

              <p className="mt-2 break-words text-sm leading-6 text-emerald-700">
                <span className="font-medium">Correct answer:</span>{" "}
                {String(item.correctAnswer ?? "Not provided")}
              </p>

              {includeExplanations && item.explanation && (
                <p className="mt-3 break-words rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-600">
                  <span className="font-medium text-slate-800">
                    Explanation:
                  </span>{" "}
                  {item.explanation}
                </p>
              )}
            </article>
          ))}
        </div>

        <button
          type="button"
          onClick={onReset}
          className="mt-5 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-6 sm:text-base"
        >
          Create Another Quiz
        </button>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="rounded-xl border border-slate-200 p-5 text-sm text-slate-500">
        No questions available.
      </div>
    );
  }

  const questionText = question.questionText || question.question || "";
  const options = question.options || [];
  const currentAnswer = answers[question.id] ?? "";

  const progress =
    questions.length > 0
      ? ((currentIndex + 1) / questions.length) * 100
      : 0;

  return (
    <div className="min-w-0">
      {/* Header */}
      <div className="mb-4 flex min-w-0 flex-wrap items-center justify-between gap-2 sm:mb-5">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            Practice mode
          </p>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Your Quiz
          </h2>
        </div>

        <span className="shrink-0 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 sm:text-sm">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      {/* Progress */}
      <div
        className="mb-4 h-2 overflow-hidden rounded-full bg-slate-100 sm:mb-5"
        role="progressbar"
        aria-label="Quiz progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
      >
        <div
          className="h-full rounded-full bg-indigo-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question navigation */}
      <div className="mb-5 rounded-xl bg-slate-50 p-3 sm:p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-xs font-semibold text-slate-700 sm:text-sm">
            Questions
          </p>
          <p className="text-xs text-slate-500">
            Tap to jump
          </p>
        </div>

        <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-6 xl:grid-cols-8">
          {questions.map((item, index) => {
            const answered =
              answers[item.id] !== undefined &&
              answers[item.id] !== "";

            const active = index === currentIndex;

            return (
              <button
                key={item.id || index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to question ${index + 1}`}
                aria-current={active ? "step" : undefined}
                className={`flex min-h-10 min-w-0 items-center justify-center rounded-lg border text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 ${
                  active
                    ? "border-indigo-600 bg-indigo-600 text-white shadow-sm"
                    : answered
                      ? "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                      : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:bg-indigo-50"
                }`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>

        <p className="mt-3 text-xs text-slate-500">
          {questions.filter(
            (item) =>
              answers[item.id] !== undefined && answers[item.id] !== ""
          ).length}{" "}
          of {questions.length} answered
        </p>
      </div>

      {/* Question */}
      <div className="min-w-0">
        <h3 className="break-words text-base font-semibold leading-7 text-slate-900 sm:text-lg sm:leading-8">
          {questionText}
        </h3>

        {/* Multiple choice / True-False */}
        {options.length > 0 ? (
          <div className="mt-4 space-y-2.5 sm:mt-5 sm:space-y-3">
            {options.map((option, index) => {
              const optionText =
                typeof option === "string"
                  ? option
                  : option.text ||
                    option.label ||
                    String(option.value ?? "");

              const selected = currentAnswer === optionText;

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() =>
                    onAnswerChange(question.id, optionText)
                  }
                  aria-pressed={selected}
                  className={`flex min-h-12 w-full min-w-0 items-start gap-3 rounded-xl border p-3 text-left text-sm leading-6 transition focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 sm:p-4 sm:text-base ${
                    selected
                      ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-200"
                      : "border-slate-200 bg-white hover:border-indigo-200 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                      selected
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>

                  <span className="min-w-0 flex-1 break-words">
                    {optionText}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          /* Short answer */
          <div className="mt-4 sm:mt-5">
            <label
              htmlFor={`answer-${question.id}`}
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Your answer
            </label>

            <textarea
              id={`answer-${question.id}`}
              value={currentAnswer}
              onChange={(event) =>
                onAnswerChange(question.id, event.target.value)
              }
              placeholder="Write your answer here..."
              className="min-h-32 w-full resize-y rounded-xl border border-slate-200 bg-white p-3 text-base leading-6 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:p-4"
              rows={4}
            />
          </div>
        )}
      </div>

      {/* Save question */}
      <button
        type="button"
        onClick={() => onSaveQuestion?.(question)}
        disabled={isQuestionSaved || !onSaveQuestion}
        className="mt-4 inline-flex min-h-10 max-w-full items-center justify-center gap-2 rounded-xl border border-indigo-200 px-3 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50 sm:mt-5 sm:px-4"
      >
        {isQuestionSaved ? (
          <BookmarkCheck size={17} />
        ) : (
          <Bookmark size={17} />
        )}
        <span>
          {isQuestionSaved ? "Question Saved" : "Save Question"}
        </span>
      </button>

      {/* Previous / Next / Submit */}
      <div className="mt-5 flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:mt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:pt-5">
        <button
          type="button"
          onClick={() =>
            setCurrentIndex((index) => Math.max(0, index - 1))
          }
          disabled={currentIndex === 0}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:min-w-32"
        >
          <ChevronLeft size={17} />
          Previous
        </button>

        {currentIndex < questions.length - 1 ? (
          <button
            type="button"
            onClick={() =>
              setCurrentIndex((index) =>
                Math.min(questions.length - 1, index + 1)
              )
            }
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto sm:min-w-32"
          >
            Next
            <ChevronRight size={17} />
          </button>
        ) : (
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-36"
          >
            <Send size={16} />
            {isSubmitting ? "Submitting..." : "Submit Quiz"}
          </button>
        )}
      </div>
    </div>
  );
}