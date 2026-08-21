import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { getDb } from "@/lib/db";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember Me", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        const client = await clientPromise;
        const db = client.db("cielora");
        const user = await db.collection("users").findOne({ email: credentials.email.toLowerCase() });

        if (!user) {
          throw new Error("No account found with this email");
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.password);

        if (!isValidPassword) {
          throw new Error("Incorrect password");
        }

        return {
          id: user._id.toString(),
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role || "customer",
          rememberMe: credentials.rememberMe === 'true'
        } as any;
      }
    })
  ],
  pages: {
    signIn: "/admin/login",
    error: "/admin/login", // Error code passed in query string as ?error=
  },
  callbacks: {
    signIn: async ({ user, account, profile }) => {
      if (account?.provider === "credentials") {
        return true;
      }
      
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
    jwt: async ({ token, user }) => {
      if (user) {
        if ((user as any).role) {
          token.role = (user as any).role;
        } else if (user.email === process.env.SYSTEM_RECOVERY_NODE) {
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
        if ((user as any).rememberMe !== undefined) {
          token.rememberMe = (user as any).rememberMe;
        }
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session?.user) {
        (session.user as any).role = token.role;
        (session as any).rememberMe = token.rememberMe;
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
