// "use client";

// import Link from "next/link";
// import { useState } from "react";
// import { ChevronDown, ShoppingCart, Pizza, Home, User, ArmchairIcon, LogOut } from "lucide-react";

// const categories = [
//   { name: "Home page", icon: Home, href: "/home" },
//   { name: "Food", icon: Pizza, href: "/menu" },
//   { name: "Checkout", icon: ShoppingCart, href: "/checkout" },
//   { name: "Tables", icon: ArmchairIcon, href: "/tables" },
// ];


// export function Navbar() {
//   const [isOpen, setIsOpen] = useState(false); // Dropdown state

//   return (
//     <div className="flex flex-col w-full">
//       <div className="bg-yellow-400">
//         {/* Top Navbar */}
//         <header className="sticky top-0 z-50 w-full">
//           <div className="container mx-auto px-4">
//             <div className="flex h-16 items-center justify-between">
//               {/* Logo */}
//               <Link href="/" className="flex items-center">
//                 <span className="text-2xl font-bold text-[#00A082]">Foodie Eats</span>
//               </Link>

//               {/* User Button with Dropdown */}
//               <div className="relative">
//                 <button
//                   onClick={() => setIsOpen(!isOpen)}
//                   className="flex items-center gap-2 bg-white rounded-full px-4 py-2 hover:shadow-md transition-shadow"
//                 >
//                   <User className="h-5 w-5 text-[#00A082]" />
//                   <span className="font-medium text-gray-800">User</span>
//                   <ChevronDown className="h-4 w-4" />
//                 </button>

//                 {/* Dropdown Menu */}
//                 {isOpen && (
//                   <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg border border-gray-200">
//                     <Link
//                       href="/logout"
//                       className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
//                     >
//                       <LogOut className="h-5 w-5 mr-2 text-red-500" />
//                       Logout
//                     </Link>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Categories Section */}
//         <div className="container mx-auto px-4 py-8">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-40 justify-items-center">
//             {categories.map((category) => {
//               const Icon = category.icon;
//               return (
//                 <Link key={category.name} href={category.href} className="category-bubble">
//                   <div className="category-circle hover:scale-110 transition-transform transition-all duration-300 ease-in-out">
//                     <Icon className="category-icon hover:scale-110 transition-transform transition-all duration-300 ease-in-out" />
//                   </div>
//                   <div className="flex flex-col items-center">
//                     <span className="category-label">{category.name}</span>
//                     <span className="text-xs text-gray-600">{category.description}</span>
//                   </div>
//                 </Link>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import Link from "next/link";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { ChevronDown, ShoppingCart, Pizza, Home, User, ArmchairIcon, LogOut } from "lucide-react";

// const categories = [
//   { name: "Home page", icon: Home, href: "/home" },
//   { name: "Food", icon: Pizza, href: "/menu" },
//   { name: "Checkout", icon: ShoppingCart, href: "/checkout" },
//   { name: "Tables", icon: ArmchairIcon, href: "/tables" },
// ];

// export function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleLogout = async () => {
//     setLoading(true);
//     try {
//       localStorage.removeItem("access_token");
//       localStorage.removeItem("refresh_token");
//       router.push("/auth/login"); // Redirect to login page after logout
//     } catch (error) {
//       console.error("Logout failed", error);
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col w-full">
//       <div className="bg-yellow-400">
//         {/* Top Navbar */}
//         <header className="sticky top-0 z-50 w-full">
//           <div className="container mx-auto px-4">
//             <div className="flex h-16 items-center justify-between">
//               {/* Logo */}
//               <Link href="/" className="flex items-center">
//                 <span className="text-2xl font-bold text-[#00A082]">Foodie Eats</span>
//               </Link>

//               {/* User Button with Dropdown */}
//               <div className="relative">
//                 <button
//                   onClick={() => setIsOpen(!isOpen)}
//                   className="flex items-center gap-2 bg-white rounded-full px-4 py-2 hover:shadow-md transition-shadow"
//                 >
//                   <User className="h-5 w-5 text-[#00A082]" />
//                   <span className="font-medium text-gray-800">User</span>
//                   <ChevronDown className="h-4 w-4" />
//                 </button>

//                 {/* Dropdown Menu */}
//                 {isOpen && (
//                   <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg border border-gray-200">
//                     <button
//                       onClick={handleLogout}
//                       disabled={loading}
//                       className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
//                     >
//                       <LogOut className="h-5 w-5 mr-2 text-red-500" />
//                       {loading ? "Logging out..." : "Logout"}
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Categories Section */}
//         <div className="container mx-auto px-4 py-8">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-40 justify-items-center">
//             {categories.map((category) => {
//               const Icon = category.icon;
//               return (
//                 <Link key={category.name} href={category.href} className="category-bubble">
//                   <div className="category-circle hover:scale-110 transition-transform transition-all duration-300 ease-in-out">
//                     <Icon className="category-icon hover:scale-110 transition-transform transition-all duration-300 ease-in-out" />
//                   </div>
//                   <div className="flex flex-col items-center">
//                     <span className="category-label">{category.name}</span>
//                     <span className="text-xs text-gray-600">{category.description}</span>
//                   </div>
//                 </Link>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ChevronDown, ShoppingCart, Pizza, Home, User, ArmchairIcon, LogOut } from "lucide-react";

const categories = [
  { name: "Home page", icon: Home, href: "/home" },
  { name: "Food", icon: Pizza, href: "/menu" },
  { name: "Checkout", icon: ShoppingCart, href: "/checkout" },
  { name: "Tables", icon: ArmchairIcon, href: "/tables" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // Get the current route

  const hiddenRoutes = ["/auth/login", "/auth/signup", "/"];

  if (hiddenRoutes.includes(pathname)) return null;

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

  return (
    <div className="flex flex-col w-full">
      <div className="bg-yellow-400">
        {/* Top Navbar */}
        <header className="sticky top-0 z-50 w-full">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold text-[#00A082]">Foodie Eats</span>
              </Link>

              {/* User Button with Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center gap-2 bg-white rounded-full px-4 py-2 hover:shadow-md transition-shadow"
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
                    <Icon className="category-icon hover:scale-110 transition-transform transition-all duration-300 ease-in-out" />
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
