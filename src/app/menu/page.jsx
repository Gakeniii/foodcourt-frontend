"use client";

import { useCart } from '../context/CartContext';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "../menu/menu.css";
import QuantitySelector from "../QuantitySelector/QuantitySelector";

const Menu = () => {
  const [outlets, setOutlets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const router = useRouter();
  const { addItemToCart } = useCart();

  useEffect(() => {
    async function fetchOutlets() {
      try {

        const response = await fetch("https://foodcourt-db.onrender.com/menu_items");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setOutlets(data);
      } catch (error) {
        setError("Failed to load menu items");
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
    setSelectedItem({ ...item, outlet });
    setQuantity(1);
    setTotalPrice(item.price);
    setIsModalOpen(true);
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
    addItemToCart({
      ...item,
      quantity,
      totalPrice,
    });
    router.push('/checkout'); 
  };
  const filteredMenuItems = outlets.flatMap(outlet =>
    outlet.menu_items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCuisine === 'All' || item.cuisine === selectedCuisine) &&
      (selectedCategory === 'All' || item.category === selectedCategory)
    ).map(item => ({ ...item, outlet }))
  );

  const addToCart = () => {
    if (!selectedItem) return;
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
  
    const existingItemIndex = existingCart.findIndex(item => item.menu_item_id === selectedItem.id);
  
    if (existingItemIndex !== -1) {
      existingCart[existingItemIndex].quantity += quantity;
      existingCart[existingItemIndex].total_price += selectedItem.price * quantity;
    } else {
      const cartItem = {
        menu_item_id: selectedItem.id,
        menu_item_name: selectedItem.name,
        quantity,
        total_price: selectedItem.price * quantity,
        outlet_name: selectedItem.outlet?.name || "Unknown Outlet",
      };
      existingCart.push(cartItem);
    }
  
    setCart(existingCart);
    localStorage.setItem("cart", JSON.stringify(existingCart));
  
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  
    closeModal();
  
    router.push("/checkout");
  };
  
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
          {Array.from(new Set(outlets.flatMap(outlet => outlet.cuisines))).map(cuisine => (
            <option key={cuisine} value={cuisine}>{cuisine}</option>
          ))}
        </select>
        <select value={selectedCategory} onChange={handleCategoryChange} className="categoryDropdown">
          <option value="All">All Categories</option>
          {Array.from(new Set(outlets.flatMap(outlet => outlet.menu_items.map(item => item.category)))).map(category => (
            <option key={category} value={category}>{category}</option>
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
              style={{ cursor: 'pointer' }} 
//           {menuItems.map((item) => (
//             <div
//               key={item.id}
//               className="menuItemCard"
//               onClick={() => openModal(item)}
//               style={{ cursor: "pointer" }}
            >
              <img src={item.image_url} alt={item.name} className="menuItemImage" />
              <div className="menuItemDetails">
                <h2 className="menuItemName">{item.name}</h2>
                <p className="menuItemWaitingTime">Waiting Time: {item.waiting} minutes</p>
                <p className="menuItemPrice">KSh {item.price}</p>
                <button className="addToCart" onClick={(e) => { e.stopPropagation(); openModal(item, item.outlet); }}>+</button>
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
              <p><strong>Restaurant:</strong> {selectedItem.outlet?.name || "Unknown Outlet"}</p>
              <p><strong>Category:</strong> {selectedItem.category}</p>
              <p><strong>Cuisine:</strong> {selectedItem.cuisine}</p>
              <p><strong>Price:</strong> KSh {selectedItem.price}</p>
              <QuantitySelector price={selectedItem.price} onQuantityChange={handleQuantityChange} />
              <button 
                className="addToCartButton" 
                onClick={() => addToCart(selectedItem)}
              >
                Add to Cart
              </button>
//               <QuantitySelector quantity={quantity} setQuantity={setQuantity} price={selectedItem.price} />
//               <p><strong>Total Price:</strong> KSh {selectedItem.price * quantity}</p>
//               <button className="addToCartButton" onClick={addToCart}>Add to Cart</button>
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
};

export default Menu;

