"use client";

import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useOutlet } from '../context/Outlet';
import AvailableTables from '../AvailableTable/page';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';


export default function Checkout() {
  const { data: session } = useSession();
  const { cartItems, clearCart } = useCart();
  const { selectedOutlet } = useOutlet();
  const [selectedTableNumber, setSelectedTableNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("M-Pesa");
  const paymentMethods = ["Apple Pay", "M-Pesa", "Card", "Cash"];
  const router = useRouter();

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  // useEffect(() => {
  //   if (!session) {
  //     window.location.href = "/auth/login";
  //   }
  // }, [session]);


  const handleTableSelect = (tableNumber) => {
    setSelectedTableNumber(tableNumber);
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleOrderConfirmation = async () => {
    if (!selectedOutlet) {
      alert("Please select an outlet before placing your order.");
      return;
    }
  
    const orderData = {
      customer_id: session?.user?.id,
      outlet_id: selectedOutlet.id,
      order_items: (cartItems ?? []).map(item => ({
        menu_item_id: item.id,
        menu_item_name: item.name,
        menu_item_image: item.image_url,
        menu_item_price: item.price,
        payment_method: paymentMethod,
        quantity: item.quantity,
        total_price: item.totalPrice,
      })),
      outlet_name: selectedOutlet.name,
      status: "Confirmed",
      table_number: selectedTableNumber,
    };
  
    try {
      const response = await fetch(`${BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(orderData),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
      }
  
      const orderResponse = await response.json();
      console.log("Order Response:", orderResponse);

      clearCart();

      localStorage.setItem("order_id", orderResponse.id);
      alert('Order placed successfully!');
      router.push(`/orders`);
    } catch (error) {
      console.error('Order confirmation error:', error);
      alert('Failed to place order. Please try again.');
    }
  };
  

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Checkout Page</h1>

      <div className="mt-4">
        <label htmlFor="paymentDropdown" className="block font-medium text-gray-700">Select Payment Method:</label>
        <select
          id="paymentDropdown"
          className="mt-2 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
          value={paymentMethod}
          onChange={handlePaymentMethodChange}
        >
          {paymentMethods.map(method => (
            <option key={method} value={method}>{method}</option>
          ))}
        </select>
      </div>

      <div className="mt-6">
        {cartItems.length === 0 ? (
          <p className="text-gray-600">No items in the cart</p>
        ) : (
          <ul className="space-y-4">
            {cartItems.map((item, index) => (
              <li key={index} className="flex items-center p-4 bg-gray-100 rounded-lg shadow">
                <img src={item.image_url} alt={item.name} className="w-16 h-16 rounded object-cover" />
                <div className="ml-4">
                  <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                  <p className="text-gray-600">Category: {item.category}</p>
                  <p className="text-gray-600">Cuisine: {item.cuisine}</p>
                  <p className="text-gray-800 font-medium">Price: KSh {item.price}</p>
                  <p className="text-gray-800 font-medium">Quantity: {item.quantity}</p>
                  <p className="text-gray-800 font-medium">Total Price: KSh {item.totalPrice}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <h2 className="text-lg font-medium mb-2 ">Select a Table</h2>
      <AvailableTables onSelectTable={handleTableSelect} className="bg-gray-100 rounded-lg shadow-md hover:bg-gray-200"/>

      <button
        className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        onClick={handleOrderConfirmation}
      >
        Confirm Order
      </button>
    </div>
  );
}
