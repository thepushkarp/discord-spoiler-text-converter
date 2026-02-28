import { describe, expect, it } from "vitest";

import {
  convertToDiscordSpoiler,
  wrapCharsWithBars,
  wrapTextWithBars,
  wrapWordsWithBars,
} from "@/lib/spoiler";

describe("wrapCharsWithBars", () => {
  it("returns empty string for empty or whitespace-only input", () => {
    expect(wrapCharsWithBars("")).toBe("");
    expect(wrapCharsWithBars("   \n\t")).toBe("");
  });

  it("wraps non-whitespace characters and preserves whitespace", () => {
    expect(wrapCharsWithBars(" a  b ")).toBe(" ||a||  ||b|| ");
  });

  it("preserves newlines", () => {
    expect(wrapCharsWithBars("a\nb")).toBe("||a||\n||b||");
  });

  it("handles surrogate-pair emoji as a single character", () => {
    expect(wrapCharsWithBars("a🫵b")).toBe("||a||||🫵||||b||");
  });
});

describe("wrapWordsWithBars", () => {
  it("wraps words and collapses whitespace within each line", () => {
    expect(wrapWordsWithBars("  hello   world  ")).toBe("||hello|| ||world||");
    expect(wrapWordsWithBars("hello   world\n  second\tline  ")).toBe(
      "||hello|| ||world||\n||second|| ||line||",
    );
  });
});

describe("wrapTextWithBars", () => {
  it("wraps each line and preserves blank lines", () => {
    expect(wrapTextWithBars("hello\nworld")).toBe("||hello||\n||world||");
    expect(wrapTextWithBars("a\n\nb")).toBe("||a||\n\n||b||");
  });
});

describe("convertToDiscordSpoiler", () => {
  it("dispatches based on mode", () => {
    expect(convertToDiscordSpoiler("a b", "char")).toBe("||a|| ||b||");
    expect(convertToDiscordSpoiler("a  b", "word")).toBe("||a|| ||b||");
    expect(convertToDiscordSpoiler("a\nb", "text")).toBe("||a||\n||b||");
  });
});
