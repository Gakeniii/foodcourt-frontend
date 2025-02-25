"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Checkout() {
  const [order, setOrder] = useState({ items: [], totalPrice: 0 });
  const [tableNumber, setTableNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [orderStatus, setOrderStatus] = useState("Pending");
  // const router = useRouter();
  const {data: session,status}= useSession()
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      const total = parsedCart.reduce((acc, item) => acc + item.total_price, 0);
      setOrder({ items: parsedCart, totalPrice: total });
    }
  }, []);

  const handleConfirm = async () => {
    try {
      console.log("Session Data:", session);
  
      if (!session || !session?.user) {
        alert("You need to log in before placing an order.");
        return;
      }
    
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
  
      if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
      }
  
      const orderData = {
        customer_id: session?.user?.id,
        order_items: cart.map(item => ({
          menu_item_id: item.menu_item_id,
          quantity: item.quantity
        })),
        status: "pending"
      };
  
      console.log("Order Data to be sent:", JSON.stringify(orderData, null, 2));
  
      const response = await fetch("https://foodcourt-db.onrender.com/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
  
      const responseData = await response.json();
      console.log("Order Response:", responseData);
  
      if (!response.ok) {
        throw new Error(responseData.message || "Failed to place order");
      }
  
      localStorage.removeItem("cart");
      alert("Order placed successfully!");
    } catch (error) {
      console.error("Order Error:", error);
      alert(error.message || "Failed to place order. Please try again.");
    }
  };
  
  if (status === "loading") {
    return <p>Loading session...</p>;
  }
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>

      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 mt-6">
        <h2 className="text-2xl font-semibold mb-4">Your Order</h2>
        {order.items.length === 0 ? (
          <p className="text-gray-600">No items in cart.</p>
        ) : (
          <ul>
            {order.items.map((item, index) => (
              <li key={index} className="border-b py-2 flex justify-between">
                <span>{item.quantity}x {item.menu_item_name}</span>
                <span>KSh {item.total_price}</span>
              </li>
            ))}
          </ul>
        )}
        <h3 className="text-xl font-semibold mt-4">Total: KSh {order.totalPrice}</h3>
      </div>

      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 mt-6">
        <label className="block mb-2">Table Number:</label>
        <input
          type="text"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          className="border p-2 w-full mb-4"
        />

        <label className="block mb-2">Payment Method:</label>
        <input
          type="text"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="border p-2 w-full mb-4"
        />

        <button
          className={`w-full py-2 text-white rounded-lg ${
            isConfirming ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"
          }`}
          onClick={handleConfirm}
          disabled={isConfirming}
        >
          {isConfirming ? "Confirming..." : "Confirm Order"}
        </button>
      </div>
    </div>
  );
}
