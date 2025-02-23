import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const BASE_URL = "https://foodcourt-db.onrender.com"; // API Backend URL

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials;
        const isSignup = req.headers.referer?.includes("/auth/signup");
        const endpoint = isSignup ? `${BASE_URL}/api/auth/signup` : `${BASE_URL}/api/auth/login`;

        try {
          const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email.toLowerCase(), password }),
          });

          if (!res.ok) {
            throw new Error("Authentication failed!");
          }

          const data = await res.json();

          return {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role.toLowerCase(),
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw new Error("Invalid credentials or signup failed!");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user; // Store full user data
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user; // Ensure full user is in session
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    signUp: "/auth/signup",
  },
};

// Fix: Export Named Methods Instead of Default Export
export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
