"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import '../menu/menu.css'; 
import QuantitySelector from '../QuantitySelector/QuantitySelector';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [cuisines, setCuisines] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);
  const [availableTables, setAvailableTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');

  useEffect(() => {
    async function fetchMenuItems() {
      try {
        const response = await fetch('https://foodcourt-db.onrender.com/menu_items');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setMenuItems(data);

        
        const uniqueCuisines = [...new Set(data.flatMap(item => item.cuisine))];
        setCuisines(['All', ...uniqueCuisines]);

        
        const uniqueCategories = [...new Set(data.flatMap(item => item.category))];
        setCategories(['All', ...uniqueCategories]);
      } catch (error) {
        setError('Failed to load menu items');
        console.error('Fetch error: ', error);
      } finally {
        setLoading(false);
      }
    }
    fetchMenuItems();
  }, []);

  useEffect(() => {
    async function fetchAvailableTables() {
      try {
        const response = await fetch('https://foodcourt-db.onrender.com/bookings');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        const available = data.filter(table => table.availability === true);
        setAvailableTables(available);
        if (available.length > 0) {
          setSelectedTable(available[0].table_number);
        }
      } catch (error) {
        setError('Failed to load available tables');
        console.error('Fetch error: ', error);
      }
    }
    fetchAvailableTables();
  }, []);
  const openModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  const handleCuisineChange = (event) => setSelectedCuisine(event.target.value);
  const handleCategoryChange = (event) => setSelectedCategory(event.target.value);
  const handleTableChange = (event) => setSelectedTable(event.target.value);

  const filteredMenuItems = menuItems
    .filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((item) =>
      selectedCuisine === 'All' || item.cuisine === selectedCuisine
    )
    .filter((item) =>
      selectedCategory === 'All' || item.category === selectedCategory
    );

  const updateDatabaseEntries = async () => {
    try {
      
      const ordersResponse = await fetch('https://foodcourt-db.onrender.com/orders');
      const bookingsResponse = await fetch('https://foodcourt-db.onrender.com/bookings');

      if (!ordersResponse.ok || !bookingsResponse.ok) {
        throw new Error('Network response was not ok');
      }

      const ordersData = await ordersResponse.json();
      const bookingsData = await bookingsResponse.json();

      console.log('Orders data:', ordersData);
      console.log('Bookings data:', bookingsData);

      // Cross-check orders and bookings to find discrepancies
      const updatedBookings = bookingsData.map(booking => {
        const conflictingOrder = ordersData.find(order => order.table_number === booking.table_number && booking.availability === true);
        if (conflictingOrder) {
          // If a conflict is found, update the booking's availability to false
          return { ...booking, availability: false };
        }
        return booking;
      });

      // Log the updates for verification
      console.log('Updated Bookings data:', updatedBookings);
      
      // If needed, send the updated bookings data back to the server (requires API endpoint for updating bookings)

    } catch (error) {
      console.error('Error updating database entries:', error);
    }
  };

  useEffect(() => {
    updateDatabaseEntries();
  }, []);

  const addToCart = async (item) => {
    try {
      
      const fetchAvailableTables = async () => {
        const response = await fetch('https://foodcourt-db.onrender.com/bookings');
        if (!response.ok) {
          const errorMessage = await response.text();
          console.error('Error fetching tables:', errorMessage);
          throw new Error('Failed to fetch table bookings');
        }
        const tablesData = await response.json();
        return tablesData.filter(table => table.availability === true);
      };

      const availableTables = await fetchAvailableTables();
      console.log('Available tables:', availableTables);
      const selectedTableObj = availableTables.find(table => table.table_number === selectedTable);

      if (!selectedTableObj) {
        alert('The selected table is already booked. Please select another table.');
        setAvailableTables(availableTables);
        if (availableTables.length > 0) {
          setSelectedTable(availableTables[0].table_number);
        }
        return;
      }

      console.log('Selected table:', selectedTable);

      const response = await fetch('https://foodcourt-db.onrender.com/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: 13,
          outlet_id: item.outlet.id,
          outlet_name: item.outlet.name,
          table_number: selectedTable,
          total_price: item.price * 1,  
          order_items: [
            {
              menu_item_id: item.id,
              menu_item_name: item.name,
              menu_item_price: item.price,
              quantity: 1,  // Update with actual quantity if needed
              total_price: item.price * 1,  // Update based on quantity if needed
              payment_method: 'Card',  // Update if needed
              menu_item_image: item.image_url  // Add image URL
            }
          ],
          status: 'Pending',
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error('Error:', errorMessage);
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`Added ${item.name} to cart`, data);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      alert(`Error adding item to cart: ${error.message}`);
    }
  };

  return (
    <div className="menuContainer">
      <h1 className="menuTitle">Menu</h1>
      <div className="filtersContainer">
        <input
          type="text"
          className="searchBar"
          placeholder="Search for menu items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select value={selectedCuisine} onChange={handleCuisineChange} className="cuisineDropdown">
          <option value="All">All Cuisines</option>
          {cuisines.map((cuisine, index) => (
            <option key={index} value={cuisine}>{cuisine}</option>
          ))}
        </select>
        <select value={selectedCategory} onChange={handleCategoryChange} className="categoryDropdown">
          <option value="All">All Categories</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>


        
        <input value={selectedTable} onChange={handleTableChange} className="tableDropdown">
          {availableTables.length > 0 ? (
            availableTables.map((table, index) => (
              <option key={index} value={table.table_number}>
                Table {table.table_number}
              </option>
            ))
          ) : (
            <option value="">No Available Tables</option>
          )}
        </input>
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
              style={{ cursor: 'pointer' }} 
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
              <p><strong>Restaurant:</strong> {selectedItem.outlet.name}</p>
              <p><strong>Category:</strong> {selectedItem.category}</p>
              <p><strong>Cuisine:</strong> {selectedItem.cuisine}</p>
              <p><strong>Description:</strong> {selectedItem.description}</p>
              <p><strong>Price:</strong> KSh {selectedItem.price}</p>
              <QuantitySelector price={selectedItem.price} />
              <button className="addToCartButton" onClick={() => addToCart(selectedItem)}>Add to Cart</button>
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


