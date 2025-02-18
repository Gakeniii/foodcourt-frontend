import { useRouter } from 'next/router';

export default function Restaurant() {
  const router = useRouter();
  const { id } = router.query;

  // Fetch restaurant data based on the `id` (e.g., from an API or a local data source)
  // For simplicity, let's assume you have a function `fetchRestaurantData(id)` that returns the data.
  // const restaurant = fetchRestaurantData(id);

  // Sample restaurant data
  const restaurant = {
    id,
    name: 'Sample Restaurant',
    description: 'This is a sample restaurant description.',
    menu: ['Dish 1', 'Dish 2', 'Dish 3'],
  };

  return (
    <div>
      <h1>{restaurant.name}</h1>
      <p>{restaurant.description}</p>
      <h2>Menu</h2>
      <ul>
        {restaurant.menu.map((dish, index) => (
          <li key={index}>{dish}</li>
        ))}
      </ul>
    </div>
  );
}
