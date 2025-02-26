"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ChevronDown, User, LogOut } from "lucide-react";
import './navbar.css';

const categories = [
  { name: "Home page", icon: "/icons/home.png", href: "/home" },
  { name: "Food", icon: "icons/foodbar.png", href: "/menu" },
  { name: "Tables", icon: "icons/table.png", href: "/tables" },
  { name: "Checkout", icon: "icons/cart.png", href: "/checkout" },
];

export function Navbar({ cartItems }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const hiddenRoutes = ["/auth/login", "/auth/signup", "/"];
  if (hiddenRoutes.includes(pathname)) return null;

  return (
    <div className="flex flex-col w-full">
      <div className="bg-yellow-400">
        {/* Top Navbar */}
        <header className="sticky top-0 z-50 w-full h-8"> {/* Reduced height to 50% */}
          <div className="container mx-auto px-2"> {/* Adjusted padding */}
            <div className="flex h-8 items-center justify-between"> {/* Reduced height to 50% */}
              {/* Logo */}
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold text-gray-600">Foodie Eats</span> {/* Reduced font size */}
              </Link>
              {/* User Button with Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center gap-1 bg-yellow-200 rounded-full px-2 py-1 hover:shadow-md transition-shadow" 
                >
                  <User className="h-2.5 w-2.5 text-[#00A082]" /> {/* Reduced icon size */}
                  <span className="font-medium text-gray-800 text-sm">User</span> {/* Reduced font size */}
                  <ChevronDown className="h-2 w-2" /> {/* Reduced icon size */}
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                  <div className="absolute right-0 mt-2 w-18 bg-white rounded-lg shadow-lg border border-gray-200"> {/* Adjusted width */}
                    <button
                      onClick={handleLogout}
                      disabled={loading}
                      className="flex items-center w-full px-2 py-1 text-gray-700 hover:bg-gray-100" 
                    >
                      <LogOut className="h-2.5 w-2.5 mr-1 text-red-500" /> {/* Reduced icon size */}
                      {loading ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        {/* Categories Section */}
        <div className="container mx-auto px-2 py-4"> {/* Adjusted padding */}
          <div className="grid-container"> {/* Apply the new grid-container class */}
            {categories.map((category) => (
              <Link key={category.name} href={category.href} className="category-bubble">
                <div className="category-circle hover:scale-110 transition-transform transition-all duration-300 ease-in-out relative">
                  <img
                    className="category-icon hover:scale-110 transition-transform transition-all duration-300 ease-in-out"
                    src={category.icon}
                    alt={category.name} />
                  {category.name === "Checkout" && cartItems && cartItems.length > 0 && (
                    <span className="notification-badge">{cartItems.length}</span>
                  )}
                </div>
                <div className="flex flex-col items-center">
                  <span className="category-label">{category.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
