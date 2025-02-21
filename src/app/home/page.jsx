"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import './home.css';

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const response = await fetch('https://foodcourt-db.onrender.com/outlets');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setRestaurants(data);
      } catch (error) {
        console.error('Fetch error: ', error);
      }
    }
    fetchRestaurants();
  }, []);

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
            <div key={restaurant.id} className="card">
              <Link href={`/home/restaurants/${restaurant.id}`} legacyBehavior>
                <a>
                  <img src={restaurant.image_url} alt={restaurant.name} className="cardImage" />
                  <div className="cardName">{restaurant.name}</div>
                </a>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
