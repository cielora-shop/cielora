"use client";

import { SessionProvider, useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

function SessionManager({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session) {
      // If the user explicitly unchecked "Remember me", we rely on the session cookie
      if ((session as any).rememberMe === false) {
        const hasSessionCookie = document.cookie.includes("browser_session_active=true");
        if (!hasSessionCookie) {
          // Cookie is gone (browser was closed). Force logout.
          signOut({ redirect: false });
        }
      }
    }
  }, [session, status]);

  return <>{children}</>;
}

export default function NextAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <SessionManager>{children}</SessionManager>
    </SessionProvider>
  );
}
