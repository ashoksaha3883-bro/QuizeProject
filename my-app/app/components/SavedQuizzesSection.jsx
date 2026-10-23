import { BookOpen, Trash2 } from "lucide-react";
import { getOptionText, getQuestionText } from "../lib/helper";

export default function SavedQuizzesSection({ savedQuizzes, onDelete }) {
  return (
    <section>
      <h3 className="mb-3 text-base font-bold text-slate-900">
        Saved Quizzes ({savedQuizzes.length})
      </h3>

      {savedQuizzes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
          <BookOpen size={25} className="mx-auto text-slate-400" />
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
                <span className="break-words font-semibold text-slate-900">
                  {item.title}
                </span>
                <span className="mt-1 block text-xs text-slate-500">
                  {item.questions?.length || 0} questions
                  {" · "}
                  Saved {new Date(item.savedAt).toLocaleDateString()}
                </span>
              </summary>

              <div className="space-y-3 border-t border-slate-200 p-4">
                {(item.questions || []).map((question, index) => (
                  <article
                    key={question.id || index}
                    className="rounded-lg bg-slate-50 p-3"
                  >
                    <p className="break-words text-sm font-semibold text-slate-800">
                      {index + 1}. {getQuestionText(question)}
                    </p>

                    {question.options?.length > 0 && (
                      <ul className="mt-2 space-y-1 pl-4 text-sm text-slate-600">
                        {question.options.map((option, optionIndex) => (
                          <li
                            key={`${question.id}-${optionIndex}`}
                            className="list-disc break-words"
                          >
                            {getOptionText(option)}
                          </li>
                        ))}
                      </ul>
                    )}

                    {item.answers?.[question.id] !== undefined && (
                      <p className="mt-2 break-words text-sm text-indigo-700">
                        Your answer: {String(item.answers[question.id])}
                      </p>
                    )}
                  </article>
                ))}

                {item.result && (
                  <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-800">
                    Result: {item.result.percentage ?? 0}%
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => onDelete(item.id)}
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
  );
}