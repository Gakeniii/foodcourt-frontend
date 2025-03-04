"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QuantitySelector from "../QuantitySelector/QuantitySelector";
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
  const [cartNotification, setCartNotification] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();
  const { addToCart } = useCart();
  const { selectedOutlet, setSelectedOutlet } = useOutlet();
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    async function fetchOutlets() {
      try {
        const response = await fetch(`${BASE_URL}/outlets`);
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
    if (setSelectedOutlet) {
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

  const handleAddToCart = (item) => {
    if (!selectedOutlet) {
      alert("Please select an outlet first.");
      return;
    }
    addToCart({
      ...item,
      outlet_id: selectedOutlet.id,
      quantity,
      totalPrice,
    });
    setCartCount((prevCount) => prevCount + quantity);
    setCartNotification(true);
    closeModal();
    setTimeout(() => {
      setCartNotification(false);
    }, 3000);
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
    <div className="max-w-6xl mx-auto pt-20 p-4">
      <h1 className="text-center text-green-900 text-4xl font-bold my-6">Menus</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="p-2 border border-amber-400 rounded-full w-64"
        />
        <select
          value={selectedCuisine}
          onChange={handleCuisineChange}
          className="p-2 border rounded-full"
        >
          <option value="All">All Cuisines</option>
          {Array.from(new Set(outlets.flatMap((outlet) => outlet.cuisines))).map((cuisine) => (
            <option key={cuisine} value={cuisine}>
              {cuisine}
            </option>
          ))}
        </select>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="p-2 border rounded-full text-gray-800"
        >
          <option value="All">All Categories</option>
          {Array.from(
            new Set(outlets.flatMap((outlet) => outlet.menu_items.map((item) => item.category)))
          ).map((category) => (
            <option key={category} value={category} className="text-gray-800">
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Menu Items */}
      {loading ? (
        <p className="text-center">Loading Menus...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMenuItems.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-lg shadow-md cursor-pointer transition-transform transform hover:scale-105"
              onClick={() => openModal(item, item.outlet)}
            >
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-40 object-cover rounded-lg"
              />
              <div className="mt-2 flex justify-between items-center">
                {/* Left side: Item details */}
                <div className="text-left">
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-gray-600">Waiting Time: {item.waiting} min</p>
                  <p className="text-green-700 font-bold">KSh {item.price}</p>
                </div>

                {/* Right side: Plus button */}
                <button
                  className="px-2 py-1 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
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

      {/* Modal for adding item */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full relative">
            <button
              className="absolute top-2 right-4 text-2xl"
              onClick={closeModal}
            >
              &times;
            </button>
            <img
              src={selectedItem.image_url}
              alt={selectedItem.name}
              className="w-full h-56 object-cover rounded-lg"
            />
            <h2 className="text-xl font-bold mt-4">{selectedItem.name}</h2>
            <p className="text-gray-600">
              <strong>Restaurant:</strong> {selectedItem.outlet.name}
            </p>
            <p className="text-gray-600">
              <strong>Category:</strong> {selectedItem.category}
            </p>
            <p className="text-gray-600">
              <strong>Cuisine:</strong> {selectedItem.cuisine}
            </p>
            <p className="text-green-900 font-bold">KSh {selectedItem.price}</p>
            <QuantitySelector
              price={selectedItem.price}
              onQuantityChange={handleQuantityChange}
            />
            <button
              className="w-full mt-4 bg-amber-500 text-white p-2 rounded-full hover: transition"
              onClick={() => handleAddToCart(selectedItem)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {cartNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg transition duration-300">
          Order added to cart!
        </div>
      )}

      {/* Floating Checkout Button */}
      {cartCount > 0 && (
        <button
          className="fixed bottom-4 right-2 bg-yellow-500 border-black text-white px-4 py-4 rounded-full hover: transition shadow-lg flex items-center gap-2"
          onClick={() => router.push("/checkout")}
        >
          View Cart <span className="font-bold">({cartCount})</span>
        </button>
      )}
      <br></br>
      <br></br>
      <br></br>
    </div>
  );
};

export default Menu;