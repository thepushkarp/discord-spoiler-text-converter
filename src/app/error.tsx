"use client";

import { useEffect } from "react";
import Link from "next/link";

type ErrorProps = Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>;

export default function ErrorPage(props: ErrorProps) {
  const { error, reset } = props;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="page-shell fallback-page">
      <h1>Something went wrong</h1>
      <p className="muted mt-3">Try again. If the problem persists, refresh the page.</p>
      <div className="mt-6 flex items-center gap-4">
        <button type="button" onClick={reset} className="primary-button">
          Retry
        </button>
        <Link href="/" className="text-link">
          Back to converter
        </Link>
      </div>
    </main>
  );
}
