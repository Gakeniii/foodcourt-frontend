"use client"; 

import Restaurants from './restaurants/page';
import './home.css'; 

export default function Home() {
  return (
    <div className="homeContainer">
      <h1 className="welcomeMessage">Welcome to Foodcourt!</h1>
      <p className="introduction">Discover the best restaurants and enjoy a delightful dining experience.</p>
      <div className="restaurantContainer">
        <Restaurants />
      </div>
    </div>
  );
}
