"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Checkout() {
  const [order, setOrder] = useState({ items: [], totalPrice: 0 });
  const [tableNumber, setTableNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState(null); // New state for error messages
  const router = useRouter();
   useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const table = queryParams.get("table");
    if (table) {
      setTableNumber(table);
    }

    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      const total = parsedCart.reduce((acc, item) => acc + item.total_price, 0);
      setOrder({ items: parsedCart, totalPrice: total });
    }
  }, []);
const handleConfirm = async () => {
    setIsConfirming(true); // Disable the button and show "Confirming..." text
    setError(null); // Clear any previous errors

    try {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
       if (cart.length === 0) {
        alert("Your cart is empty!");
        setIsConfirming(false); // Re-enable the button
        return;
      }
