// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";

// export default NextAuth({
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "text", placeholder: "admin@example.com" },
//         password: { label: "Password", type: "password" }
//       },
//       async authorize(credentials) {
//         const res = await fetch("http://localhost:5000/users");
//         const users = await res.json();

//         // Find user by email
//         const user = users.find(user => user.email === credentials.email);

//         if (!user) {
//           throw new Error("User not found!");
//         }

//         // Check password (Note: Use hashing in a real app)
//         if (user.password !== credentials.password) {
//           throw new Error("Invalid credentials!");
//         }

//         // Return user object
//         return { id: user.id, name: user.name, email: user.email, role: user.role };
//       }
//     })
//   ],
//   callbacks: {
//     async session({ session, token }) {
//       session.user.role = token.role;
//       return session;
//     },
//     async jwt({ token, user }) {
//       if (user) {
//         token.role = user.role;
//       }
//       return token;
//     }
//   },
//   pages: {
//     signIn: "/auth/login"
//   }
// });
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "admin@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const res = await fetch("http://localhost:5000/users");
        const users = await res.json();

        // Find user by email
        const user = users.find(user => user.email === credentials.email);

        if (!user) {
          throw new Error("User not found!");
        }

        // Check password (In production, use hashing)
        if (user.password !== credentials.password) {
          throw new Error("Invalid credentials!");
        }

        return { id: user.id, name: user.name, email: user.email, role: user.role };
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    }
  },
  pages: {
    signIn: "/auth/login"
  }
};

// Export named functions for each HTTP method
export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
