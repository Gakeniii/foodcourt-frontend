"use client";

import { useEffect, useState } from 'react';
import './page.css';

export default function Page({ params }) {
  const [id, setId] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchId() {
      const { id } = await params;
      setId(id);
    }
    fetchId();
  }, [params]);

  useEffect(() => {
    async function fetchRestaurant() {
      if (!id) return;
      try {
        const response = await fetch(`https://foodcourt-db.onrender.com/outlets/${id}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setRestaurant(data);
      } catch (error) {
        setError('Failed to load restaurant details');
        console.error('Fetch error: ', error);
      } finally {
        setLoading(false);
      }
    }
    fetchRestaurant();
  }, [id]);

  return (
    <div className="pageContainer">
      {loading ? (
        <p className="loading">Loading restaurant details...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        restaurant && (
          <div className="restaurantDetails">
            <h1 className="cardTitle">{restaurant.name}</h1>
            <img src={restaurant.image_url} alt={restaurant.name} className="cardImage" />
            <p className="cardDescription">{restaurant.description}</p>
            <div className="menuItemsContainer">
              <h2 className="menuItemsTitle">Menu Items</h2>
              {restaurant.menu_items.map((item) => (
                <div key={item.id} className="menuItemCard">
                  <img src={item.image_url} alt={item.name} className="menuItemImage" />
                  <h3 className="menuItemName">{item.name}</h3>
                  <p className="menuItemPrice">KSh {item.price}</p>
                </div>
              ))}
            </div>
            <div className="ownerInfo">
              <h2 className="ownerInfoTitle">Owner Information</h2>
              <p><strong>Owner ID:</strong> {restaurant.owner_id}</p>
              <p><strong>Owner Name:</strong> {restaurant.owner_name}</p>
            </div>
          </div>
        )
      )}
    </div>
  );
}
