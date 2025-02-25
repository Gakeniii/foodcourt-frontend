"use client";

// import './Checkout.css'; 
// import { useCart } from '../context/CartContext';

// export default function Checkout() {
//   const { cartItems } = useCart();

//   return (
//     <div className="checkoutContainer">
//       <h1 className="checkoutTitle">Checkout Page</h1>
//       <div>
//         {cartItems.length === 0 ? (
//           <p>No items in the cart</p>
//         ) : (
//           <ul className="cartItemsList">
//             {cartItems.map((item, index) => (
//               <li key={index} className="cartItem">
//                 <img src={item.image_url} alt={item.name} />
//                 <div className="cartItemDetails">
//                   <h2>{item.name}</h2>
//                   <p><strong>Menu Item ID:</strong> {item.id}</p> {/* Display menu item ID */}
//                   <p><strong>Restaurant:</strong> {item.outlet.name}</p>
//                   <p><strong>Restaurant ID:</strong> {item.outlet.id}</p>
//                   <p><strong>Category:</strong> {item.category}</p>
//                   <p><strong>Cuisine:</strong> {item.cuisine}</p>
//                   <p><strong>Price:</strong> KSh {item.price}</p>
//                   <p><strong>Description:</strong> {item.description}</p>
//                   <p><strong>Quantity:</strong> {item.quantity}</p>
//                   <p><strong>Total Price:</strong> KSh {item.totalPrice}</p>
//                 </div>
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Checkout() {
  const { cartItems } = useCart();
  const [order, setOrder] = useState({ items: [], totalPrice: 0 });
  const [tableNumber, setTableNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [orderStatus, setOrderStatus] = useState("Pending");
  // const router = useRouter();
  const {data: session,status}= useSession()
  console.log("Session for checkout", session)

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
  
      if (!session || !session.user) {
        alert("You need to log in before placing an order.");
        return;
      }
  
      console.log("Session User ID:", session.user.id); 
  
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
  
      if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
      }

      const customerid = localStorage.getItem("userId", user.id)
  
      const orderData = {
        customer_id: customerid,
        order_items: cart.map(item => ({
          menu_item_id: item.menu_item_id,
          quantity: item.quantity
        })),
        status: "pending"
      };
      console.log("session", session?.user.id)
  
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
