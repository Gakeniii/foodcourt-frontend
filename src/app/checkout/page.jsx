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

      // Prepare the order data to send to the backend
      const orderData = {
        table_number: tableNumber, // Include the table number
        payment_method: paymentMethod, // Include the payment method
        order_items: cart.map((item) => ({
          menu_item_id: item.menu_item_id,
          quantity: item.quantity,
          price: item.total_price, // Include the price of each item
        })),
        total_price: order.totalPrice, // Include the total price
        status: "Pending", // Use the correct status value (capitalized)
      };

      console.log("Sending order data:", orderData); // Log the order data

      // Send the order to the backend API
      const response = await fetch("https://foodcourt-db.onrender.com/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      // Check if the response is valid JSON
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

      // Clear the cart and show a success message
      localStorage.removeItem("cart");
      alert("Successful!");

      // Redirect the user to a confirmation page or home page
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

      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 mt-6">
        <h2 className="text-2xl font-semibold mb-4">Your Order</h2>
        {order.items.length === 0 ? (
          <p className="text-gray-600">No items in cart.</p>
        ) : (
          <ul>
            {order.items.map((item, index) => (
              <li key={index} className="border-b py-2 flex justify-between">
                <span>
                  {item.quantity}x {item.menu_item_name}
                </span>
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
          readOnly
        />

        <label className="block mb-2">Payment Method:</label>
        <input
          type="text"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="border p-2 w-full mb-4"
          placeholder="Enter payment method (e.g., Cash, Card)"
        />

        {error && <p className="text-red-500 mb-4">{error}</p>} {/* Display error message */}

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
