"use client";

import { useEffect, useState } from 'react';
import '../menu/menu.css'; 
import QuantitySelector from '../QuantitySelector/QuantitySelector';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // State for popup message

  useEffect(() => {
    async function fetchMenuItems() {
      try {
        const response = await fetch('https://foodcourt-db.onrender.com/menu_items');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        setError('Failed to load menu items');
        console.error('Fetch error: ', error);
      } finally {
        setLoading(false);
      }
    }
    fetchMenuItems();
  }, []);

  const openModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  const addToCart = async (item) => {
    try {
      const response = await fetch('https://foodcourt-db.onrender.com/order_items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          menu_item_id: item.id,
          menu_item_name: item.name,
          order_details: {
            customer_id: 13, 
            customer_name: 'Veronica Boyle', 
            status: 'Pending',
            table_number: 7 
          },
          outlet_name: item.outlet.name,
          payment_method: 'Card', 
          quantity: 1, 
          total_price: item.price 
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error('Error:', errorMessage);
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(`Added ${item.name} to cart`, data);
      setShowPopup(true); 
      setTimeout(() => setShowPopup(false), 3000);
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };
  return (
    <div className="menuContainer">
      <h1 className="menuTitle">Menu</h1>
      {loading ? (
        <p>Loading menu items...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="menuItemsContainer">
          {menuItems.map((item) => (
            <div 
              key={item.id} 
              className="menuItemCard" 
              onClick={() => openModal(item)}
              style={{ cursor: 'pointer' }} 
            >
              <img src={item.image_url} alt={item.name} className="menuItemImage" />
              <div className="menuItemDetails">
                <h2 className="menuItemName">{item.name}</h2>
                <p className="menuItemWaitingTime">Waiting Time: {item.waiting} minutes</p>
                <p className="menuItemPrice">KSh {item.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {isModalOpen && selectedItem && (
        <div className="modal" onClick={closeModal}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <div className="modalImageContainer">
              <img src={selectedItem.image_url} alt={selectedItem.name} className="modalImage" />
            </div>
            <div className="modalDetails">
              <h2>{selectedItem.name}</h2>
              <p><strong>Restaurant:</strong> {selectedItem.outlet.name}</p>
              <p><strong>Category:</strong> {selectedItem.category}</p>
              <p><strong>Cuisine:</strong> {selectedItem.cuisine}</p>
              <p><strong>Description:</strong> {selectedItem.description}</p>
              <p><strong>Price:</strong> KSh {selectedItem.price}</p>
              <QuantitySelector price={selectedItem.price} />
              <button className="addToCartButton" onClick={() => addToCart(selectedItem)}>Add to Cart</button>
            </div>
            <span className="close" onClick={closeModal}>&times;</span>
          </div>
        </div>
      )}
      {showPopup && (
        <div className="popupMessage">
          <p>Item added to cart!</p>
        </div>
      )}
    </div>
  );
};

export default Menu;

