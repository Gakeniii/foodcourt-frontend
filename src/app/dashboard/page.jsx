"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";

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
            router.push("/");
          }
        })
        .catch((error) => {
          console.error("Error fetching admin data:", error);
          router.push("/");
        });
    } else {
      router.push("/auth/login");
    }
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">FoodCourt Admin</h1>
        <div>
          <Link href="/dashboard" className="mr-4 hover:text-gray-300">Dashboard</Link>
          <button 
            onClick={() => signOut()} 
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="flex-grow flex flex-col items-center justify-center p-6">
        <h2 className="text-3xl font-bold mb-4">Welcome, {adminName || "Admin"}!</h2>
        <p className="text-lg text-gray-700 mb-6">Manage your restaurant efficiently.</p>

        {/* Admin Sections */}
        <div className="grid grid-cols-2 gap-6">
          <Link href="/dashboard/orders" className="bg-blue-500 text-white p-6 rounded shadow-md hover:bg-blue-600">
            Orders
          </Link>
          <Link href="/dashboard/tables" className="bg-green-500 text-white p-6 rounded shadow-md hover:bg-green-600">
            Table Bookings
          </Link>
        </div>

        {/* Menu Management */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Menu Management</h3>
          <div className="grid grid-cols-3 gap-4">
            <Link href="/dashboard/menu/add" className="bg-yellow-500 text-white p-4 rounded hover:bg-yellow-600">
              Add a Menu
            </Link>
            <Link href="/dashboard/menu/edit" className="bg-orange-500 text-white p-4 rounded hover:bg-orange-600">
              Edit a Menu
            </Link>
            <Link href="/dashboard/menu/delete" className="bg-red-500 text-white p-4 rounded hover:bg-red-600">
              Delete a Menu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
