"use client";
import { useEffect, useState } from "react";
import Navbar from "../navbar";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    // Fetch orders from backend
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/orders");
        if (!response.ok) throw new Error("Failed to fetch orders");
        const data = await response.json();
        console.log("Fetched Orders:", data);
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="p-6">
      <Navbar/>
      <h1 className="text-3xl font-bold mb-6">Orders</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition duration-200"
            onClick={() => toggleOrderDetails(order.id)}
          >
            <h2 className="text-lg font-semibold">Order #{order.id}</h2>
            <p className="text-gray-600">Status: {order.status}</p>
            <p className="text-gray-600">Total: Ksh {order.total_price}</p>

            <div className="mt-4 p-4 bg-gray-100 rounded">
              <p className="text-gray-800 font-semibold">Customer: {order.customer_name}</p>
              <p className="text-gray-800 font-semibold">Table Number: {order.table_number}</p>

              {/* Ordered Items Section */}
              <h3 className="mt-4 text-lg font-semibold">Ordered Items:</h3>
              <ul className="list-disc ml-4">
              {order.order_items?.length > 0 ? (
                order.order_items.map((item, index) => (
                  <li key={index} className="text-gray-700">
                    🍽 <span className="font-semibold">{item.menu_item?.name || "Unknown Item"}</span>  
                    <span className="ml-2 text-sm text-gray-600">(Qty: {item.quantity})</span>
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No items found for this order.</p>
              )}

              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
