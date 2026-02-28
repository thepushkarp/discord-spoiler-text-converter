export type WrapMode = "char" | "word" | "text";

function normalizeNewlines(input: string): string {
  return input.replace(/\r\n?/gu, "\n");
}

function isWhitespace(char: string): boolean {
  return /\s/gu.test(char);
}

export function wrapCharsWithBars(input: string): string {
  const normalized = normalizeNewlines(input);
  if (normalized.trim() === "") {
    return "";
  }

  return [...normalized].map((char) => (isWhitespace(char) ? char : `||${char}||`)).join("");
}

export function wrapWordsWithBars(input: string): string {
  const normalized = normalizeNewlines(input);
  if (normalized.trim() === "") {
    return "";
  }

  return normalized
    .split("\n")
    .map((line) => {
      const collapsed = line.trim().replace(/\s+/gu, " ");
      if (collapsed === "") {
        return "";
      }
      return collapsed
        .split(" ")
        .map((word) => `||${word}||`)
        .join(" ");
    })
    .join("\n");
}

export function wrapTextWithBars(input: string): string {
  const normalized = normalizeNewlines(input);
  if (normalized.trim() === "") {
    return "";
  }

  return normalized
    .split("\n")
    .map((line) => (line.trim() === "" ? line : `||${line}||`))
    .join("\n");
}

export function convertToDiscordSpoiler(input: string, mode: WrapMode): string {
  switch (mode) {
    case "char":
      return wrapCharsWithBars(input);
    case "word":
      return wrapWordsWithBars(input);
    case "text":
      return wrapTextWithBars(input);
    default: {
      // Exhaustive check for future changes.
      const _exhaustive: never = mode;
      return _exhaustive;
    }
  }
}
