import Link from 'next/link';

// Sample data for the restaurant list
const restaurants = [
  { id: '1', name: 'Restaurant 1' },
  { id: '2', name: 'Restaurant 2' },
  { id: '3', name: 'Restaurant 3' },
];

export default function Restaurants() {
  return (
    <div>
      <h1>Available Restaurants</h1>
      <ul>
        {restaurants.map((restaurant) => (
          <li key={restaurant.id}>
            <Link href={`/home/restaurants/${restaurant.id}`}>
              {restaurant.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
