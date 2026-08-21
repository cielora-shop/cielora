export const revalidate = 60;

import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display, Style_Script } from "next/font/google";
import Script from "next/script";
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
  description: "Discover Cielora's exquisite collection of modern jewelry, featuring limited editions, best sellers, and everyday pieces designed for you.",
  openGraph: {
    title: "Cielora | Jewelry E-commerce",
    description: "Discover Cielora's exquisite collection of modern jewelry, featuring limited editions, best sellers, and everyday pieces designed for you.",
    url: "https://www.cielora.shop",
    siteName: "Cielora",
    locale: "en_US",
    type: "website",
  },
  verification: {
    google: "hDlhCN3V1fcUpkv3hbwFxwH2G_5GAb4tWEW04QHFc1I",
  },
  icons: {
    icon: [
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/images/fevicon.png" }
    ],
  },
};

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { CartProvider } from "@/context/CartContext";
import NextAuthProvider from "@/components/NextAuthProvider";
import { WishlistProvider } from "@/context/WishlistContext";
import SideCart from "@/components/SideCart";
import { headers } from "next/headers";
import { getDb } from "@/lib/db";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const reqHeaders = await headers();
  const pathname = reqHeaders.get("x-pathname") || "";
  
  let isPaused = false;
  try {
    const db = await getDb();
    isPaused = !!db.settings?.sitePaused;
  } catch (e) {
    console.error("Failed to fetch DB in layout", e);
  }

  const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/api/auth");

  if (isPaused && !isAdminRoute) {
    return (
      <html
        lang="en"
        className={`${jakarta.variable} ${playfair.variable} ${styleScript.variable} h-full antialiased`}
        suppressHydrationWarning
      >
        <body className="min-h-full flex flex-col font-sans text-foreground bg-[#0a0a0a] text-white items-center justify-center p-8 text-center" suppressHydrationWarning>
          <div className="max-w-md w-full flex flex-col items-center gap-6 animate-pulse">
            <span
              className="text-[48px] font-normal leading-none tracking-[0.02em] text-[#d2977a]"
              style={{ fontFamily: "var(--font-style-script)" }}
            >
              Cielora
            </span>
            <h1 className="text-xl font-bold tracking-widest uppercase border-b border-stone-800 pb-4 w-full">Under Maintenance</h1>
            <p className="text-stone-400 text-[13px] leading-relaxed">
              We are currently upgrading our boutique to bring you an even more exquisite experience. 
              Our craftsmen will be finished shortly. Thank you for your patience.
            </p>
          </div>
        </body>
      </html>
    );
  }

  const isCheckoutRoute = pathname.startsWith("/checkout");

  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${playfair.variable} ${styleScript.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans text-foreground bg-background" suppressHydrationWarning>
        <NextAuthProvider>
          <WishlistProvider>
            <CartProvider>
              <Navbar />
              {children}
              <Footer />
              <SideCart />
            </CartProvider>
          </WishlistProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
