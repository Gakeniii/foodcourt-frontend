"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  ChevronDown,
  User,
  LogOut,
  Home,
  Utensils,
  ClipboardList,
  CalendarCheck,
  ShoppingCart,
} from "lucide-react";

const categories = [
  { name: "Home", icon: Home, href: "/home" },
  { name: "Food", icon: Utensils, href: "/menu" },
  { name: "Orders", icon: ClipboardList, href: "/orders" },
  { name: "Bookings", icon: CalendarCheck, href: "/tables" },
  { name: "Cart", icon: ShoppingCart, href: "/checkout" },
];

export function Navbar() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const menuRef = useRef(null);

  // Close dropdown if clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/auth/login");
  };

  const handleMenuClick = () => {
    setUserMenuOpen(false); // Close menu when clicking a link
  };

  const hiddenRoutes = [
    "/",
    "/auth/login",
    "/auth/signup",
    "/dashboard",
    "/dashboard/orders",
    "/dashboard/tables",
    "/dashboard/outlet/:id",
  ];
  if (hiddenRoutes.includes(pathname)) return null;

  return (
    <nav className="bg-yellow-400 shadow-md z-[9999]">
      {/* Navbar Container */}
      <div className="container mx-auto flex items-center justify-between h-14 px-4">
        {/* Brand Name */}
        <Link
          href="/"
          className="text-xl sm:text-2xl font-bold text-gray-800 transition-transform duration-300"
        >
          Foodie Eats
        </Link>

        {/* Navigation Icons - Hidden on small screens */}
        <div className="hidden md:flex items-center gap-6">
          {categories.map(({ name, icon: Icon, href }) => (
            <Link key={name} href={href} className="relative group">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 group-hover:bg-yellow-300 group-hover:scale-110">
                  <Icon className="h-5 w-5 text-gray-700 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <span className="absolute top-12 opacity-0 text-xs text-gray-800 transition-opacity duration-300 group-hover:opacity-100">
                  {name}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* User Profile with Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 bg-yellow-300 rounded-full px-3 py-1 hover:shadow-md transition-shadow"
          >
            <User className="h-5 w-5 text-green-600 transition-transform duration-300 hover:scale-110" />
            <span className="font-medium text-gray-900 hidden sm:inline">User</span>
            <ChevronDown className="h-4 w-4 text-gray-700" />
          </button>

          {/* User Dropdown Menu */}
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-md border border-gray-200">
              {/* Menu Items (Visible on Mobile) */}
              <div className="md:hidden flex flex-col py-2">
                {categories.map(({ name, icon: Icon, href }) => (
                  <Link
                    key={name}
                    href={href}
                    onClick={handleMenuClick}
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <Icon className="h-5 w-5 mr-2 text-gray-700 transition-transform duration-300 hover:scale-110" />
                    {name}
                  </Link>
                ))}
              </div>

              {/* Logout Button */}
              <button
                onClick={() => {
                  handleLogout();
                  handleMenuClick();
                }}
                disabled={loading}
                className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="h-4 w-4 mr-2 text-red-500 transition-transform duration-300 hover:scale-110" />
                {loading ? "Logging out..." : "Logout"}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
