import { getuser } from "@/app/lib/utils";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // const user = { id: "1", name: "J Smith", email: "jsmith@example.com" };
        const user = await getuser(credentials.email)
          console.log(user)

    
    if (user) {
      if (user[0].password !== credentials.password) {
        return "Incorrect password"
      }
      return user[0];
    } else {
      return null;
    }
  },
}),
  ],
  secret: process.env.NEXTAUTH_SECRET, // Ensure this is set in .env.local
};

// Named exports for HTTP methods
export const POST = NextAuth(authOptions);
export const GET = NextAuth(authOptions); // Required for session endpoint