
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    authorized: ({ token }) => token?.role === "owner", // Only allow owner users
  },
});

export const config = {
  matcher: ["/dashboard", "/owner/:path*"], // Protected
};