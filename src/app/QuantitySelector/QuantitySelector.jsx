import { useState } from 'react';

const QuantitySelector = ({ price }) => {
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  const handleButtonClick = (event) => {
    event.stopPropagation();
  };


  const formatPrice = (price, quantity) => {
    return `KSh ${(quantity * price).toFixed(2)}`;
  };

  return (
    <div className="quantitySelector" onClick={handleButtonClick}>
      <button onClick={decreaseQuantity}>-</button>
      <span>{quantity}</span>
      <button onClick={increaseQuantity}>+</button>
      <button className="addToCart">{formatPrice(price, quantity)}</button>
    </div>
  );
};

export default QuantitySelector;
