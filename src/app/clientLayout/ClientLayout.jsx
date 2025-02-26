// src/app/clientLayout/ClientLayout.jsx
"use client";

import { useCart } from '../context/CartContext'; // Adjust the path if necessary
import Navbar from '../navigation/navbar'; // Adjust the path if necessary

export default function ClientLayout({ children }) {
  const { cartItems } = useCart();

  return (
    <>
      <Navbar cartItems={cartItems} /> {/* Pass cartItems as a prop */}
      {children}
    </>
  );
}
