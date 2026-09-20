type InlineSpoilerProps = Readonly<{
  children: string;
  revealed: boolean;
  onToggle: () => void;
}>;

export default function InlineSpoiler({ children, revealed, onToggle }: InlineSpoilerProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="spoiler"
      aria-label={revealed ? "Hide spoiler" : "Reveal spoiler"}
      aria-pressed={revealed}
    >
      {children}
    </button>
  );
}
