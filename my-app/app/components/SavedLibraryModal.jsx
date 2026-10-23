import { X } from "lucide-react";
import SavedQuizzesSection from "./SavedQuizzesSection";
import SavedQuestionsSection from "./SavedQuestionsSection";

export default function SavedLibraryModal({
  savedQuizzes,
  savedQuestions,
  onClose,
  onDeleteQuiz,
  onDeleteQuestion,
}) {
  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto bg-slate-900/50 p-2 backdrop-blur-sm sm:p-5"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="mx-auto my-2 max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl sm:my-5 sm:max-h-[90vh]">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-200 bg-white p-4 sm:p-5">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
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
            className="shrink-0 rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100"
          >
            <X size={19} />
          </button>
        </div>

        <div className="space-y-7 p-4 sm:p-5">
          <SavedQuizzesSection savedQuizzes={savedQuizzes} onDelete={onDeleteQuiz} />
          <SavedQuestionsSection
            savedQuestions={savedQuestions}
            onDelete={onDeleteQuestion}
          />
        </div>
      </div>
    </div>
  );
}