import type { Metadata } from "next";
import { Archivo_Narrow } from "next/font/google";
import localFont from "next/font/local";
import { WindowManagerProvider } from "@/components/WindowManager";
import "./globals.css";

const maruMonica = localFont({
  src: "./fonts/MaruMonica.ttf",
  variable: "--font-maru-monica",
});

const sciFied = localFont({
  src: "./fonts/SciFied2002.ttf",
  variable: "--font-sci-fied",
});

// Fallback for visitors who don't have Arial Narrow installed.
const archivoNarrow = Archivo_Narrow({
  variable: "--font-archivo-narrow",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stephanie Min",
  description:
    "Full-stack developer based in Melbourne, building software that feels personal and useful.",
  // public/favicon.ico is a GIF, so declare its real type.
  icons: { icon: { url: "/favicon.ico", type: "image/gif" } },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${maruMonica.variable} ${sciFied.variable} ${archivoNarrow.variable} antialiased`}
    >
      <body className="min-h-svh overflow-x-hidden">
        <WindowManagerProvider>{children}</WindowManagerProvider>
      </body>
    </html>
  );
}
