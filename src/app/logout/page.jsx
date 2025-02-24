"use client"

import { Link } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Logout = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    try {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed", error);
      setLoading(false);
    }
  };

  return (
    <>
        <Link
        onClick={handleLogout}
        disabled={loading}
        >
        {loading ? "Logging out..." : "Logout"}
        </Link>
    </>
  );
};

export default Logout;