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
      const orderData = {
        table_number: tableNumber, // Include the table number
        payment_method: paymentMethod, // Include the payment method
        order_items: cart.map((item) => ({
          menu_item_id: item.menu_item_id,
          quantity: item.quantity,
          price: item.total_price, // Include the price of each item
        })),
        total_price: order.totalPrice, //  total price
        status: "Pending", // Use the correct status value (capitalized)
      };

      console.log("Sending order data:", orderData); // Log the order data
      const response = await fetch("https://foodcourt-db.onrender.com/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
const responseText = await response.text();
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (jsonError) {
        console.error("Failed to parse JSON response:", responseText);
        throw new Error("Invalid response from the server. Please try again.");
      }

      if (!response.ok) {
        console.error("Backend response:", responseData); // Log the backend response
        throw new Error(
          responseData.error ||
            responseData.message ||
            `Failed to place order. Status: ${response.status}`
        );
      }
      localStorage.removeItem("cart");
      alert("Order placed successfully!");
      router.push("/order-confirmation"); // Replace with your desired route
    } catch (error) {
      console.error("Order Error:", error);
      setError(error.message); // Display the error message to the user
    } finally {
      setIsConfirming(false); // Re-enable the button
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
