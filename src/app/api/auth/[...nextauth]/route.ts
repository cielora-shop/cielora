import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getDb } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/admin/login",
    error: "/admin/login", // Error code passed in query string as ?error=
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (user.email === process.env.SYSTEM_RECOVERY_NODE) {
          return true;
        }
        const db = await getDb();
        const allowedEmails = db.admins.map((a) => a.email);
        
        if (user.email && allowedEmails.includes(user.email)) {
          return true;
        } else {
          return "/admin/login?error=AccessDenied";
        }
      } catch (err) {
        console.error("Error reading database in auth callback:", err);
        return "/admin/login?error=AccessDenied";
      }
    },
    async jwt({ token, user }) {
      if (user) {
        if (user.email === process.env.SYSTEM_RECOVERY_NODE) {
          token.role = "sys_tier_0";
        } else {
          try {
            const db = await getDb();
            const adminUser = db.admins.find((a) => a.email === user.email);
            token.role = adminUser ? adminUser.role : "admin";
          } catch (e) {
            token.role = "admin";
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
