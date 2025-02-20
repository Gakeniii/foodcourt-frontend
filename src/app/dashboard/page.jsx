"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [adminName, setAdminName] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Retrieve admin email from localStorage
    const adminEmail = localStorage.getItem("userEmail");

    if (adminEmail) {
      // Fetch admin details from the database
      axios
        .get(`http://localhost:5000/users?email=${adminEmail}`)
        .then((response) => {
          if (response.data.length > 0 && response.data[0].role === "admin") {
            setAdminName(response.data[0].name);
          } else {
            // Redirect non-admin users to the home page
            router.push("/");
          }
        })
        .catch((error) => {
          console.error("Error fetching admin data:", error);
          router.push("/");
        });
    } else {
      // If no adminEmail is found, redirect to login
      router.push("/auth/login");
    }
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4">Welcome, {adminName || "Admin"}!</h1>
      <p className="text-lg">This is your Admin Dashboard.</p>
      {/* Add more admin functionalities here */}
    </div>
  );
}
