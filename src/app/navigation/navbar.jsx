"use client"
import Link from 'next/link';
import './navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <span className="logoName">Foodie Eats</span>
      </div>
      <ul className="navList">
        <li className="navItem">
          <Link href="/home">Home</Link>
        </li>
        <li className="navItem">
          <Link href="/menu">Menu</Link>
        </li>
        <li className="navItem">
          <Link href="/tables">Tables</Link>
        </li>
        <li className="navItem">
          <Link href="/checkout">Checkout</Link>
        </li>
        <li className="navItem">
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li className="navItem">
          <Link href="/logout">Logout</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;


// "use client"
// import Link from 'next/link';
// import { useState } from 'react';
// import { FaUserCircle, FaHome, FaUtensils, FaChair, FaShoppingCart, FaTachometerAlt } from 'react-icons/fa';
// import './navbar.css';

// const Navbar = () => {
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   return (
//     <div>
//       {/* Top Navbar */}
//       <nav className="bg-white shadow-md p-4 flex justify-between items-center">
//         <span className="text-xl font-bold text-brown-800">Foodcourt</span>
//         <div className="relative">
//           <button
//             className="flex items-center space-x-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
//             onClick={() => setDropdownOpen(!dropdownOpen)}
//           >
//             <FaUserCircle className="text-2xl text-gray-600" />
//             <span>John Doe</span>
//           </button>
//           {dropdownOpen && (
//             <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
//               <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
//               <Link href="/logout" className="block px-4 py-2 hover:bg-gray-100">Logout</Link>
//             </div>
//           )}
//         </div>
//       </nav>

//       {/* Bottom Navbar */}
//       <nav className="bg-gray-100 shadow-md p-3 flex justify-center space-x-6">
//         <Link href="/home" className="flex flex-col items-center text-gray-600 hover:text-orange-500">
//           <FaHome className="text-2xl" />
//           <span className="text-sm">Home</span>
//         </Link>
//         <Link href="/menu" className="flex flex-col items-center text-gray-600 hover:text-orange-500">
//           <FaUtensils className="text-2xl" />
//           <span className="text-sm">Menu</span>
//         </Link>
//         <Link href="/tables" className="flex flex-col items-center text-gray-600 hover:text-orange-500">
//           <FaChair className="text-2xl" />
//           <span className="text-sm">Tables</span>
//         </Link>
//         <Link href="/checkout" className="flex flex-col items-center text-gray-600 hover:text-orange-500">
//           <FaShoppingCart className="text-2xl" />
//           <span className="text-sm">Checkout</span>
//         </Link>
//         <Link href="/dashboard" className="flex flex-col items-center text-gray-600 hover:text-orange-500">
//           <FaTachometerAlt className="text-2xl" />
//           <span className="text-sm">Dashboard</span>
//         </Link>
//       </nav>
//     </div>
//   );
// };

// export default Navbar;
