import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const BASE_URL = "https://foodcourt-db.onrender.com";

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
        const endpoint = `${BASE_URL}/api/auth/${isSignup ? "signup" : "login"}`;

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
      console.log("Auth API Response:", data);

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
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role || "user";
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      console.log("JWT Token:", token);
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          name: token.name,
          email: token.email,
          role: token.role,
        };
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    signUp: "/auth/signup",
  },
};

// Correct way to handle NextAuth in Next.js API Route Handlers
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

