import { render, screen, waitFor } from "@testing-library/react";
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
  it("converts input to spoiler markdown in real time", async () => {
    const user = userEvent.setup();
    render(<SpoilerConverter />);

    const input = screen.getByPlaceholderText(/paste or type your text here/i);
    await user.clear(input);
    await user.type(input, "hi there");

    const output = screen.getByPlaceholderText(/converted spoiler markdown/i);
    await waitFor(() => expect(output).toHaveValue("||h||||i|| ||t||||h||||e||||r||||e||"));
  });

  it("updates conversion immediately when mode changes", async () => {
    const user = userEvent.setup();
    render(<SpoilerConverter />);

    const input = screen.getByPlaceholderText(/paste or type your text here/i);
    await user.clear(input);
    await user.type(input, "hi   there");

    const output = screen.getByPlaceholderText(/converted spoiler markdown/i);
    await waitFor(() => expect(output).toHaveValue("||h||||i||   ||t||||h||||e||||r||||e||"));

    await user.click(screen.getByLabelText(/word/i));
    await waitFor(() => expect(output).toHaveValue("||hi|| ||there||"));
  });

  it("copies output to clipboard without showing a success toast", async () => {
    const user = userEvent.setup();
    render(<SpoilerConverter />);

    const input = screen.getByPlaceholderText(/paste or type your text here/i);
    await user.clear(input);
    await user.type(input, "ab");

    const output = screen.getByPlaceholderText(/converted spoiler markdown/i);
    await waitFor(() => expect(output).toHaveValue("||a||||b||"));

    const copyButton = screen.getByRole("button", { name: /^copy$/i });
    await waitFor(() => expect(copyButton).toBeEnabled());

    const { writeText } = mockClipboard();
    await user.click(copyButton);

    await waitFor(() => expect(writeText).toHaveBeenCalledWith("||a||||b||"));
    expect(screen.queryByText(/copied to clipboard/i)).not.toBeInTheDocument();
  });

  it("renders discord preview and lets spoilers be revealed", async () => {
    const user = userEvent.setup();
    render(<SpoilerConverter />);

    const input = screen.getByPlaceholderText(/paste or type your text here/i);
    await user.clear(input);
    await user.type(input, "top secret");
    await user.click(screen.getByLabelText(/line/i));

    const spoiler = await screen.findByRole("button", { name: /reveal spoiler/i });
    expect(spoiler).toHaveTextContent("top secret");

    await user.click(spoiler);
    expect(screen.getByRole("button", { name: /hide spoiler/i })).toBeInTheDocument();
  });
});
