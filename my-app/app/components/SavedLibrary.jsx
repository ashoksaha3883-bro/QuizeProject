
"use client";

import { BookOpen, Save, Trash2, X } from "lucide-react";

export default function SavedLibrary({
  savedQuizzes,
  savedQuestions,
  onDeleteSavedQuiz,
  onDeleteSavedQuestion,
  onClose,
}) {
  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto bg-slate-900/50 p-3 backdrop-blur-sm sm:p-5"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="mx-auto my-5 max-h-[90vh] max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-200 bg-white p-4 sm:p-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Your saved library
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Find your saved quizzes and questions.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close saved library"
            className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100"
          >
            <X size={19} />
          </button>
        </div>

        <div className="space-y-7 p-4 sm:p-5">
          {/* Saved Quizzes */}
          <section>
            <h3 className="mb-3 text-base font-bold text-slate-900">
              Saved Quizzes ({savedQuizzes.length})
            </h3>

            {savedQuizzes.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
                <BookOpen
                  size={25}
                  className="mx-auto text-slate-400"
                />
                <p className="mt-2 text-sm font-semibold text-slate-700">
                  No saved quizzes yet
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Generate a quiz and click Save Quiz.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedQuizzes.map((item) => (
                  <details
                    key={item.id}
                    className="overflow-hidden rounded-xl border border-slate-200"
                  >
                    <summary className="cursor-pointer p-4 transition hover:bg-slate-50">
                      <span className="font-semibold text-slate-900">
                        {item.title}
                      </span>

                      <span className="mt-1 block text-xs text-slate-500">
                        {item.questions?.length || 0} questions
                        {" · "}
                        Saved{" "}
                        {new Date(item.savedAt).toLocaleDateString()}
                      </span>
                    </summary>

                    <div className="space-y-3 border-t border-slate-200 p-4">
                      {(item.questions || []).map(
                        (question, index) => (
                          <article
                            key={question.id || index}
                            className="rounded-lg bg-slate-50 p-3"
                          >
                            <p className="text-sm font-semibold text-slate-800">
                              {index + 1}.{" "}
                              {question.questionText ||
                                question.question ||
                                "Question"}
                            </p>

                            {question.options?.length > 0 && (
                              <ul className="mt-2 space-y-1 pl-4 text-sm text-slate-600">
                                {question.options.map(
                                  (option, optionIndex) => (
                                    <li
                                      key={`${question.id}-${optionIndex}`}
                                      className="list-disc"
                                    >
                                      {typeof option === "string"
                                        ? option
                                        : option.text ||
                                          option.label ||
                                          ""}
                                    </li>
                                  )
                                )}
                              </ul>
                            )}

                            {/* Previously selected answer */}
                            {item.answers?.[question.id] !== undefined && (
                              <p className="mt-2 text-sm text-indigo-700">
                                Your answer:{" "}
                                {String(item.answers[question.id])}
                              </p>
                            )}
                          </article>
                        )
                      )}

                      {/* Quiz result */}
                      {item.result && (
                        <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-800">
                          Result: {item.result.percentage ?? 0}%
                        </div>
                      )}

                      {/* Delete saved quiz */}
                      <button
                        type="button"
                        onClick={() => onDeleteSavedQuiz(item.id)}
                        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                        Delete saved quiz
                      </button>
                    </div>
                  </details>
                ))}
              </div>
            )}
          </section>

          {/* Saved Individual Questions */}
          <section>
            <h3 className="mb-3 text-base font-bold text-slate-900">
              Saved Questions ({savedQuestions.length})
            </h3>

            {savedQuestions.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
                <Save
                  size={25}
                  className="mx-auto text-slate-400"
                />
                <p className="mt-2 text-sm font-semibold text-slate-700">
                  No saved questions yet
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  During a quiz, click Save Question to save one.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedQuestions.map((item) => (
                  <article
                    key={item.savedQuestionId}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                          {item.topic}
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {item.question.questionText ||
                            item.question.question ||
                            "Question"}
                        </p>

                        {item.question.options?.length > 0 && (
                          <ul className="mt-2 space-y-1 pl-4 text-sm text-slate-600">
                            {item.question.options.map(
                              (option, index) => (
                                <li
                                  key={`${item.savedQuestionId}-${index}`}
                                  className="list-disc"
                                >
                                  {typeof option === "string"
                                    ? option
                                    : option.text ||
                                      option.label ||
                                      ""}
                                </li>
                              )
                            )}
                          </ul>
                        )}

                        {item.selectedAnswer !== "" && (
                          <p className="mt-2 text-sm text-indigo-700">
                            Your answer: {item.selectedAnswer}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          onDeleteSavedQuestion(item.savedQuestionId)
                        }
                        aria-label="Delete saved question"
                        className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
