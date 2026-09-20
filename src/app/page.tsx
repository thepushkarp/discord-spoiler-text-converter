import Footer from "@/components/Footer";
import SpoilerConverter from "@/components/SpoilerConverter";

export default function HomePage() {
  return (
    <main className="page-shell">
      <header className="mb-8">
        <h1>Discord spoiler converter</h1>
        <p className="muted mt-2">Turn text into spoilers, then copy it into Discord.</p>
      </header>
      <SpoilerConverter />
      <Footer />
    </main>
  );
}
