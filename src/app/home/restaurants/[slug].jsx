"use client"; 

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Restaurant() {
  const router = useRouter();
  const { slug } = router.query;
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    async function fetchRestaurant() {
      if (slug) {
        const response = await fetch('/data/restaurants.json');
        const data = await response.json();
        const selectedRestaurant = data.find((rest) => rest.slug === slug);
        setRestaurant(selectedRestaurant);
      }
    }
    fetchRestaurant();
  }, [slug]);

  if (!restaurant) return <div>Loading...</div>;

  return (
    <div>
      <h1>{restaurant.name}</h1>
      <p>{restaurant.description || 'This is a sample restaurant description.'}</p>
      <h2>Menu</h2>
      <ul>
        {restaurant.menu
          ? restaurant.menu.map((dish, index) => (
              <li key={index}>{dish}</li>
            ))
          : ['Dish 1', 'Dish 2', 'Dish 3'].map((dish, index) => (
              <li key={index}>{dish}</li>
            ))}
      </ul>
    </div>
  );
}
