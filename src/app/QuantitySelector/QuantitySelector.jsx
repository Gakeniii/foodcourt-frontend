import React, { useState, useEffect } from 'react';
import './QuantitySelector.css'; 

const QuantitySelector = ({ price, onQuantityChange }) => {
  const [quantity, setQuantity] = useState(1);

  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  useEffect(() => {
    onQuantityChange(quantity, price * quantity);
  }, [quantity, price, onQuantityChange]);

  return (
    <div className="quantitySelector">
      <button onClick={decrementQuantity}>-</button>
      <span>{quantity}</span>
      <button onClick={incrementQuantity}>+</button>
      <span className="totalPrice">Total: KSh {price * quantity}</span>
    </div>
  );
};

export default QuantitySelector;
