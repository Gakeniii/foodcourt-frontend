// src/app/checkout/checkout.jsx
"use client";

import { useEffect, useState } from 'react';
import './Checkout.css'; 
import { useCart } from '../context/CartContext';
import { useOutlet } from '../context/OutletContext';

export default function Checkout() {
  const { cartItems } = useCart();
  const { outlet } = useOutlet();
  const [userId, setUserId] = useState("");
  const [availableTables, setAvailableTables] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("Apple Pay"); 
  const [selectedTableNumber, setSelectedTableNumber] = useState("");
  const paymentMethods = ["Apple Pay", "M-Pesa", "Credit Card", "PayPal"];
  
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId || ""); 

    // Fetch available tables
    const fetchTables = async () => {
      try {
        const response = await fetch('https://foodcourt-db.onrender.com/bookings');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        const available = data.filter(table => table.availability);
        setAvailableTables(available);
      } catch (error) {
        console.error('Fetch error: ', error);
      }
    };

    fetchTables();
  }, []);
  
  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };
  
  const handleOrderConfirmation = async () => {
    const orderData = {
      customer_id: userId,
      created_at: new Date().toISOString(),
      order_items: cartItems.map(item => ({
        menu_item_id: item.id,
        menu_item_name: item.name,
        menu_item_image: item.image_url,
        menu_item_price: item.price,
        payment_method: paymentMethod,
        quantity: item.quantity,
        total_price: item.totalPrice,
      })),
      outlet_id: outlet.id,
      outlet_name: outlet.name,
      status: "Confirmed",
      table_booking_id: null,
      table_number: selectedTableNumber,
      total_price: cartItems.reduce((total, item) => total + item.totalPrice, 0),
    };
    try {
      const response = await fetch('https://foodcourt-db.onrender.com/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
      }

      const result = await response.json();
      console.log('Order confirmed:', result);
      // Handle the response as needed, such as showing a success message or redirecting the user
    } catch (error) {
      console.error('Order confirmation error:', error);
    }
  };
  
  return (
    <div className="checkoutContainer">
      <h1 className="checkoutTitle">Checkout Page</h1>
      {userId && <p className="userId">User ID: {userId}</p>}
      <div className="tableDropdownContainer">
        <label htmlFor="tableDropdown">Select Table:</label>
        <select
          id="tableDropdown"
          className="tableDropdown"
          value={selectedTableNumber}
          onChange={(e) => setSelectedTableNumber(e.target.value)}
        >
          {availableTables.map(table => (
            <option key={table.id} value={table.table_number}>
              Table {table.table_number}
            </option>
          ))}
        </select>
      </div>
      <div className="paymentDropdownContainer">
        <label htmlFor="paymentDropdown">Select Payment Method:</label>
        <select
          id="paymentDropdown"
          className="paymentDropdown"
          value={paymentMethod}
          onChange={handlePaymentMethodChange}
        >
          {paymentMethods.map(method => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
      </div>
      <div>
        {cartItems.length === 0 ? (
          <p>No items in the cart</p>
        ) : (
          <ul className="cartItemsList">
            {cartItems.map((item, index) => (
              <li key={index} className="cartItem">
                <img src={item.image_url} alt={item.name} />
                <div className="cartItemDetails">
                  <h2>{item.name}</h2>
                  <p><strong>Menu Item ID:</strong> {item.id}</p>
                  <p><strong>Restaurant:</strong> {item.outlet.name}</p>
                  <p><strong>Restaurant ID:</strong> {item.outlet.id}</p>
                  <p><strong>Category:</strong> {item.category}</p>
                  <p><strong>Cuisine:</strong> {item.cuisine}</p>
                  <p><strong>Price:</strong> KSh {item.price}</p>
                  <p><strong>Description:</strong> {item.description}</p>
                  <p><strong>Quantity:</strong> {item.quantity}</p>
                  <p><strong>Total Price:</strong> KSh {item.totalPrice}</p>
                  <p><strong>Payment Method:</strong> {paymentMethod}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button className="confirmOrderButton" onClick={handleOrderConfirmation}>Confirm Order</button>
    </div>
  );
}


