import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { type NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || "mock-google-id",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || "mock-google-secret",
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID || "mock-github-id",
      clientSecret: process.env.AUTH_GITHUB_SECRET || "mock-github-secret",
    }),
    {
      id: "email",
      name: "Email",
      type: "email",
      async sendVerificationRequest({ identifier, url }) {
        console.log(`[MOCK EMAIL] Send magic link to ${identifier}: ${url}`);
      },
    },
  ],
  callbacks: {
    authorized() {
      return true; // Authentication is optional
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || session.user.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
