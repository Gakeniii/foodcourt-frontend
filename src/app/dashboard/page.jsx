"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function OwnerDashboard() {
  const [ownerName, setOwnerName] = useState("");
  const [menus, setMenus] = useState([]);
  const [ordersCount, setOrdersCount] = useState(0);
  const [tablesCount, setTablesCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const router = useRouter();
  const { data: session, status } = useSession();
  const BASE_URL = "https://foodcourt-db.onrender.com";

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  // Fetch Data Once Authenticated
  useEffect(() => {
    if (status !== "authenticated") return; // Only run if authenticated

    const fetchData = async () => {
      try {
        const userEmail = session?.user?.email;

        // Fetch owner details
        const response = await axios.get(`${BASE_URL}/users?email=${userEmail}`);
        if (response.data.length > 0 && response.data[0].role.toLowerCase() === "owner") {
          setOwnerName(response.data[0].name);
        } else {
          router.push("/dashboard");
        }

        // Fetch owner's menus
        const menusResponse = await axios.get(`${BASE_URL}/ownermenu`);
        setMenus(menusResponse.data);

        // Fetch orders count & recent orders
        const ordersResponse = await axios.get(`${BASE_URL}/orders`);
        setOrdersCount(ordersResponse.data.length);
        setRecentOrders(ordersResponse.data.slice(0, 5));

        // Fetch table bookings count
        const tablesResponse = await axios.get(`${BASE_URL}/tables`);
        setTablesCount(tablesResponse.data.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [status, session, router]);

  // Delete Menu Item
  const handleDeleteMenu = async (menuId) => {
    try {
      await axios.delete(`${BASE_URL}/ownermenu/${menuId}`);
      setMenus(menus.filter((menu) => menu.id !== menuId));
    } catch (error) {
      console.error("Error deleting menu:", error);
    }
  };

  if (status === "loading") {
    return <p>Loading session...</p>;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">FoodCourt Owner</h1>
        <div>
          <Link href="/dashboard" className="mr-4 hover:text-gray-300">Dashboard</Link>
          <button
            onClick={() => {
              localStorage.clear();
              signOut({ redirect: true, callbackUrl: "/auth/login" });
            }}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="flex-grow flex flex-col items-center justify-center p-6">
        <h2 className="text-3xl font-bold mb-4">Welcome, {ownerName || session?.user?.name}!</h2>
        <p className="text-lg text-gray-700 mb-6">
          Your ID is {session?.user?.id} and your email is {session?.user?.email}
        </p>

        {/* Order & Table Counts */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <Link href="/dashboard/orders" className="bg-blue-500 text-white p-6 rounded shadow-md hover:bg-blue-600">
            Orders ({ordersCount})
          </Link>
          <Link href="/dashboard/tables" className="bg-green-500 text-white p-6 rounded shadow-md hover:bg-green-600">
            Table Bookings ({tablesCount})
          </Link>
        </div>
      </div>
    </div>
  );
}
