"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function GoogleTranslateScripts() {
  const pathname = usePathname();

  // If on admin panel, clear googtrans cookie to ensure no translation
  useEffect(() => {
    if (pathname && pathname.startsWith("/admin")) {
      if (document.cookie.includes('googtrans=') && !document.cookie.includes('googtrans=/en/en')) {
        document.cookie = "googtrans=/en/en; path=/;";
        document.cookie = "googtrans=/en/en; domain=" + window.location.hostname + "; path=/;";
        document.cookie = "googtrans=/en/en; domain=." + window.location.hostname + "; path=/;";
        
        const hostParts = window.location.hostname.split('.');
        if (hostParts.length >= 2) {
            const rootDomain = hostParts.slice(-2).join('.');
            document.cookie = "googtrans=/en/en; domain=" + rootDomain + "; path=/;";
            document.cookie = "googtrans=/en/en; domain=." + rootDomain + "; path=/;";
        }
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
      <script
        id="set-default-lang"
        dangerouslySetInnerHTML={{
          __html: `
            if (document.cookie.indexOf('googtrans=') === -1 && document.cookie.indexOf('cielora_lang=en') === -1) {
              document.cookie = 'googtrans=/en/es; path=/';
              document.cookie = 'googtrans=/en/es; domain=' + window.location.hostname + '; path=/';
              document.cookie = 'googtrans=/en/es; domain=.' + window.location.hostname + '; path=/';
              if (window.location.hostname.includes('.')) {
                var root = window.location.hostname.split('.').slice(-2).join('.');
                document.cookie = 'googtrans=/en/es; domain=' + root + '; path=/';
                document.cookie = 'googtrans=/en/es; domain=.' + root + '; path=/';
              }
            }
          `
        }}
      />
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
