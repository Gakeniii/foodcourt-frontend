import { login } from "@/app/lib/utils";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const response = await login(credentials.email, credentials.password);
        console.log("Response:", response)
        if (!response || !response.access_token) {
          throw new Error(response.error);
        }


        // Return the relevant user data and tokens
        return {
          id: response.user.id,
          name: response.user.name,
          email: credentials.email,
          role: response.user.role,
          accessToken: response.access_token,
          refreshToken: response.refresh_token,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  // Store JWT tokens in the session
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
