"use client";

import { useCart } from '../context/CartContext';

export default function Checkout() {
  const { cartItems } = useCart();

  return (
    <div>
      <h1>Checkout Page</h1>
      <div>
        {cartItems.length === 0 ? (
          <p>No items in the cart</p>
        ) : (
          <ul>
            {cartItems.map((item, index) => (
              <li key={index}>
                <h2>{item.name}</h2>
                <p><strong>Restaurant:</strong> {item.outlet.name}</p>
                <p><strong>Category:</strong> {item.category}</p>
                <p><strong>Cuisine:</strong> {item.cuisine}</p>
                <p><strong>Price:</strong> KSh {item.price}</p>
                <p><strong>Description:</strong> {item.description}</p>
                <p><strong>Quantity:</strong> {item.quantity}</p>
                <p><strong>Total Price:</strong> KSh {item.totalPrice}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
