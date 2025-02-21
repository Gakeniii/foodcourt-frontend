"use client"

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
        <button
        onClick={handleLogout}
        disabled={loading}
        >
        {loading ? "Logging out..." : "Logout"}
        </button>
    </>
  );
};

export default Logout;