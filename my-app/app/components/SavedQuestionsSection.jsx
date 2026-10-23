import { Save, Trash2 } from "lucide-react";
import { getOptionText, getQuestionText } from "../lib/helper";

export default function SavedQuestionsSection({ savedQuestions, onDelete }) {
  return (
    <section>
      <h3 className="mb-3 text-base font-bold text-slate-900">
        Saved Questions ({savedQuestions.length})
      </h3>

      {savedQuestions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
          <Save size={25} className="mx-auto text-slate-400" />
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

                  <p className="mt-1 break-words text-sm font-semibold text-slate-900">
                    {getQuestionText(item.question)}
                  </p>

                  {item.question.options?.length > 0 && (
                    <ul className="mt-2 space-y-1 pl-4 text-sm text-slate-600">
                      {item.question.options.map((option, index) => (
                        <li
                          key={`${item.savedQuestionId}-${index}`}
                          className="list-disc break-words"
                        >
                          {getOptionText(option)}
                        </li>
                      ))}
                    </ul>
                  )}

                  {item.selectedAnswer !== "" && (
                    <p className="mt-2 break-words text-sm text-indigo-700">
                      Your answer: {item.selectedAnswer}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onDelete(item.savedQuestionId)}
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
  );
}