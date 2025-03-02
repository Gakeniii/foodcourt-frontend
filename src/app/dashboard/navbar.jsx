"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { signOut } from "next-auth/react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("Owner");
  const router = useRouter();

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest(".dropdown-menu")) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const handleLogout = () => {
    signOut({callbackUrl: "/auth/login"});
  };

  return (
    <nav className="bg-slate-900 fixed top-0 left-0 w-full shadow-md z-[9999]">
      <div className="container text-white mx-auto px-4 py-3 flex justify-between items-center">
        {/* Brand */}
        <Link href="/dashboard" className="text-2xl font-bold text-white md:text-3xl">
          Foodie Eats
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 text-white font-medium">
          <Link href="/dashboard" className="hover:text-gray-600 transition">Dashboard</Link>
          <Link href="/dashboard/tables" className="hover:text-gray-600 transition">Tables</Link>
          <Link href="/dashboard/orders" className="hover:text-gray-600 transition">Orders</Link>

        </div>

        {/* User Dropdown */}
        <div className="relative dropdown-menu">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center bg-gray-200 rounded-full px-4 py-2 hover:shadow-md transition-shadow"
          >
            <span className="font-medium text-gray-800">{userName}</span>
            <ChevronDown className="h-5 w-5 ml-2 text-gray-600" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg border border-gray-200">
              <Link href="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-300">Dashboard</Link>
              <Link href="/dashboard/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-300">Orders</Link>
              <Link href="/dashboard/tables" className="block px-4 py-2 text-gray-700 hover:bg-gray-300 transition">Reservations</Link>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
