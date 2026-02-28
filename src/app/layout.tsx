import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible, Honk, JetBrains_Mono } from "next/font/google";

import "@/app/globals.css";

const display = Honk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const title = "Discord Spoiler Text Converter";
const description = "Convert text into Discord spoiler markdown (||like this||).";

export const viewport: Viewport = {
  themeColor: "#070a10",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL("https://discord-spoiler-text-converter.thepushkarp.com"),
  applicationName: title,
  manifest: "/manifest.json",
  openGraph: {
    title,
    description,
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 512,
        height: 512,
        alt: title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/logo192.png",
  },
};

export default function RootLayout(props: Readonly<{ children: React.ReactNode }>) {
  const { children } = props;

  return (
    <html lang="en" className={`dark ${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-[#070a10] text-slate-100 antialiased">
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(254,234,59,0.14),transparent_45%),radial-gradient(circle_at_78%_40%,rgba(56,189,248,0.10),transparent_52%),linear-gradient(#070a10,#0b0f17)]" />
          <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.11)_1px,transparent_0)] [background-size:26px_26px]" />
        </div>

        {children}
      </body>
    </html>
  );
}
