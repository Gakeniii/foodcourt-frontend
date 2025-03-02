
"use client";
import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      // Check if the item already exists to update quantity & total price.
      const existing = prevItems.find((i) => i.id === item.id);
      if (existing) {
        return prevItems.map((i) =>
          i.id === item.id
            ? { 
                ...i, 
                quantity: (i.quantity || 1) + (item.quantity || 1), 
                totalPrice: (i.totalPrice || i.price) + item.totalPrice 
              }
            : i
        );
      }
      // Otherwise, add as a new item.
      return [...prevItems, { ...item, quantity: item.quantity || 1, totalPrice: item.totalPrice || item.price }];
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };


  return (
    <CartContext.Provider value={{ cartItems, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

