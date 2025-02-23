"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function OwnerDashboard() {
  const [ownerName, setOwnerName] = useState("");
  const [menus, setMenus] = useState([]); // Store owner's menu items
  const [ordersCount, setOrdersCount] = useState(0);
  const [tablesCount, setTablesCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const router = useRouter();
  const BASE_URL = "https://foodcourt-db.onrender.com";

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    const userRole = localStorage.getItem("userRole");

    // Redirect if no user or wrong role
    if (!userEmail || userRole !== "owner") {
      router.push("/auth/login");
      return;
    }

    // Fetch owner details
    axios.get(`${BASE_URL}/users?email=${userEmail}`)
      .then((response) => {
        if (response.data.length > 0 && response.data[0].role.toLowerCase() === "owner") {
          setOwnerName(response.data[0].name);
        } else {
          router.push("/home"); 
        }
      })
      .catch((error) => console.error("Error fetching owner data:", error));

    // Fetch owner's menus
    axios.get(`${BASE_URL}/ownermenu`)
      .then((res) => setMenus(res.data))
      .catch((error) => console.error("Error fetching menus:", error));

    // Fetch orders count & recent orders
    axios.get(`${BASE_URL}/orders`)
      .then((res) => {
        setOrdersCount(res.data.length);
        setRecentOrders(res.data.slice(0, 5)); // Get latest 5 orders
      })
      .catch((error) => console.error("Error fetching orders:", error));

    // Fetch table bookings count
    axios.get(`${BASE_URL}/tables`)
      .then((res) => setTablesCount(res.data.length))
      .catch((error) => console.error("Error fetching tables:", error));
  }, []);

  // Delete menu item
  const handleDeleteMenu = async (menuId) => {
    try {
      await axios.delete(`${BASE_URL}/ownermenu/${menuId}`);
      setMenus(menus.filter(menu => menu.id !== menuId)); // Remove deleted menu
    } catch (error) {
      console.error("Error deleting menu:", error);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">FoodCourt Owner</h1>
        <div>
          <Link href="/dashboard" className="mr-4 hover:text-gray-300">Dashboard</Link>
          <button 
            onClick={() => {
              signOut();
              localStorage.clear();
              router.push("/auth/login");
            }} 
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="flex-grow flex flex-col items-center justify-center p-6">
        <h2 className="text-3xl font-bold mb-4">Welcome, {ownerName || "Owner"}!</h2>
        <p className="text-lg text-gray-700 mb-6">Manage your restaurant efficiently.</p>

        {/* Order & Table Counts */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <Link href="/dashboard/orders" className="bg-blue-500 text-white p-6 rounded shadow-md hover:bg-blue-600">
            Orders ({ordersCount})
          </Link>
          <Link href="/dashboard/tables" className="bg-green-500 text-white p-6 rounded shadow-md hover:bg-green-600">
            Table Bookings ({tablesCount})
          </Link>
        </div>

        {/* Recent Orders Section */}
        <div className="mt-8 w-full max-w-2xl">
          <h3 className="text-xl font-bold mb-4">Recent Orders</h3>
          <div className="bg-white p-4 rounded shadow">
            {recentOrders.length > 0 ? (
              recentOrders.map((order, index) => (
                <div key={index} className="border-b p-2">
                  <p><strong>Order ID:</strong> {order.id}</p>
                  <p><strong>Customer:</strong> {order.customerName}</p>
                  <p><strong>Total:</strong> ksh{order.totalPrice}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No recent orders found.</p>
            )}
          </div>
        </div>

        {/* Menu Management */}
        <div className="mt-8 w-full max-w-4xl">
          <h3 className="text-xl font-bold mb-4">Your Menu Items</h3>
          <div className="bg-white p-4 rounded shadow">
            {menus.length > 0 ? (
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Price</th>
                    <th className="border p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {menus.map((menu) => (
                    <tr key={menu.id} className="text-center border-b">
                      <td className="border p-2">{menu.name}</td>
                      <td className="border p-2">${menu.price}</td>
                      <td className="border p-2 space-x-2">
                        <Link href={`/dashboard/menu/${menu.id}`} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                          View
                        </Link>
                        <Link href={`/dashboard/menu/edit/${menu.id}`} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                          Edit
                        </Link>
                        <button 
                          onClick={() => handleDeleteMenu(menu.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500">No menu items found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
