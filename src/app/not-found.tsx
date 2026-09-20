import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="page-shell fallback-page">
      <h1>Page not found</h1>
      <p className="muted mt-3">This page doesn’t exist.</p>
      <div className="mt-6">
        <Link href="/" className="text-link">
          Back to converter
        </Link>
      </div>
    </main>
  );
}
