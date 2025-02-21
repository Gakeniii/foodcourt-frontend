import { useState } from 'react';

const QuantitySelector = ({ price }) => {
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  // const parsedPrice = parseFloat(price.replace(/[^0-9.-]+/g, ''));

  const handleButtonClick = (event) => {
    event.stopPropagation();
  };

  return (
    <div className="quantitySelector" onClick={handleButtonClick}>
      <button onClick={decreaseQuantity}>-</button>
      <span>{quantity}</span>
      <button onClick={increaseQuantity}>+</button>
      {/* <button className="addToCart">${(quantity * parsedPrice).toFixed(2)}</button> */}
    </div>
  );
};

export default QuantitySelector;
