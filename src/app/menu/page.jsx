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
  const [flippedCards, setFlippedCards] = useState({});
  const [cuisines, setCuisines] = useState(['All']);
  const [categories, setCategories] = useState(['All']);

  useEffect(() => {
    async function fetchMenuItems() {
      try {
        const response = await fetch('/data/menu.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setMenuItems(data);
        const cuisines = ['All', ...new Set(data.map(item => item.cuisine))];
        const categories = ['All', ...new Set(data.map(item => item.category))];
        setCuisines(cuisines);
        setCategories(categories);
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

 
  const handleCardClick = (id) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
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
          {cuisines.map((cuisine, index) => (
            <option key={index} value={cuisine}>{cuisine}</option>
          ))}
        </select>
        <select value={selectedCategory} onChange={handleCategoryChange} className="categoryDropdown">
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
              className={`flip-card ${flippedCards[item.id] ? 'flipped' : ''}`}
              onClick={() => handleCardClick(item.id)}
            >
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <img src={item.image} alt={item.name} className="menuItemImage" />
                  <div className="menuItemDetails">
                    <div className="menuItemNamePrice">
                      <h2 className="menuItemName">{item.name}</h2>
                      <p className="menuItemPrice">{item.price}</p>
                    </div>
                    <p className="menuItemWaitingTime">Waiting Time: {item.waitingTime}</p>
                  </div>
                </div>
                <div className="flip-card-back">
                  <h2 className="menuItemName">{item.name}</h2>
                  <p><strong>Restaurant:</strong> {item.restaurant}</p>
                  <p><strong>Cuisine:</strong> {item.cuisine}</p>
                  <p><strong>Waiting Time:</strong> {item.waitingTime}</p>
                  <p className="menuItemPrice">{item.price}</p>
                  <QuantitySelector price={item.price} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu;
