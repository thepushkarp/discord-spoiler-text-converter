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
  it("converts input to spoiler markdown", async () => {
    const user = userEvent.setup();
    render(<SpoilerConverter />);

    const input = screen.getByPlaceholderText(/paste or type your text here/i);
    await user.clear(input);
    await user.type(input, "hi there");

    await user.click(screen.getByRole("button", { name: /convert/i }));

    const output = screen.getByPlaceholderText(/converted spoiler markdown/i);
    expect(output).toHaveValue("||h||||i|| ||t||||h||||e||||r||||e||");
  });

  it("converts on Ctrl+Enter", async () => {
    const user = userEvent.setup();
    render(<SpoilerConverter />);

    const input = screen.getByPlaceholderText(/paste or type your text here/i);
    await user.clear(input);
    await user.type(input, "ok");

    fireEvent.keyDown(input, { key: "Enter", ctrlKey: true });

    const output = screen.getByPlaceholderText(/converted spoiler markdown/i);
    expect(output).toHaveValue("||o||||k||");
  });

  it("copies output to clipboard and shows feedback", async () => {
    const user = userEvent.setup();
    render(<SpoilerConverter />);

    const input = screen.getByPlaceholderText(/paste or type your text here/i);
    await user.clear(input);
    await user.type(input, "ab");

    await user.click(screen.getByRole("button", { name: /convert/i }));

    const output = screen.getByPlaceholderText(/converted spoiler markdown/i);
    await waitFor(() => expect(output).toHaveValue("||a||||b||"));

    const copyButton = screen.getByRole("button", { name: /^copy$/i });
    await waitFor(() => expect(copyButton).toBeEnabled());

    const { writeText } = mockClipboard();
    await user.click(copyButton);

    await waitFor(() => expect(writeText).toHaveBeenCalledWith("||a||||b||"));
    expect(await screen.findByText(/copied to clipboard/i)).toBeInTheDocument();
  });
});
