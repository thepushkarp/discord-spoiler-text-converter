import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import SpoilerConverter from "@/components/SpoilerConverter";

function mockClipboard() {
  const writeText = vi.fn<(text: string) => Promise<void>>(() => Promise.resolve());

  Object.defineProperty(navigator, "clipboard", {
    value: { writeText },
    configurable: true,
  });

  return { writeText };
}

describe("<SpoilerConverter />", () => {
  it("starts empty with labeled fields and disabled actions", () => {
    render(<SpoilerConverter />);
    expect(screen.getByRole("textbox", { name: "Your text" })).toHaveValue("");
    expect(screen.getByRole("textbox", { name: "Spoiler text" })).toHaveValue("");
    expect(screen.getByRole("button", { name: "Clear" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Copy" })).toBeDisabled();
    expect(screen.getByRole("group", { name: "Convert by" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Character" })).toBeChecked();
    expect(screen.getByRole("region", { name: "Discord preview" })).toHaveTextContent(
      "Your preview appears here.",
    );
  });

  it("clears input, output, and preview while keeping the selected mode", async () => {
    const user = userEvent.setup();
    render(<SpoilerConverter />);
    await user.type(screen.getByRole("textbox", { name: "Your text" }), "hello");
    await user.click(screen.getByRole("radio", { name: "Word" }));
    await user.click(screen.getByRole("button", { name: "Clear" }));
    expect(screen.getByRole("textbox", { name: "Your text" })).toHaveValue("");
    expect(screen.getByRole("textbox", { name: "Spoiler text" })).toHaveValue("");
    expect(screen.getByRole("button", { name: "Copy" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Clear" })).toBeDisabled();
    expect(screen.getByRole("radio", { name: "Word" })).toBeChecked();
    expect(screen.queryByRole("button", { name: /reveal spoiler/i })).not.toBeInTheDocument();
  });

  it("provides manual-copy guidance when clipboard writing fails", async () => {
    const user = userEvent.setup();
    render(<SpoilerConverter />);
    const input = screen.getByRole("textbox", { name: "Your text" });
    await user.type(input, "hello");
    const { writeText } = mockClipboard();
    writeText.mockRejectedValueOnce(new Error("Permission denied"));
    await user.click(screen.getByRole("button", { name: "Copy" }));
    expect(screen.getByRole("status")).toHaveTextContent(
      /select the spoiler text and copy manually/i,
    );
    expect(screen.getByRole("button", { name: "Copy" })).toBeEnabled();
    await user.type(input, "!");
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });

  it("copies all output with Ctrl+C only when no text is selected", async () => {
    const user = userEvent.setup();
    render(<SpoilerConverter />);
    await user.type(screen.getByRole("textbox", { name: "Your text" }), "ab");
    const output = screen.getByRole<HTMLTextAreaElement>("textbox", { name: "Spoiler text" });
    const { writeText } = mockClipboard();
    output.focus();
    output.setSelectionRange(0, 5);
    expect(fireEvent.keyDown(output, { key: "c", ctrlKey: true })).toBe(true);
    expect(writeText).not.toHaveBeenCalled();
    output.setSelectionRange(0, 0);
    expect(fireEvent.keyDown(output, { key: "c", ctrlKey: true })).toBe(false);
    await waitFor(() => expect(writeText).toHaveBeenCalledWith("||a||||b||"));
  });

  it("converts input to spoiler markdown in real time", async () => {
    const user = userEvent.setup();
    render(<SpoilerConverter />);

    const input = screen.getByRole("textbox", { name: "Your text" });
    await user.clear(input);
    await user.type(input, "hi there");

    const output = screen.getByRole("textbox", { name: "Spoiler text" });
    await waitFor(() => expect(output).toHaveValue("||h||||i|| ||t||||h||||e||||r||||e||"));
  });

  it("updates conversion immediately when mode changes", async () => {
    const user = userEvent.setup();
    render(<SpoilerConverter />);

    const input = screen.getByRole("textbox", { name: "Your text" });
    await user.clear(input);
    await user.type(input, "hi   there");

    const output = screen.getByRole("textbox", { name: "Spoiler text" });
    await waitFor(() => expect(output).toHaveValue("||h||||i||   ||t||||h||||e||||r||||e||"));

    await user.click(screen.getByLabelText(/word/i));
    await waitFor(() => expect(output).toHaveValue("||hi|| ||there||"));
  });

  it("copies output to clipboard without showing a success toast", async () => {
    const user = userEvent.setup();
    render(<SpoilerConverter />);

    const input = screen.getByRole("textbox", { name: "Your text" });
    await user.clear(input);
    await user.type(input, "ab");

    const output = screen.getByRole("textbox", { name: "Spoiler text" });
    await waitFor(() => expect(output).toHaveValue("||a||||b||"));

    const copyButton = screen.getByRole("button", { name: /^copy$/i });
    await waitFor(() => expect(copyButton).toBeEnabled());

    const { writeText } = mockClipboard();
    await user.click(copyButton);

    await waitFor(() => expect(writeText).toHaveBeenCalledWith("||a||||b||"));
    expect(screen.getByRole("button", { name: "Copied" })).toBeDisabled();
    expect(screen.getByRole("status")).toHaveTextContent("Copied");
    await waitFor(() => expect(screen.getByRole("button", { name: "Copy" })).toBeEnabled());
  });

  it("renders discord preview and lets spoilers be revealed", async () => {
    const user = userEvent.setup();
    render(<SpoilerConverter />);

    const input = screen.getByRole("textbox", { name: "Your text" });
    await user.clear(input);
    await user.type(input, "top secret");
    await user.click(screen.getByLabelText(/line/i));

    const spoiler = await screen.findByRole("button", { name: /reveal spoiler/i });
    expect(spoiler).toHaveTextContent("top secret");

    await user.click(spoiler);
    expect(screen.getByRole("button", { name: /hide spoiler/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await user.type(input, "!");
    expect(screen.getByRole("button", { name: /reveal spoiler/i })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    await user.click(screen.getByRole("button", { name: /reveal spoiler/i }));
    await user.click(screen.getByRole("radio", { name: "Word" }));
    expect(screen.queryByRole("button", { name: /hide spoiler/i })).not.toBeInTheDocument();
  });

  it("keeps spoiler preview in sync for pipe characters", async () => {
    const user = userEvent.setup();
    render(<SpoilerConverter />);

    const input = screen.getByRole("textbox", { name: "Your text" });
    await user.clear(input);
    await user.type(input, "|");

    const output = screen.getByRole("textbox", { name: "Spoiler text" });
    await waitFor(() => expect(output).toHaveValue("|||||"));

    const spoilers = await screen.findAllByRole("button", { name: /reveal spoiler/i });
    expect(spoilers).toHaveLength(1);
    const spoiler = spoilers[0];
    expect(spoiler).toBeDefined();
    if (spoiler == null) {
      throw new Error("Expected one spoiler button in preview");
    }

    await user.click(spoiler);
    expect(screen.getByRole("button", { name: /hide spoiler/i })).toHaveTextContent("|");
  });
});
