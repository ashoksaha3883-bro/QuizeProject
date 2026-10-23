"use client";

import { useState } from "react";
import {
  BookOpen,
  Check,
  Code2,
  Hash,
  ListChecks,
  MessageSquare,
  Sparkles,
  Clock,
  Settings2,
  Lightbulb,
  Shuffle,
  ChevronDown,
  RotateCcw,
} from "lucide-react";

const subjects = [
  { label: "HTML", category: "Frontend" },
  { label: "CSS", category: "Frontend" },
  { label: "Tailwind CSS", category: "Frontend" },
  { label: "JavaScript", category: "Frontend" },
  { label: "React.js", category: "Frontend" },
  { label: "Next.js", category: "Frontend" },
  { label: "Node.js", category: "Backend" },
  { label: "Express.js", category: "Backend" },
  { label: "MongoDB", category: "Database" },
  { label: "Full Stack Development", category: "Complete Stack" },
];

const questionTypes = [
  {
    label: "Multiple Choice",
    description: "Pick one answer",
    icon: BookOpen,
  },
  {
    label: "True / False",
    description: "Choose true or false",
    icon: Check,
  },
  {
    label: "Short Answer",
    description: "Write an answer",
    icon: MessageSquare,
  },
];

const difficulties = ["Easy", "Medium", "Hard"];

const initialSettings = {
  topic: "JavaScript",
  questionType: "Multiple Choice",
  questionCount: "5",
  difficulty: "Medium",
  optionCount: "4",
  timeLimit: "No timer",
  language: "English",
  includeExplanations: true,
  shuffleQuestions: false,
};

export default function Leftside({ onGenerate, isGenerating }) {
  const [settings, setSettings] = useState(initialSettings);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateSetting = (key, value) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const handleGenerate = () => {
    const quizSettings = {
      ...settings,
      questionCount: Number(settings.questionCount),
      optionCount: Number(settings.optionCount),
    };

    onGenerate(quizSettings);
  };

  const resetSettings = () => {
    setSettings(initialSettings);
    setShowAdvanced(false);
  };

  const selectClass =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  const selectedType = questionTypes.find(
    (type) => type.label === settings.questionType
  );

  return (
    <section className="h-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-200">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900">
              Create your quiz
            </h2>
            <p className="text-xs text-slate-500">
              Personalize your learning
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={resetSettings}
          className="flex items-center gap-1 rounded-lg px-2 py-2 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600"
        >
          <RotateCcw size={13} />
          Reset
        </button>
      </div>

      <div className="mb-4">
        <label
          htmlFor="quiz-topic"
          className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800"
        >
          <Code2 size={16} className="text-indigo-600" />
          Topic or subject
        </label>

        <select
          id="quiz-topic"
          value={settings.topic}
          onChange={(event) => updateSetting("topic", event.target.value)}
          className={selectClass}
        >
          {subjects.map((subject) => (
            <option key={subject.label} value={subject.label}>
              {subject.label} — {subject.category}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
          <ListChecks size={16} className="text-indigo-600" />
          Question type
        </h3>

        <div className="grid grid-cols-3 gap-2">
          {questionTypes.map((type) => {
            const Icon = type.icon;
            const selected = settings.questionType === type.label;

            return (
              <button
                key={type.label}
                type="button"
                aria-pressed={selected}
                onClick={() => updateSetting("questionType", type.label)}
                className={`relative flex min-h-[92px] flex-col items-center justify-center gap-2 rounded-xl border p-2 text-center transition ${
                  selected
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500"
                    : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:bg-slate-50"
                }`}
              >
                <Icon size={20} />
                <span className="text-xs font-semibold leading-4">
                  {type.label}
                </span>

                {selected && (
                  <span className="absolute right-1.5 top-1.5 text-indigo-600">
                    <Check size={13} />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <p className="mt-2 text-xs text-slate-400">
          {selectedType?.description}
        </p>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div>
          <label
            htmlFor="question-count"
            className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-800"
          >
            <Hash size={15} className="text-indigo-600" />
            Questions
          </label>

          <select
            id="question-count"
            value={settings.questionCount}
            onChange={(event) =>
              updateSetting("questionCount", event.target.value)
            }
            className={selectClass}
          >
            {[5, 10, 15, 20].map((count) => (
              <option key={count} value={String(count)}>
                {count} questions
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="difficulty"
            className="mb-2 block text-sm font-semibold text-slate-800"
          >
            Difficulty
          </label>

          <select
            id="difficulty"
            value={settings.difficulty}
            onChange={(event) =>
              updateSetting("difficulty", event.target.value)
            }
            className={selectClass}
          >
            {difficulties.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4 overflow-hidden rounded-xl border border-slate-200">
        <button
          type="button"
          onClick={() => setShowAdvanced((previous) => !previous)}
          aria-expanded={showAdvanced}
          className="flex w-full items-center justify-between gap-3 p-3 text-left transition hover:bg-slate-50"
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Settings2 size={17} className="text-indigo-600" />
            More settings
          </span>

          <ChevronDown
            size={17}
            className={`text-slate-500 transition-transform ${
              showAdvanced ? "rotate-180" : ""
            }`}
          />
        </button>

        {showAdvanced && (
          <div className="space-y-3 border-t border-slate-200 bg-slate-50/70 p-3">
            {settings.questionType === "Multiple Choice" && (
              <div>
                <label
                  htmlFor="option-count"
                  className="mb-1.5 block text-xs font-medium text-slate-700"
                >
                  Options per question
                </label>

                <select
                  id="option-count"
                  value={settings.optionCount}
                  onChange={(event) =>
                    updateSetting("optionCount", event.target.value)
                  }
                  className={selectClass}
                >
                  <option value="3">3 options</option>
                  <option value="4">4 options</option>
                  <option value="5">5 options</option>
                </select>
              </div>
            )}

            <div>
              <label
                htmlFor="time-limit"
                className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-700"
              >
                <Clock size={14} className="text-indigo-600" />
                Time limit
              </label>

              <select
                id="time-limit"
                value={settings.timeLimit}
                onChange={(event) =>
                  updateSetting("timeLimit", event.target.value)
                }
                className={selectClass}
              >
                {[
                  "No timer",
                  "5 minutes",
                  "10 minutes",
                  "15 minutes",
                  "20 minutes",
                  "30 minutes",
                ].map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="quiz-language"
                className="mb-1.5 block text-xs font-medium text-slate-700"
              >
                Quiz language
              </label>

              <select
                id="quiz-language"
                value={settings.language}
                onChange={(event) =>
                  updateSetting("language", event.target.value)
                }
                className={selectClass}
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Hinglish">Hinglish</option>
              </select>
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-700">
              <input
                type="checkbox"
                checked={settings.includeExplanations}
                onChange={(event) =>
                  updateSetting("includeExplanations", event.target.checked)
                }
                className="h-4 w-4 accent-indigo-600"
              />
              <Lightbulb size={15} className="text-indigo-600" />
              Show answer explanations
            </label>

            <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-700">
              <input
                type="checkbox"
                checked={settings.shuffleQuestions}
                onChange={(event) =>
                  updateSetting("shuffleQuestions", event.target.checked)
                }
                className="h-4 w-4 accent-indigo-600"
              />
              <Shuffle size={15} className="text-indigo-600" />
              Shuffle questions
            </label>
          </div>
        )}
      </div>

      <div className="mb-4 rounded-xl border border-indigo-100 bg-indigo-50/70 p-3">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles size={15} className="text-indigo-600" />
          <h3 className="text-sm font-semibold text-slate-800">Your quiz</h3>
        </div>

        <p className="text-sm font-medium text-indigo-700">
          {settings.topic} · {settings.questionCount} questions
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {settings.questionType} · {settings.difficulty} · {settings.language}
        </p>

        {settings.includeExplanations && (
          <p className="mt-1 text-xs text-slate-500">
            Answer explanations enabled
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={isGenerating}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Sparkles size={17} />
        {isGenerating ? "Generating quiz..." : "Generate Quiz"}
      </button>

      <p className="mt-2 text-center text-[11px] text-slate-400">
        {isGenerating
          ? "AI is preparing your questions. Please wait."
          : "Choose your settings and get ready to learn."}
      </p>
    </section>
  );
}