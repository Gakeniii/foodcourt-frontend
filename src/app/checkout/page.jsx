"use client";
import { useState } from "react";


export default function Checkout() {
  const [isConfirming, setIsConfirming] = useState(false);
  const [orderStatus, setOrderStatus] = useState("Order Placed");

  // Sample order data
  const order = {
    customerName: "John Doe",
    restaurantName: "Spicy Bites",
    items: [
      { foodName: "Chicken Biryani", price: 1200, table: 5, status: orderStatus },
      { foodName: "Mango Lassi", price: 300, table: 5, status: orderStatus },
    ],
    totalPrice: 1500,
    waitingTime: "25 mins",
    paymentMethod: "Credit Card",
  };

  // Handle confirm button click
  const handleConfirm = () => {
    setIsConfirming(true);
    setOrderStatus("Confirmed");

    setTimeout(() => {
      setOrderStatus("Served");
      setIsConfirming(false);
    }, 3000); // Simulating order processing delay
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
      {/* Checkout Card */}
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 mt-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Order Summary
        </h2>

        {/* Customer Details */}
        <div className="mb-4">
          <p className="text-lg font-semibold text-gray-700">
            Customer: <span className="font-normal">{order.customerName}</span>
          </p>
          <p className="text-lg font-semibold text-gray-700">
            Restaurant: <span className="font-normal">{order.restaurantName}</span>
          </p>
        </div>

        {/* Order Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 text-left">Food Name</th>
                <th className="p-2 text-left">Table</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-right">Price (KSh)</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2">{item.foodName}</td>
                  <td className="p-2">{item.table}</td>
                  <td className="p-2">{orderStatus}</td>
                  <td className="p-2 text-right">{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Order Summary */}
        <div className="mt-4 border-t pt-4">
          <p className="text-lg font-semibold text-gray-700">
            Waiting Time: <span className="font-normal">{order.waitingTime}</span>
          </p>
          <p className="text-lg font-semibold text-gray-700">
            Payment Method: <span className="font-normal">{order.paymentMethod}</span>
          </p>
          <p className="text-xl font-bold text-gray-800 mt-2">
            Total: KSh {order.totalPrice}
          </p>
        </div>

        {/* Confirm Order Button */}
        <button
          className={`w-full mt-6 py-3 text-white font-bold rounded-lg transition ${
            isConfirming
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          onClick={handleConfirm}
          disabled={isConfirming}
        >
          {isConfirming ? "Processing..." : "Confirm Order"}
        </button>
      </div>
    </div>
  );
}
