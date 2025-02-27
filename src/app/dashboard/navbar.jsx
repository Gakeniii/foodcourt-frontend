"use client"

import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="flex flex-col w-full bg-slate-800 text-white font-medium p-4 shadow-md ">
      <div className="flex justify-between w-full items-center px-4">
        <Link href="/dashboard" className="hover:text-gray-300">Dashboard</Link>
        <Link href="/dashboard/orders" className="hover:text-gray-300">Orders</Link>
        <Link href="/dashboard/outlet/:id" className="hover:text-gray-300">Outlet</Link>
        <Link href="/dashboard/tables" className="hover:text-gray-300">Tables</Link>
      </div>
    </nav>
  );
};

export default Navbar;