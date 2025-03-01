"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import './home.css';
import { useSession } from 'next-auth/react';

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [cuisines, setCuisines] = useState(['All']);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [error, setError] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [tables, setTables] = useState([]);
  const [loadingTables, setLoadingTables] = useState(true);

  const { data: session, status } = useSession();

  console.log("Session Data:", session)

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const response = await fetch('http://127.0.0.1:5000/outlets');
        if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
        const data = await response.json();
        setRestaurants(data);

        // Fetch unique cuisines
        const uniqueCuisines = [...new Set(data.flatMap(restaurant => restaurant.cuisines))];
        setCuisines(['All', ...uniqueCuisines]);
      } catch (error) {
        console.error('Fetch error:', error);
        setError(`Failed to load restaurants: ${error.message}`);
      }
    }
    fetchRestaurants();
  }, []);

  useEffect(() => {
    async function fetchTables() {
      try {
        const response = await fetch('http://127.0.0.1:5000/bookings');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setTables(data.filter(table => table.availability === true));
      } catch (error) {
        console.error('Fetch error: ', error);
        setError(`Failed to load tables: ${error.message}`);
      } finally {
        setLoadingTables(false);
      }
    }
    fetchTables();
  }, []);

  const fetchMenuItems = async (restaurantId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/outlets/${restaurantId}`);
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

  const handleClosePanel = () => {
    setSelectedRestaurant(null);
  };

  const handleCuisineChange = (event) => setSelectedCuisine(event.target.value);

  const filteredRestaurants = restaurants
    .filter((restaurant) =>
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((restaurant) =>
      selectedCuisine === 'All' || restaurant.cuisines.includes(selectedCuisine)
    );
    return (
      <div className="pt-20 homeContainer">
        <h1 className="welcomeMessage">{session?.user ?`Welcome, ${session.user.name}!` : "Welcome to Foodcourt!"}</h1>
        <div className="searchBarContainer">
          <input
            type="text"
            className="searchBar"
            placeholder="Search for restaurants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select value={selectedCuisine} onChange={handleCuisineChange} className="cuisineDropdown">
            <option value="All">All Cuisines</option>
            {cuisines.map((cuisine, index) => (
              <option key={index} value={cuisine}>{cuisine}</option>
            ))}
          </select>
        </div>
        <div className="restaurantContainer">
          <div className="cardContainer">
            {filteredRestaurants.map((restaurant) => (
              <Link href={`/menu/${restaurant.id}`} key={restaurant.id} className="card">
                <img src={restaurant.image_url} alt={restaurant.name} className="cardImage" />
                <div className="cardName">{restaurant.name}</div>
              </Link>
            ))}
          </div>
        </div>
        {selectedRestaurant && (
        <div className="sidePanel">
          <div className="sidePanelContent">
            <span className="closeButton" onClick={handleClosePanel}>&times;</span>
            <h2 className="sidePanelTitle">{selectedRestaurant.name} Menu</h2>
            <div className="sidePanelMenuItemsContainer">
              {menuItems.map((item) => (
                <div key={item.id} className="sidePanelMenuItem">
                  <h3 className="sidePanelMenuItemName">{item.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="tablesContainer">
        <h2>Available Tables</h2>
        {loadingTables ? (
          <p>Loading available tables...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          tables.map((table) => (
            <div key={table.id} className="tableCard">
              <h3>Table {table.table_number}</h3>
              <p>Booking Time: {new Date(table.booking_time).toLocaleString()}</p>
              <p>Customer: {table.customer_name}</p>
            </div>
          ))
        )}
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

  

