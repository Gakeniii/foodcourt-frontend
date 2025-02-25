"use client";

import './Checkout.css'; 
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const { cartItems } = useCart();

  return (
    <div className="checkoutContainer">
      <h1 className="checkoutTitle">Checkout Page</h1>
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
                  <p><strong>Menu Item ID:</strong> {item.id}</p> {/* Display menu item ID */}
                  <p><strong>Restaurant:</strong> {item.outlet.name}</p>
                  <p><strong>Restaurant ID:</strong> {item.outlet.id}</p>
                  <p><strong>Category:</strong> {item.category}</p>
                  <p><strong>Cuisine:</strong> {item.cuisine}</p>
                  <p><strong>Price:</strong> KSh {item.price}</p>
                  <p><strong>Description:</strong> {item.description}</p>
                  <p><strong>Quantity:</strong> {item.quantity}</p>
                  <p><strong>Total Price:</strong> KSh {item.totalPrice}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
