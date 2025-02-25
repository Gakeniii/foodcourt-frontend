"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "../menu/menu.css";
import QuantitySelector from "../QuantitySelector/QuantitySelector";

const Menu = () => {
  const router = useRouter();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [cart, setCart] = useState([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchMenuItems() {
      try {
        const response = await fetch("https://foodcourt-db.onrender.com/menu_items");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        setError("Failed to load menu items");
        console.error("Fetch error: ", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMenuItems();
  }, []);

  const openModal = (item) => {
    setSelectedItem(item);
    setQuantity(1);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

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
      {loading ? (
        <p>Loading menu items...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="menuItemsContainer">
          {menuItems.map((item) => (
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
              <p><strong>Description:</strong> {selectedItem.description}</p>
              <p><strong>Price:</strong> KSh {selectedItem.price}</p>
              <QuantitySelector quantity={quantity} setQuantity={setQuantity} price={selectedItem.price} />
              <p><strong>Total Price:</strong> KSh {selectedItem.price * quantity}</p>
              <button className="addToCartButton" onClick={addToCart}>Add to Cart</button>
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