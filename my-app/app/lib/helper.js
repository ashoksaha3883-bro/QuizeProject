export function shuffleArray(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function getQuestionText(question) {
  return question?.questionText || question?.question || "Question";
}

export function getOptionText(option) {
  return typeof option === "string" ? option : option.text || option.label || "";
}