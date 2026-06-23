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
  description: "Modern jewelry e-commerce landing page",
  icons: {
    icon: "/images/fevicon.png",
  },
};

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import SideCart from "@/components/SideCart";

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
        {/* Hidden Google Translate Element */}
        <div id="google_translate_element" className="hidden"></div>
        <Script id="google-translate-init" strategy="lazyOnload">
          {`
            function googleTranslateElementInit() {
              new window.google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'es',
                autoDisplay: false
              }, 'google_translate_element');
            }
          `}
        </Script>
        <Script 
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" 
          strategy="lazyOnload" 
        />
        <WishlistProvider>
          <CartProvider>
            <Navbar />
            {children}
            <Footer />
            <SideCart />
          </CartProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}
