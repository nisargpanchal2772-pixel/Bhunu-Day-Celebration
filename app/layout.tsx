import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AudioPlayer from "@/components/AudioPlayer";
import AnimatedBackground from "@/components/AnimatedBackground";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Bhunu Day Celebration Quest",
  description: "A 13-Day Journey Celebrating You, My Love.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="antialiased min-h-screen relative selection:bg-rose-gold/40">
        <AnimatedBackground />
        <Navbar />
        <main className="pt-24 pb-20 px-4 min-h-screen flex flex-col items-center">
          {children}
        </main>
        <AudioPlayer />
      </body>
    </html>
  );
}
