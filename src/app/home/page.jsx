"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import './home.css';

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [error, setError] = useState(''); 
  const [menuItems, setMenuItems] = useState([]); 

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const response = await fetch('https://foodcourt-db.onrender.com/outlets');
        if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
        const data = await response.json();
        setRestaurants(data);
      } catch (error) {
        console.error('Fetch error:', error);
        setError(`Failed to load restaurants: ${error.message}`);
      }
    }
    fetchRestaurants();
  }, []);

  const fetchMenuItems = async (restaurantId) => {
    try {
      const response = await fetch(`https://foodcourt-db.onrender.com/outlets/${restaurantId}`);
      if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
      const data = await response.json();
      setMenuItems(data.menu_items); 
    } catch (error) {
      console.error('Fetch error:', error);
      setError(`Failed to load menu items: ${error.message}`);
    }
  };

  const handleCardClick = (restaurant) => {
    setSelectedRestaurant(restaurant); 
    fetchMenuItems(restaurant.id); 
  };

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="homeContainer">
      <h1 className="welcomeMessage">Welcome to Foodcourt!</h1>
      <div className="searchBarContainer">
        <input
          type="text"
          className="searchBar"
          placeholder="Search for restaurants..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="restaurantContainer">
        <div className="cardContainer">
          {filteredRestaurants.map((restaurant) => (
            <div key={restaurant.id} className="card" onClick={() => handleCardClick(restaurant)}>
              <img src={restaurant.image_url} alt={restaurant.name} className="cardImage" />
              <div className="cardName">{restaurant.name}</div>
            </div>
          ))}
        </div>
      </div>
      {selectedRestaurant && (
        <div className="modal">
          <div className="modalContent">
            <span className="closeButton" onClick={() => setSelectedRestaurant(null)}>&times;</span>
            <h2 className="modalTitle">{selectedRestaurant.name} Menu</h2>
            <div className="modalMenuItemsContainer">
              {menuItems.map((item) => (
                <div key={item.id} className="modalMenuItem">
                  <h3 className="modalMenuItemName">{item.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
