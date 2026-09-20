import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible, JetBrains_Mono } from "next/font/google";

import "@/app/globals.css";

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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#202124" },
  ],
  colorScheme: "light dark",
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
    <html lang="en" className={`${body.variable} ${mono.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
