import { describe, test, expect, vi, beforeAll, afterAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WrapText from './WrapText';

const mockClipboard = {
    writeText: vi.fn().mockResolvedValue(undefined),
};

beforeAll(() => {
    Object.defineProperty(navigator, 'clipboard', {
        value: mockClipboard,
        writable: true,
        configurable: true,
    });
});

afterAll(() => {
    vi.restoreAllMocks();
});

describe('WrapText', () => {
    test('renders input field with placeholder', () => {
        render(<WrapText />);
        expect(
            screen.getByPlaceholderText(/type or paste your text/i),
        ).toBeInTheDocument();
    });

    test('renders all three wrap mode options', () => {
        render(<WrapText />);
        expect(screen.getByLabelText(/per character/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/per word/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/entire text/i)).toBeInTheDocument();
    });

    test('auto-converts text as user types (per character mode)', async () => {
        const user = userEvent.setup();
        render(<WrapText />);

        const input = screen.getByPlaceholderText(/type or paste your text/i);
        await user.type(input, 'ab');

        const output = screen.getByLabelText(/converted spoiler text/i);
        expect(output.value).toBe('||a||||b||');
    });

    test('wraps words correctly in word mode', async () => {
        const user = userEvent.setup();
        render(<WrapText />);

        await user.click(screen.getByLabelText(/per word/i));

        const input = screen.getByPlaceholderText(/type or paste your text/i);
        await user.type(input, 'hello world');

        const output = screen.getByLabelText(/converted spoiler text/i);
        expect(output.value).toBe('||hello|| ||world||');
    });

    test('wraps entire text correctly in text mode', async () => {
        const user = userEvent.setup();
        render(<WrapText />);

        await user.click(screen.getByLabelText(/entire text/i));

        const input = screen.getByPlaceholderText(/type or paste your text/i);
        await user.type(input, 'hello world');

        const output = screen.getByLabelText(/converted spoiler text/i);
        expect(output.value).toBe('||hello world||');
    });

    test('copy button is disabled when output is empty', () => {
        render(<WrapText />);
        const copyButton = screen.getByRole('button', {
            name: /copy to clipboard/i,
        });
        expect(copyButton).toBeDisabled();
    });

    test('copy button is enabled when there is output', async () => {
        const user = userEvent.setup();
        render(<WrapText />);

        const input = screen.getByPlaceholderText(/type or paste your text/i);
        await user.type(input, 'test');

        const copyButton = screen.getByRole('button', {
            name: /copy to clipboard/i,
        });
        expect(copyButton).not.toBeDisabled();
    });

    test('shows character count', async () => {
        const user = userEvent.setup();
        render(<WrapText />);

        const input = screen.getByPlaceholderText(/type or paste your text/i);
        await user.type(input, 'ab');

        expect(screen.getByText(/10\/2,000/)).toBeInTheDocument();
    });

    test('normalizes whitespace in input', async () => {
        render(<WrapText />);

        const radioButton = screen.getByLabelText(/per word/i);
        fireEvent.click(radioButton);

        const input = screen.getByPlaceholderText(/type or paste your text/i);
        fireEvent.change(input, { target: { value: 'hello  world' } });

        const output = screen.getByLabelText(/converted spoiler text/i);
        expect(output.value).toBe('||hello|| ||world||');
    });

    test('preserves spaces in character mode', async () => {
        const user = userEvent.setup();
        render(<WrapText />);

        const input = screen.getByPlaceholderText(/type or paste your text/i);
        await user.type(input, 'a b');

        const output = screen.getByLabelText(/converted spoiler text/i);
        expect(output.value).toBe('||a|| ||b||');
    });
});
