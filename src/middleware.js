
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    authorized: ({ token }) => token?.role === "Owner", // Only allow owner users
  },
});

export const config = {
  matcher: ["/dashboard", "/Owner/:path*"], // Protected
};