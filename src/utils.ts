const calculateAvailableTokens = ({
  promptLength,
  maxModelTokens,
}: {
  promptLength: number;
  maxModelTokens: number;
}): number => {
  return maxModelTokens - promptLength;
};

const truncatePrompt = ({
  prompt,
  maxLength,
}: {
  prompt: string;
  maxLength: number;
}): string => {
  if (prompt.length > maxLength) {
    return prompt.slice(0, maxLength - 3) + "...";
  }
  return prompt;
};

const UTILS = {
  calculateAvailableTokens,
  truncatePrompt,
};

export default UTILS;
