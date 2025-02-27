"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ChevronDown, User, LogOut, Home, Utensils, ClipboardList, CalendarCheck, ShoppingCart } from "lucide-react";

const categories = [
  { name: "Home page", icon: Home, href: "/home" },
  { name: "Food", icon: Utensils, href: "/menu" },
  { name: "Orders", icon: ClipboardList, href: "/orders" },
  // { name: "Bookings", icon: CalendarCheck, href: "/tables" },
  { name: "Cart", icon: ShoppingCart, href: "/checkout" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      let token = localStorage.getItem("access_token");

      if (!token) return;

      try {
        let response = await fetch("http://127.0.0.1:5000/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserName(data.name);
          return;
        } else if (response.status === 401) {
          const refreshResponse = await fetch("http://127.0.0.1:5000/api/auth/refresh", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("refresh_token")}`,
            },
          });

          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            localStorage.setItem("access_token", refreshData.access_token);

            response = await fetch("http://127.0.0.1:5000/users", {
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

  const hiddenRoutes = ["/", "/auth/login", "/auth/signup", "/dashboard", "/dashboard/orders", "/dashboard/tables", "/dashboard/outlet/:id"];
  if (hiddenRoutes.includes(pathname)) return null;

  return (
    <div className="flex flex-col w-full">
      <div className="bg-yellow-400">
        <header className="sticky top-0 z-50 w-full">
          <div className="container mx-auto px-2">
            <div className="flex h-16 items-center justify-between">
              <Link href="/" className="flex items-center">
                <span className="text-4xl font-bold text-gray-600">Foodie Eats</span>
              </Link>

              <div className="relative">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center gap-2 bg-yellow-200 rounded-full px-4 py-2 hover:shadow-md transition-shadow"
                >
                  <User className="h-5 w-5 text-[#00A082]" />
                  <span className="font-medium text-gray-800">User</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

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

        <div className="container mx-auto px-2 py-2">
          <div className="grid grid-cols-2 md:grid-cols-4 justify-items-center gap-4">
            {categories.map(({ name, icon: Icon, href }) => (
              <Link key={name} href={href} className="category-bubble">
                <div className="category-circle hover:scale-110 transition-transform transition-all duration-300 ease-in-out">
                  <Icon className="h-8 w-8 text-gray-600" />
                </div>
                <div className="flex flex-col items-center">
                  <span className="category-label">{name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
