import React, { useState } from 'react';
import './QuantitySelector.css'; 

const QuantitySelector = ({ price }) => {
  const [quantity, setQuantity] = useState(1);

  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

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
