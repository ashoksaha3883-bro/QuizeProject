import { X } from "lucide-react";

export default function ErrorAlert({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="mb-4 flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
    >
      <p className="min-w-0 break-words">{message}</p>
      <button
        type="button"
        aria-label="Dismiss error"
        onClick={onDismiss}
        className="shrink-0 rounded p-1 hover:bg-red-100"
      >
        <X size={16} />
      </button>
    </div>
  );
}