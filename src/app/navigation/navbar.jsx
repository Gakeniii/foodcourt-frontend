"use client";

import Link from "next/link";
import { useState, useEffect  } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ChevronDown, User, LogOut } from "lucide-react";

const categories = [
  { name: "Home page", icon: "/icons/home.png", href: "/home" },
  { name: "Food", icon: "icons/foodbar.png", href: "/menu" },
  { name: "Tables", icon: "icons/table.png", href: "/tables" },
  { name: "Checkout", icon: "icons/cart.png", href: "/checkout" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      let token = localStorage.getItem("access_token");

      if (!token) return; // If no token, do nothing

      try {
        let response = await fetch("https://foodcourt-db.onrender.com/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserName(data.name);
          return;
        } else if (response.status === 401) {
          // If unauthorized, try refreshing the token
          const refreshResponse = await fetch("https://foodcourt-db.onrender.com/api/auth/refresh", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("refresh_token")}`,
            },
          });

          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            localStorage.setItem("access_token", refreshData.access_token);

            // Retry fetching user data with new token
            response = await fetch("https://foodcourt-db.onrender.com/users", {
              headers: {
                Authorization: `Bearer ${refreshData.access_token}`,
              },
            });

            if (response.ok) {
              const data = await response.json();
              setUserName(data.name);
            } else {
              console.error("Failed to fetch user data after refreshing token");
            }
          } else {
            console.error("Refresh token expired, logging out");
            handleLogout();
          }
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

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

  const hiddenRoutes = ["/auth/login", "/auth/signup", "/"];
  if (hiddenRoutes.includes(pathname)) return null;

  return (
    <div className="flex flex-col w-full">
      <div className="bg-yellow-400">
        {/* Top Navbar */}
        <header className="sticky top-0 z-50 w-full">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center">
                <span className="text-4xl font-bold text-gray-600">Foodie Eats</span>
              </Link>

              {/* User Button with Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center gap-2 bg-yellow-200 rounded-full px-4 py-2 hover:shadow-md transition-shadow"
                >
                  <User className="h-5 w-5 text-[#00A082]" />
                  <span className="font-medium text-gray-800">User</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                  <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg border border-gray-200">
                    <button
                      onClick={handleLogout}
                      disabled={loading}
                      className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-5 w-5 mr-2 text-red-500" />
                      {loading ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Categories Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-40 justify-items-center">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link key={category.name} href={category.href} className="category-bubble">
                  <div className="category-circle hover:scale-110 transition-transform transition-all duration-300 ease-in-out">
                    <img
                      className="category-icon hover:scale-110 transition-transform transition-all duration-300 ease-in-out"
                      src={category.icon}
                      alt={category.name} />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="category-label">{category.name}</span>
                    <span className="text-xs text-gray-600">{category.description}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
