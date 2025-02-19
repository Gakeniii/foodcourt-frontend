
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    authorized: ({ token }) => token?.role === "admin", // Only allow admin users
  },
});

export const config = {
  matcher: ["/dashboard", "/admin/:path*"], // Protected
};