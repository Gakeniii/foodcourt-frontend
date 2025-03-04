// "use client";
// import { useEffect, useState } from "react";
// import Navbar from "../navbar";
// import { io } from "socket.io-client";


// export default function OrdersPage() {
//   const [orders, setOrders] = useState([]);
//   const [expandedOrder, setExpandedOrder] = useState(null);
//   const [alert, setAlert] = useState(null);
//   const [filterStatus, setFilterStatus] = useState("");
//   const [filteredOrders, setFilteredOrders] = useState([]);
//   const socket = io(process.env.NEXT_PUBLIC_BASE_URL);

//   const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await fetch(`${BASE_URL}/orders`);
//         if (!response.ok) throw new Error("Failed to fetch orders");
//         const data = await response.json();
//         setOrders(data);
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//       }
//     };
//     fetchOrders();

//     socket.on("order_status_update", (updatedOrder) => {
//       console.log("Order Updated:", updatedOrder);
//       setOrders((prevOrders) =>
//         prevOrders.map((order) =>
//           order.id === updatedOrder.order_id
//             ? { ...order, status: updatedOrder.status }
//             : order
//         )
//       );

//       setAlert(`✔ Order #${updatedOrder.order_id} has been ${updatedOrder.status}`);

//       setTimeout(() => {
//         setAlert(null);
//       }, 3000);
//     });

//     socket.on("cancel_order", (canceledOrder) => {
//       console.log("Order Canceled:", canceledOrder);
//       setOrders((prevOrders) =>
//         prevOrders.map((order) =>
//           order.id === canceledOrder.order_id
//             ? { ...order, status: "Cancelled" }
//             : order
//         )
//       );

//       setAlert(` Order #${canceledOrder.order_id} was canceled by the customer.`);

//       setTimeout(() => {
//         setAlert(null);
//       }, 3000);
//     });

//     return () => socket.disconnect();
//   }, []);

//   useEffect(() => {
//     if (!filterStatus) {
//       setFilteredOrders(orders);
//     } else {
//       setFilteredOrders(orders.filter((order) => order.status === filterStatus));
//     }
//   }, [filterStatus, orders]);

//   const toggleOrderDetails = (orderId) => {
//     setExpandedOrder(expandedOrder === orderId ? null : orderId);
//   };

//   const updatedOrderStatus = async (orderId, newStatus) => {
//     try {
//       const response = await fetch(`${BASE_URL}/orders/${orderId}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status: newStatus }),
//       });

//       if (!response.ok) throw new Error("Failed to update order status");

//       const data = await response.json();
//       console.log("Order status updated:", data);

//       socket.emit("order_status_update", { order_id: orderId, status: newStatus });

//     } catch (error) {
//       console.error(`Error confirming order to ${newStatus}`, error);
//     }
//   };

//   return (
//     <div className=" pt-20 p-6 py-4">
//       <Navbar />
//       {alert && (
//         <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3 transition-opacity duration-500 max-w-md w-full sm:w-auto">
//           <span className="text-2xl">✔</span>
//           <span className="text-lg font-semibold">{alert}</span>
//           <button
//             className="ml-auto text-white text-lg font-bold"
//             onClick={() => setAlert(null)}
//           >
//             ✖
//           </button>
//         </div>
//       )}

//       <h1 className="text-3xl font-bold mb-6">Orders</h1>

//       <div className="mb-4">
//         <label className="mr-2 font-semibold">Filter by Status:</label>
//         <select
//           className="border rounded-lg w-xl px-3 py-2"
//           value={filterStatus}
//           onChange={(e) => setFilterStatus(e.target.value)}
//         >
//           <option className="rounded-lg" value="">All</option>
//           <option className="text-gray-700" value="Pending">Pending</option>
//           <option className="text-yellow-700" value="Confirmed">Confirmed</option>
//           <option className="text-green-800" value="Completed">Completed</option>
//           <option className="text-red-700" value="Cancelled">Cancelled</option>
//         </select>
//       </div>

//       {/* Orders List */}
//       <ul className="divide-y divide-gray-300 bg-white shadow-md rounded-lg">
//         {filteredOrders.length > 0 ? (
//           filteredOrders.map((order) => (
//             <li
//               key={order.id}
//               className="p-4 cursor-pointer hover:bg-gray-100 transition duration-200"
//               onClick={() => toggleOrderDetails(order.id)}
//             >
//               <h3 className="text-lg font-semibold">Order No.{order.id}</h3>
//               <h2 className="text-gray-600">Status: {order.status}</h2>
//               <p className="text-gray-600">Total: Ksh {order.total_price}</p>

//               <div className="mt-4 p-3 bg-gray-50 rounded">
//                 <p className="text-gray-800 font-semibold">Table Number: {order.table_number}</p>

//                 <h3 className="mt-4 text-lg font-semibold">Ordered Items:</h3>
//                 <ul className="list-disc ml-5">
//                   {order.order_items?.length > 0 ? (
//                     order.order_items.map((item, index) => (
//                       <li key={index} className="text-gray-700">
//                         <span className="font-semibold">{item.menu_item_name || "Unknown Item"}</span>
//                         <span className="ml-2 text-sm text-gray-600">(Qty: {item.quantity})</span>
//                       </li>
//                     ))
//                   ) : (
//                     <p className="text-gray-500">No items found for this order.</p>
//                   )}
//                 </ul>

//                 {/* Confirm Order Button */}
//                 {order.status === "Pending" && (
//                   <button
//                     className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       updatedOrderStatus(order.id, "Confirmed");
//                     }}
//                   >
//                     Confirm Order
//                   </button>
//                 )}

//                 {/* Complete Order Button */}
//                 {order.status === "Confirmed" && (
//                   <button
//                     className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       updatedOrderStatus(order.id, "Completed");
//                     }}
//                   >
//                     Complete
//                   </button>
//                 )}

//                 {/* Cancel Order Button (Optional) */}
//                 {order.status !== "Cancelled" && order.status !== "Completed" && (
//                   <button
//                     className="mt-4 ml-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       updatedOrderStatus(order.id, "Cancelled");
//                     }}
//                   >
//                     Cancel Order
//                   </button>
//                 )}
//               </div>
//             </li>
//           ))
//         ) : (
//           <p className="text-center text-gray-500 p-4">No orders found for this status.</p>
//         )}
//       </ul>
//     </div>
//   );
// }


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

  const socket = io(process.env.NEXT_PUBLIC_BASE_URL);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${BASE_URL}/orders`);
        if (!response.ok) throw new Error("Failed to fetch orders");
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, [BASE_URL]);

  // Handle Order Updates from Backend
  useEffect(() => {
    const handleOrderUpdate = (updatedOrder) => {
      console.log("Order Updated:", updatedOrder);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === updatedOrder.order_id
            ? { ...order, status: updatedOrder.status }
            : order
        )
      );
      setAlert(`✔ Order #${updatedOrder.order_id} has been ${updatedOrder.status}`);
    };

    const handleOrderCancel = (canceledOrder) => {
      console.log("Order Canceled:", canceledOrder);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === canceledOrder.order_id
            ? { ...order, status: "Cancelled" }
            : order
        )
      );
      setAlert(`❌ Order #${canceledOrder.order_id} was canceled.`);
    };

    socket.on("order_status_update", handleOrderUpdate);
    socket.on("cancel_order", handleOrderCancel);

    return () => {
      socket.off("order_status_update", handleOrderUpdate);
      socket.off("cancel_order", handleOrderCancel);
    };
  }, [orders]);

  // Auto-hide alert after 3 seconds
  useEffect(() => {
    if (alert) {
      const timeout = setTimeout(() => {
        setAlert(null);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [alert]);

  // Update filtered orders when status filter changes
  useEffect(() => {
    setFilteredOrders(filterStatus ? orders.filter((order) => order.status === filterStatus) : orders);
  }, [filterStatus, orders]);

  // Toggle order details
  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Update order status & trigger alert
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${BASE_URL}/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update order status");

      const data = await response.json();
      console.log("Order status updated:", data);

      // Set alert message immediately after update
      setAlert(`✔ Order #${orderId} updated to ${newStatus}`);

      // Update local state immediately
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error(`Error updating order status to ${newStatus}:`, error);
    }
  };

  return (
    <div className="pt-20 p-6 py-4">
      <Navbar />

      {/* Alert Pop-up */}
      {alert && (
        <div className="fixed text-center pt-40 left-1/2 transform -translate-x-1/2 bg-gray-100 text-black px-6 py-3 rounded-lg shadow-lg z-50 flex gap-3 transition-opacity duration-500 opacity-100">
          <span className="text-2xl">✔</span>
          <span className="text-lg font-semibold">{alert}</span>
          {/* <button className="ml-auto text-white text-lg font-bold" onClick={() => setAlert(null)}>
            ✖
          </button> */}
        </div>
      )}

      <h1 className="text-3xl text-center text-gray-800 font-bold mb-6">Orders</h1>

      {/* Filter Orders */}
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

      {/* Orders List */}
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

                {/* Action Buttons */}
                {order.status === "Pending" && (
                  <button className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-full hover:bg-blue-700 transition" onClick={(e) => { e.stopPropagation(); updateOrderStatus(order.id, "Confirmed"); }}>
                    Confirm Order
                  </button>
                )}
                {order.status === "Confirmed" && (
                  <button className="mt-4 px-4 py-2 bg-green-900 text-white rounded-full hover:bg-green-700 transition" onClick={(e) => { e.stopPropagation(); updateOrderStatus(order.id, "Completed"); }}>
                    Complete
                  </button>
                )}
                {order.status !== "Cancelled" && order.status !== "Completed" && (
                  <button className="mt-4 ml-2 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition" onClick={(e) => { e.stopPropagation(); updateOrderStatus(order.id, "Cancelled"); }}>
                    Cancel Order
                  </button>
                )}
              </div>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-500 p-4">No orders found for this status.</p>
        )}
      </ul>
      <br></br>
      <br></br>
      <br></br>
    </div>
  );
}
