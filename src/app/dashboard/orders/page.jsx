"use client";
import { useEffect, useState } from "react";
import Navbar from "../navbar";
import { io } from "socket.io-client";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [alert, setAlert] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingOrderId, setLoadingOrderId] = useState(null); // Track loading state per order

  const socket = io(process.env.NEXT_PUBLIC_BASE_URL);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/orders`);
        if (!response.ok) throw new Error("Failed to fetch orders");
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [BASE_URL]);

  useEffect(() => {
    const handleOrderUpdate = (updatedOrder) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === updatedOrder.order_id
            ? { ...order, status: updatedOrder.status }
            : order
        )
      );
      setAlert(`✔ Order #${updatedOrder.order_id} has been ${updatedOrder.status}`);
      setLoadingOrderId(null); // Stop loading effect
    };

    const handleOrderCancel = (canceledOrder) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === canceledOrder.order_id
            ? { ...order, status: "Cancelled" }
            : order
        )
      );
      setAlert(`❌ Order #${canceledOrder.order_id} was canceled.`);
      setLoadingOrderId(null); // Stop loading effect
    };

    socket.on("order_status_update", handleOrderUpdate);
    socket.on("cancel_order", handleOrderCancel);

    return () => {
      socket.off("order_status_update", handleOrderUpdate);
      socket.off("cancel_order", handleOrderCancel);
    };
  }, [orders]);

  useEffect(() => {
    if (alert) {
      const timeout = setTimeout(() => {
        setAlert(null);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [alert]);

  useEffect(() => {
    setFilteredOrders(filterStatus ? orders.filter((order) => order.status === filterStatus) : orders);
  }, [filterStatus, orders]);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setLoadingOrderId(orderId); // Set loading for the specific order
    try {
      const response = await fetch(`${BASE_URL}/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update order status");

      const data = await response.json();
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      setAlert(`✔ Order #${orderId} updated to ${newStatus}`);
    } catch (error) {
      console.error(`Error updating order status to ${newStatus}:`, error);
    } finally {
      setLoadingOrderId(null); // Stop loading effect
    }
  };

  return (
    <div className="pt-20 p-6 py-4">
      <Navbar />

      {alert && (
        <div className="fixed justify-center text-center pt-20 left-1/2 transform -translate-x-1/2 bg-gray-100 text-gray-800 px-6 py-3 rounded-md shadow-lg z-50 flex gap-2 transition-opacity duration-500 opacity-100">
          <span className="text-lg font-semibold">{alert}</span>
        </div>
      )}

      <h1 className="text-3xl text-center text-gray-800 font-bold mb-6">Orders</h1>

      {loading && (
        <div className="text-center text-lg font-semibold text-gray-600">
          <p>Loading Orders...</p>
        </div>
      )}

      <div className="mb-4">
        <label className="mr-2 font-semibold">Filter by Status:</label>
        <select className="border rounded-lg w-xl px-3 py-2" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <ul className="divide-y divide-gray-300 bg-white shadow-md rounded-lg">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <li key={order.id} className="p-4 cursor-pointer hover:bg-gray-100 transition duration-200" onClick={() => toggleOrderDetails(order.id)}>
              <h3 className="text-lg font-semibold">Order No. {order.id}</h3>
              <h2 className="text-gray-600">Status: {order.status}</h2>
              <p className="text-gray-600">Total: Ksh {order.total_price}</p>

              <div className="mt-4 p-3 bg-gray-50 rounded">
                <p className="text-gray-800 font-semibold">Table Number: {order.table_number}</p>

                <h3 className="mt-4 text-lg font-semibold">Ordered Items:</h3>
                <ul className="list-disc ml-5">
                  {order.order_items?.length > 0 ? (
                    order.order_items.map((item, index) => (
                      <li key={index} className="text-gray-700">
                        <span className="font-semibold">{item.menu_item_name || "Unknown Item"}</span>
                        <span className="ml-2 text-sm text-gray-600">(Qty: {item.quantity})</span>
                      </li>
                    ))
                  ) : (
                    <p className="text-gray-500">No items found for this order.</p>
                  )}
                </ul>

                {order.status === "Pending" && (
                  <button
                    className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-full hover:bg-yellow-600 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateOrderStatus(order.id, "Confirmed");
                    }}
                    disabled={loadingOrderId === order.id}
                  >
                    {loadingOrderId === order.id ? "Processing..." : "Confirm Order"}
                  </button>
                )}
                {order.status === "Confirmed" && (
                  <button
                    className="mt-4 px-4 py-2 bg-green-900 text-white rounded-full hover:bg-green-700 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateOrderStatus(order.id, "Completed");
                    }}
                    disabled={loadingOrderId === order.id}
                  >
                    {loadingOrderId === order.id ? "Processing..." : "Complete"}
                  </button>
                )}
                {order.status !== "Cancelled" && order.status !== "Completed" && (
                  <button
                    className="mt-4 ml-2 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateOrderStatus(order.id, "Cancelled");
                    }}
                    disabled={loadingOrderId === order.id}
                  >
                    {loadingOrderId === order.id ? "Processing..." : "Cancel Order"}
                  </button>
                )}
              </div>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-500 p-4">No orders found for this status.</p>
        )}
      </ul>
    </div>
  );
}
