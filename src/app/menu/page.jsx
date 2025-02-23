"use client";

import { useEffect, useState } from 'react';
import '../menu/menu.css'; 
import QuantitySelector from '../QuantitySelector/QuantitySelector';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cuisines, setCuisines] = useState(['All']);
  const [categories, setCategories] = useState(['All']);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchMenuItems() {
      try {
        const response = await fetch('https://foodcourt-db.onrender.com/menu_items');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setMenuItems(data);
        setCuisines(['All', ...new Set(data.map(item => item.cuisine))]);
        setCategories(['All', ...new Set(data.map(item => item.category))]);
      } catch (error) {
        setError('Failed to load menu items');
        console.error('Fetch error: ', error);
      } finally {
        setLoading(false);
      }
    }
    fetchMenuItems();
  }, []);
  const handleSearchChange = (event) => setSearchQuery(event.target.value);
  const handleCuisineChange = (event) => setSelectedCuisine(event.target.value);
  const handleCategoryChange = (event) => setSelectedCategory(event.target.value);

  const openModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  const addToCart = (item) => {
    // Add your add-to-cart logic here
    console.log(`Added ${item.name} to cart`);
  };

  const filteredMenuItems = menuItems
    .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((item) => selectedCuisine === 'All' || item.cuisine === selectedCuisine)
    .filter((item) => selectedCategory === 'All' || item.category === selectedCategory);

  return (
    <div className="menuContainer">
      <h1 className="menuTitle">Menu</h1>
      <div className="filtersContainer">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="searchBar"
        />
        <select value={selectedCuisine} onChange={handleCuisineChange} className="cuisineDropdown">
          <option value="All" disabled hidden>Cuisine</option>
          {cuisines.map((cuisine, index) => (
            <option key={index} value={cuisine}>{cuisine}</option>
          ))}
        </select>
        <select value={selectedCategory} onChange={handleCategoryChange} className="categoryDropdown">
          <option value="All" disabled hidden>Category</option>
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
              <p><strong>Restaurant:</strong> {selectedItem.outlet.name}</p>
              <p><strong>Category:</strong> {selectedItem.category}</p>
              <p><strong>Cuisine:</strong> {selectedItem.cuisine}</p>
              <p><strong>Price:</strong> KSh {selectedItem.price}</p>
              <QuantitySelector price={selectedItem.price} />
              <button className="addToCartButton" onClick={() => addToCart(selectedItem)}>Add to Cart</button>
            </div>
            <span className="close" onClick={closeModal}>&times;</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;


