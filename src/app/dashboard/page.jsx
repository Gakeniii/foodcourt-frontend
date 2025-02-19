"use client"; 

import { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-5">
      <h2 className="text-xl font-bold mb-5">Admin Dashboard</h2>
      <ul>
        <li className="mb-2"><Link href="/dashboard">Dashboard</Link></li>
        <li className="mb-2"><Link href="/dashboard/menu">Manage Menu</Link></li>
        <li className="mb-2"><Link href="/dashboard/orders">Orders</Link></li>
        <li className="mb-2"><Link href="/dashboard/tables">Table Bookings</Link></li>
        <li className="mb-2">
          <button 
            onClick={() => signOut()} 
            className="text-red-400 hover:text-red-300"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

const Dashboard = () => {
  return <div className="p-5">Welcome to the Admin Dashboard</div>;
};

export default function AdminDashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-5">
        <Dashboard />
      </div>
    </div>
  );
}
