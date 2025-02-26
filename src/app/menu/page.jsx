
"use client";

import { useEffect, useState } from "react";
import "../menu/menu.css";
import QuantitySelector from "../QuantitySelector/QuantitySelector";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import { useOutlet } from "../context/Outlet";

const Menu = () => {
  const [outlets, setOutlets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const router = useRouter();
  const { addItemToCart } = useCart();
  const { selectedOutlet, setSelectedOutlet } = useOutlet();

  useEffect(() => {
    async function fetchOutlets() {
      try {
        const response = await fetch("http://127.0.0.1:5000/outlets");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setOutlets(data);
      } catch (error) {
        setError("Failed to load outlets");
        console.error("Fetch error: ", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOutlets();
  }, []);

  const handleSearchChange = (event) => setSearchQuery(event.target.value);
  const handleCuisineChange = (event) => setSelectedCuisine(event.target.value);
  const handleCategoryChange = (event) => setSelectedCategory(event.target.value);

  const openModal = (item, outlet) => {
    if (!outlet || !outlet.id) {
      console.error("Outlet ID is missing for the selected item", item);
      return;
    }
    setSelectedItem({ ...item, outlet });
    setQuantity(1);
    setTotalPrice(item.price);
    setIsModalOpen(true);
    if (setSelectedOutlet){
      setSelectedOutlet(outlet);
    } else {
      console.error("setSelectedOutlet is undefined");
    }
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  const handleQuantityChange = (quantity, totalPrice) => {
    setQuantity(quantity);
    setTotalPrice(totalPrice);
  };

  const addToCart = (item) => {
    if (!selectedOutlet) {
      alert("Please select an outlet first.");
      return;
    }

    addItemToCart({
      ...item,
      outlet_id: selectedOutlet.id,
      quantity,
      totalPrice,
    });
    router.push("/checkout");
  };

  const filteredMenuItems = outlets.flatMap((outlet) =>
    (outlet.menu_items || [])
      .filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (selectedCuisine === "All" || item.cuisine === selectedCuisine) &&
          (selectedCategory === "All" || item.category === selectedCategory)
      )
      .map((item) => ({ ...item, outlet }))
  );

  return (
    <div className="menuContainer">
      <h1 className="menuTitle">Menu</h1>
      <div className="filtersContainer">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="searchBar"
        />
        <select value={selectedCuisine} onChange={handleCuisineChange} className="cuisineDropdown">
          <option value="All">All Cuisines</option>
          {Array.from(new Set(outlets.flatMap((outlet) => outlet.cuisines))).map((cuisine) => (
            <option key={cuisine} value={cuisine}>
              {cuisine}
            </option>
          ))}
        </select>
        <select value={selectedCategory} onChange={handleCategoryChange} className="categoryDropdown">
          <option value="All">All Categories</option>
          {Array.from(
            new Set(outlets.flatMap((outlet) => outlet.menu_items.map((item) => item.category)))
          ).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <p>Loading outlets...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="menuItemsContainer">
          {filteredMenuItems.map((item) => (
            <div
              key={item.id}
              className="menuItemCard"
              onClick={() => openModal(item, item.outlet)}
              style={{ cursor: "pointer" }}
            >
              <img src={item.image_url} alt={item.name} className="menuItemImage" />
              <div className="menuItemDetails">
                <h2 className="menuItemName">{item.name}</h2>
                <p className="menuItemWaitingTime">Waiting Time: {item.waiting} minutes</p>
                <p className="menuItemPrice">KSh {item.price}</p>
                <button
                  className="addToCart"
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal(item, item.outlet);
                  }}
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
              <p>
                <strong>Restaurant:</strong> {selectedItem.outlet.name}
              </p>
              <p>
                <strong>Category:</strong> {selectedItem.category}
              </p>
              <p>
                <strong>Cuisine:</strong> {selectedItem.cuisine}
              </p>
              <p>
                <strong>Price:</strong> KSh {selectedItem.price}
              </p>
              <QuantitySelector price={selectedItem.price} onQuantityChange={handleQuantityChange} />
              <button className="addToCartButton" onClick={() => addToCart(selectedItem)}>
                Add to Cart
              </button>
            </div>
            <span className="close" onClick={closeModal}>
              &times;
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
