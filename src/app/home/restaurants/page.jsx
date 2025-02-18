"use client"; 

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './restaurants.module.css';

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    async function fetchRestaurants() {
      const response = await fetch('/data/restaurants.json');
      const data = await response.json();
      setRestaurants(data);
    }
    fetchRestaurants();
  }, []);

  return (
    <div className={styles.cardContainer}>
      {restaurants.map((restaurant) => (
        <div key={restaurant.slug} className={styles.card}>
          <Link href={`/home/restaurants/${restaurant.slug}`} legacyBehavior>
            <a>
              <img src={restaurant.image} alt={restaurant.name} className={styles.cardImage} />
              <div className={styles.cardName}>{restaurant.name}</div>
            </a>
          </Link>
        </div>
      ))}
    </div>
  );
}
