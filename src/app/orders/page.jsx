"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function Orders() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [highlightedOrderId, setHighlightedOrderId] = useState(null);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchOrders = async () => {
      try {
        console.log("Fetching orders for user ID:", session.user.id);
    
        const response = await fetch(`http://localhost:5000/orders`, {
          headers: {
            Authorization: `Bearer ${session?.accessToken || ""}`,
          },
        });
    
        if (!response.ok) {
          throw new Error(`Failed to fetch orders. Status: ${response.status}`);
        }
    
        const data = await response.json();
        console.log("Fetched orders:", data); // Debugging output
    
        // Ensure orders have `id`
        if (!Array.isArray(data) || data.some(order => !order.id)) {
          throw new Error("Invalid order data received. Check backend response.");
        }
    
        // Filter orders for the current customer
        const userOrders = data.filter(order => order.customer_id === session.user.id);
        console.log("Filtered orders:", userOrders); // Debugging output
    
        setOrders(userOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };
    

    fetchOrders();
    // Retrieve the last placed order ID from localStorage
    const storedOrderId = localStorage.getItem("order_id");
    if (storedOrderId) {
      setHighlightedOrderId(parseInt(storedOrderId));
    }
  }, [session]);

  if (!session) {
    return <p className="text-gray-600">Please log in to view your orders.</p>;
  }

  if (loading) {
    return <p className="text-gray-600">Loading orders...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Your Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-600">No orders placed yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className={`p-6 rounded-lg shadow-md ${
                order.id === highlightedOrderId ? "bg-yellow-200 border-2 border-yellow-500" : "bg-gray-100"
              }`}
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Order #{order.id} - {order.outlet_name}
              </h2>
              <p className="text-gray-700">
                <strong>Status:</strong> <span className="font-bold">{order.status}</span>
              </p>
              <p className="text-gray-700">
                <strong>Table:</strong> {order.table_number || "N/A"}
              </p>
              <p className="text-gray-700">
                <strong>Payment Method:</strong> {order.payment_method}
              </p>
              <p className="text-gray-500 text-sm">
                <strong>Placed on:</strong> {new Date(order.created_at).toLocaleString()}
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mt-4">Items Ordered:</h3>
              <ul className="mt-2 space-y-3">
                {order.order_items.map((item, i) => (
                  <li key={i} className="flex items-center p-4 bg-white rounded-lg shadow">
                    <img src={item.menu_item_image} alt={item.menu_item_name} className="w-16 h-16 rounded object-cover" />
                    <div className="ml-4">
                      <p className="font-medium text-gray-800">{item.menu_item_name}</p>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-gray-800 font-medium">Total: KSh {item.total_price}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
