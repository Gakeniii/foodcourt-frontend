"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useSocket } from "../lib/hooks/useSocket";

export default function Orders() {
  const { data: session } = useSession();
  const { socket } = useSocket();
  const { orderUpdate } = useSocket();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [highlightedOrderId, setHighlightedOrderId] = useState(null);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    if (!session?.user?.id || !socket) return;
    console.log("Socket instance:", socket);

    const fetchOrders = async () => {
      try {
        console.log("Fetching orders for user ID:", session.user.id);
    
        const response = await fetch(`${BASE_URL}/orders`, {
          headers: {
            Authorization: `Bearer ${session?.accessToken || ""}`,
          },
        });
    
        if (!response.ok) {
          throw new Error(`Failed to fetch orders. Status: ${response.status}`);
        }
    
        const data = await response.json();
        if (!Array.isArray(data) || data.some(order => !order.id)) {
          throw new Error("Invalid order data received. Check backend response.");
        }
    
        const userOrders = data.filter(order => order.customer_id === session.user.id);
        console.log("Filtered orders:", userOrders);
    
        setOrders(userOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };
    

    fetchOrders();
    const storedOrderId = localStorage.getItem("order_id");
    if (storedOrderId) {
      setHighlightedOrderId(parseInt(storedOrderId));
    }

    if (socket){
      socket.on("order_status_update", (updatedOrder) => {
        console.log("Order Update Received:", updatedOrder);
        setOrders(prevOrders => prevOrders.map(order =>
          order.id === updatedOrder.order_id ? { ...order, status: updatedOrder.status } : order
        ));
      });
    }


    return () => socket.off("order_status_update");
  }, [session, socket]);

  const cancelOrder = async (orderId) => {
    try {
        const response = await fetch(`${BASE_URL}/orders/${orderId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session?.accessToken || ""}`,
            },
            body: JSON.stringify({ status: "Cancelled" }),
        });

        if (!response.ok) throw new Error("Failed to cancel order");

        // Emit the cancellation event to the owner
        socket.emit("cancel_order", { order_id: orderId });

        // Update order locally
        setOrders(prevOrders => prevOrders.map(order =>
            order.id === orderId ? { ...order, status: "Cancelled" } : order
        ));

    } catch (error) {
        console.error("Error cancelling order:", error);
    }
  };

  if (!session) {
    return <p className="text-gray-600">Please log in to view your orders.</p>;
  }

  const getEstimatedTime = () => {
    const minTime = 15;
    const maxTime = 30;
    return Math.floor(Math.random() * (maxTime - minTime + 1) + minTime);
  };

  if (loading) {
    return <p className="text-gray-600">Loading orders...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }


  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
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
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Order #{order.id} - {order.outlet_name}
              </h3>
              <h2 className="text-gray-700">
                <strong className="text-lg">Status:</strong> <span className="font-bold">{order.status}</span>
              </h2>
              
              {/* Estimated Serving Time */}
              {order.status === "Confirmed" && (
                <p className="text-green-600 font-medium mt-2">
                  🕒 Your order will be served in approximately {getEstimatedTime()} minutes.
                </p>
              )}

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
              {orderUpdate && orderUpdate.order_id === order.id && (
                <div className="bg-green-300 border border-green-500 p-2 rounded-md mt-4">
                  Order #{orderUpdate.order_id} as been <strong>{orderUpdate.status}</strong> ✔
                </div>
              )}
              
            <button
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              onClick={() => cancelOrder(order.id)}
              disabled={order.status === "Cancelled" || order.status === "Completed"}
            >
              {order.status === "Cancelled" ? "Cancelled" : "Cancel Order"}
            </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
