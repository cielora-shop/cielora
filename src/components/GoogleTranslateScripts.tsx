"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function GoogleTranslateScripts() {
  const pathname = usePathname();

  // If on admin panel, clear googtrans cookie to ensure no translation
  useEffect(() => {
    if (pathname && pathname.startsWith("/admin")) {
      if (document.cookie.includes('googtrans=')) {
        document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=" + window.location.hostname + "; path=/;";
        window.location.reload();
      }
    }
  }, [pathname]);

  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <div id="google_translate_element" className="hidden"></div>
      <Script id="set-default-lang" strategy="beforeInteractive">
        {`
          if (document.cookie.indexOf('googtrans=') === -1 && document.cookie.indexOf('cielora_lang=en') === -1) {
            document.cookie = 'googtrans=/en/es; path=/';
            document.cookie = 'googtrans=/en/es; domain=' + window.location.hostname + '; path=/';
          }
        `}
      </Script>
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
    </>
  );
}
