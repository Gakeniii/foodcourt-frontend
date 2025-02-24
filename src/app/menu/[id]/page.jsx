"use client";

import { useEffect, useState } from 'react';
import './page.css'; 
// import QuantitySelector from '../QuantitySelector/QuantitySelector';

export default function Page({ params }) {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false); 

  useEffect(() => {
    async function fetchRestaurant() {
      const { id } = await params;
      try {
        const response = await fetch(`https://foodcourt-db.onrender.com/outlets/${id}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setRestaurant(data);
        setCategories(['All', ...new Set(data.menu_items.map(item => item.category))]);
      } catch (error) {
        setError('Failed to load restaurant details');
        console.error('Fetch error: ', error);
      } finally {
        setLoading(false);
      }
    }
    fetchRestaurant();
  }, [params]);

  const handleSearchChange = (event) => setSearchQuery(event.target.value);
  const handleCategoryChange = (event) => setSelectedCategory(event.target.value);
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

  const filteredMenuItems = restaurant?.menu_items
    .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((item) => selectedCategory === 'All' || item.category === selectedCategory);
    return (
      <div className="menuContainer">
        {restaurant?.image_url && (
          <img src={restaurant.image_url} alt={`${restaurant.name} Banner`} className="restaurantBanner" />
        )}
        <h1 className="menuTitle">{restaurant?.name} Menu</h1>
        <div className="filtersContainer">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="searchBar"
          />
          <select value={selectedCategory} onChange={handleCategoryChange} className="categoryDropdown">
            <option value="All">Category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
        </div>
        {loading ? (
          <p>Loading menu items...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div className="menuItemsContainer">
            {filteredMenuItems.map((item) => (
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
                  <button className="addToCart" onClick={(e) => { e.stopPropagation(); openModal(item); }}>+</button>
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
                {selectedItem.outlet && (
                  <p><strong>Restaurant:</strong> {selectedItem.outlet.name}</p>
                )}
                <p><strong>Category:</strong> {selectedItem.category}</p>
                <p><strong>Cuisine:</strong> {selectedItem.cuisine}</p>
                <p><strong>Description:</strong> {selectedItem.description}</p>
                <p><strong>Price:</strong> KSh {selectedItem.price}</p>
                {/* <QuantitySelector price={selectedItem.price} /> */}
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
  }
  

