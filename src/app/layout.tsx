import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display, Style_Script } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const styleScript = Style_Script({
  weight: "400",
  variable: "--font-style-script",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cielora | Jewelry E-commerce",
  description: "Modern jewelry e-commerce landing page",
};

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${playfair.variable} ${styleScript.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans text-foreground bg-background" suppressHydrationWarning>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
