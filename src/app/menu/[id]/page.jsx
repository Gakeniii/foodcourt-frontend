
"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import "./page.css";
import { useCart } from "@/app/context/CartContext";
import { useOutlet } from "@/app/context/Outlet";


export default function Page({ params }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const { setSelectedOutlet} = useOutlet();
  const { addToCart } = useCart();
  const router = useRouter();

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    async function fetchRestaurant() {
      console.log("Fetching restaurant with ID:", id); 

      try {
        const response = await fetch(`${BASE_URL}/outlets/${id}`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();

        console.log("Restaurant data:", data);

        setRestaurant(data);
        setSelectedOutlet(data);
        setCategories(["All", ...new Set(data.menu_items.map(item => item.category))]);
      } catch (error) {
        setError("Failed to load restaurant details");
        console.error("Fetch error: ", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRestaurant();
  }, [id, setSelectedOutlet]);

  const handleSearchChange = (event) => setSearchQuery(event.target.value);
  const handleCategoryChange = (event) => setSelectedCategory(event.target.value);

  const openModal = (item) => {
    setSelectedItem({ ...item, outlet: restaurant });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  const handleAddToCart = (item) => {
  console.log("Adding to cart:", item);
  console.log("Current restaurant state:", restaurant);
    if (!restaurant || !restaurant.id) {
      setError("Please select an outlet before placing your order.");
      return;
    }

    addToCart({
      id: item.id,
      name: item.name,
      image_url: item.image_url,
      price: item.price,
      cuisine: item.cuisine,
      category: item.category,
      outlet_name: restaurant.name,
      outlet_id: restaurant.id,
      total_price:item.total_price
    });
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
    closeModal();
    router.push("/checkout");
  };

  const filteredMenuItems = restaurant?.menu_items
    .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((item) => selectedCategory === "All" || item.category === selectedCategory);

  return (
    <div className="menuContainer pt-20">
      {restaurant?.image_url && (
        <img src={restaurant.image_url} alt={`${restaurant.name} Banner`} className="restaurantBanner" />
      )}
      <h1 className="menuTitle">{restaurant?.name} Menu</h1>

      <div className="filtersContainer">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="searchBar"
        />
        <select value={selectedCategory} onChange={handleCategoryChange} className="categoryDropdown">
          <option value="All">Category</option>
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
              className="menuItemCard" 
              onClick={() => openModal(item)}
              style={{ cursor: "pointer" }}
            >
              <img src={item.image_url} alt={item.name} className="menuItemImage" />
              <div className="menuItemDetails">
                <h2 className="menuItemName">{item.name}</h2>
                <p className="menuItemWaitingTime">Waiting Time: {item.waiting} minutes</p>
                <p className="menuItemPrice">KSh {item.price}</p>
                <button
                  className="addToCart"
                  onClick={(e) => { e.stopPropagation(); openModal(item); }}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && selectedItem && (
        <div className="modal" onClick={closeModal}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <div className="modalImageContainer">
              <img src={selectedItem.image_url} alt={selectedItem.name} className="modalImage" />
            </div>
            <div className="modalDetails">
              <h2>{selectedItem.name}</h2>
              {selectedItem.outlet && (
                <p><strong>Restaurant:</strong> {selectedItem.outlet.name}</p>
              )}
              <p><strong>Category:</strong> {selectedItem.category}</p>
              <p><strong>Cuisine:</strong> {selectedItem.cuisine}</p>
              <p><strong>Description:</strong> {selectedItem.description}</p>
              <p><strong>Price:</strong> KSh {selectedItem.price}</p>
              <button className="addToCartButton" onClick={() => restaurant && handleAddToCart(selectedItem)}
                disabled={!restaurant}>
                Add to Cart
              </button>
            </div>
            <span className="close" onClick={closeModal}>&times;</span>
          </div>
        </div>
      )}

      {showPopup && (
        <div className="popupMessage">
          <p>Item added to cart!</p>
        </div>
      )}
    </div>
  );
}

