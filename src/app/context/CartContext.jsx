// src/app/context/CartContext.js
"use client";

import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addItemToCart = (item) => {
    setCartItems((prevItems) => [...prevItems, item]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addItemToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

// CartContext.js
// import { createContext, useContext, useState } from 'react';

// const CartContext = createContext();

// export const useCart = () => useContext(CartContext);

// export const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState([]);
//   const [orders, setOrders] = useState([]);

//   const addItemToCart = (item) => {
//     setCart((prevCart) => [...prevCart, item]);
//   };

//   const placeOrder = async () => {
//     // Logic to place the order (e.g., sending the data to the server)
//     // After placing the order, update the orders list
//     setOrders([...orders, ...cart]);  // Example: adding current cart items to orders
//     setCart([]); // Clear the cart after placing the order
//   };

//   const getTotalPrice = () => {
//     return cart.reduce((total, item) => total + item.totalPrice, 0);
//   };

//   return (
//     <CartContext.Provider value={{ cart, orders, addItemToCart, placeOrder, getTotalPrice }}>
//       {children}
//     </CartContext.Provider>
//   );
// };

