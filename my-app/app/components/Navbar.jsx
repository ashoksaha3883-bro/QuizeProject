"use client";

import Image from "next/image";
import { Eye, Save, Sparkles, Check, BookOpen } from "lucide-react";
import logo from "../images/8e05c8550da4b2f94cf01f6013560204-removebg-preview.png";

export default function Navbar({
  savedQuizzesCount,
  saved,
  saveDisabled,
  onPreview,
  onOpenLibrary,
  onSaveQuiz,
}) {
  const outlineBtn =
    "inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 sm:gap-2 sm:px-3";

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[68px] max-w-[1600px] items-center justify-between gap-2 px-3 sm:gap-3 sm:px-6">
        {/* Logo + name */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-indigo-600 p-1.5 shadow-md shadow-indigo-200">
            <Image
              src={logo}
              alt="QuizCraft logo"
              width={50}
              height={50}
              className="h-full w-full object-contain"
              priority
            />
          </div>

          <div className="hidden min-w-0 min-[400px]:block">
            <h1 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
              QuizCraft
            </h1>
            <p className="hidden text-xs text-slate-500 sm:block">
              Build. Practice. Improve.
            </p>
          </div>
        </div>

        {/* Badge */}
        <div className="hidden items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 md:flex">
          <Sparkles size={15} className="text-indigo-600" />
          <span className="text-xs font-semibold text-indigo-700">Quiz Builder</span>
        </div>

        {/* Buttons */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onPreview}
            aria-label="Preview"
            className={outlineBtn}
          >
            <Eye size={17} />
            <span className="hidden sm:inline">Preview</span>
          </button>

          <button
            type="button"
            onClick={onOpenLibrary}
            aria-label="Saved quizzes"
            className={outlineBtn}
          >
            <BookOpen size={17} />
            <span className="hidden sm:inline">Saved Quizzes</span>
            <span>({savedQuizzesCount})</span>
          </button>

          <button
            type="button"
            onClick={onSaveQuiz}
            disabled={saveDisabled}
            aria-label="Save quiz"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-2.5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 sm:gap-2 sm:px-4"
          >
            {saved ? <Check size={17} /> : <Save size={17} />}
            <span className="hidden min-[400px]:inline">
              {saved ? "Saved" : "Save Quiz"}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}