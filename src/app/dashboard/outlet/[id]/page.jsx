"use client"
import { fetchOutletMenus, addMenuItem, updateMenuItem, deleteMenuItem } from "@/app/lib/utils";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";


export default function OutletPage() {
  const { id: outletId } = useParams();
  const { data: session } = useSession();

  const [menus, setMenus] = useState([]);
  const [newMenu, setNewMenu] = useState({
    name: "",
    price: "",
    image_url: "",
    cuisine: "",
    category: "",
    description: "",
    waiting: "",
  });
  const [editingMenu, setEditingMenu] = useState(null);
  const [popup, setPopup] = useState({ message: "", color: "" });
  const [showModal, setShowModal] = useState(false);
  const token = session?.accessToken;

  useEffect(() => {
    if (!outletId || !token) return;
    const fetchMenus = async () => {
      const menuItems = await fetchOutletMenus(outletId, token);
      setMenus(menuItems);
    };
    fetchMenus();
  }, [outletId, token]);

  const showPopup = (message, color) => {
    setPopup({ message, color });
    setTimeout(() => setPopup({ message: "", color: "" }), 3000);
  };

  const handleAddMenu = async () => {
    console.log("Button Clicked!");

    if (
      !newMenu.name ||
      !newMenu.price ||
      !newMenu.image_url ||
      !newMenu.cuisine ||
      !newMenu.category ||
      !newMenu.waiting
    ) {
      console.log("Missing fields:", newMenu);
      return;
    }

    console.log("Adding menu:", newMenu);

    const addedMenu = await addMenuItem({ ...newMenu, outlet_id: outletId }, token);

    if (addedMenu) {
      console.log("Menu added successfully:", addedMenu);
      setMenus([...menus, addedMenu]);
      setNewMenu({
        name: "",
        price: "",
        image_url: "",
        cuisine: "",
        category: "",
        description: "",
        waiting: "",
      });
      showPopup("Menu added successfully!", "green");
    } else {
      console.log("No menu returned from API.");
    }
  };

  const handleUpdateMenu = async () => {
    if (!editingMenu) return;

      const updatedData = {
      ...editingMenu,
      price: parseInt(editingMenu.price, 10) || 0,
    };
  
    const updated = await updateMenuItem(editingMenu.id, updatedData, token);
    if (updated) {
      setMenus((prevMenus) => 
        prevMenus.map((m) => (m.id === editingMenu.id ? { ...m, ...updated } : m))
      );
      setEditingMenu(null);
      setShowModal(true);
      showPopup("Menu updated successfully!", "yellow");
    }
    
  };

  const handleDeleteMenu = async (menuId) => {
    if (await deleteMenuItem(menuId, token)) {
      setMenus(menus.filter((m) => m.id !== menuId));
      showPopup("Menu deleted successfully!", "red");
    }
  };

  return (
    <div className="p-6">
      {popup.message && (
        <div className={`fixed top-20 bg-${popup.color}-500 text-white p-4 rounded-md shadow-lg transition-opacity`}>
          {popup.message}
        </div>
      )}
      <h1 className="text-2xl font-bold mb-4">Outlet Menu</h1>
  
      {/* Parent container for side-by-side layout */}
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Add Menu Form */}
        <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-1/3">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Add New Menu</h2>
  
          <div className="grid grid-cols-1 gap-4">
            <input type="text" value={newMenu.name} onChange={(e) => setNewMenu({ ...newMenu, name: e.target.value })}
              placeholder="Menu Name" className="border rounded-md p-3 w-full focus:ring-2 focus:ring-blue-400"/>
  
            <input type="text" value={newMenu.image_url} onChange={(e) => setNewMenu({ ...newMenu, image_url: e.target.value })}
              placeholder="Menu Image URL" className="border rounded-md p-3 w-full focus:ring-2 focus:ring-blue-400"/>
  
            <select value={newMenu.cuisine} onChange={(e) => setNewMenu({ ...newMenu, cuisine: e.target.value })}
              className="border rounded-md p-3 w-full bg-white focus:ring-2 focus:ring-blue-400">
              <option value="">Select Cuisine</option>
              {["Italian", "Japanese", "Indian", "American", "French", "Mexican", "Chinese", "Swahili", "Malaysian", "Turkish", "Congolese"].map((cuisine) => (
                <option key={cuisine} value={cuisine}>{cuisine}</option>
              ))}
            </select>
  
            <select value={newMenu.category} onChange={(e) => setNewMenu({ ...newMenu, category: e.target.value })}
              className="border rounded-md p-3 w-full bg-white focus:ring-2 focus:ring-blue-400">
              <option value="">Select Category</option>
              {["Starter", "Main Course", "Dessert", "Kids Menu", "Snacks", "Drinks"].map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
  
            <textarea value={newMenu.description} onChange={(e) => setNewMenu({ ...newMenu, description: e.target.value })}
              placeholder="Menu Description" className="border rounded-md p-3 w-full h-24 focus:ring-2 focus:ring-blue-400"/>
  
            <input type="number" value={newMenu.price} onChange={(e) => setNewMenu({ ...newMenu, price: e.target.value })}
              placeholder="Price (Ksh)" className="border rounded-md p-3 w-full focus:ring-2 focus:ring-blue-400"/>
  
            <input type="number" value={newMenu.waiting} onChange={(e) => setNewMenu({ ...newMenu, waiting: e.target.value })}
              placeholder="Waiting Time (Minutes)" className="border rounded-md p-3 w-full focus:ring-2 focus:ring-blue-400"/>
  
            <button onClick={handleAddMenu}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-md transition duration-200 w-full">
              Add Menu
            </button>
          </div>
        </div>
  
        {/* Menu List */}
        <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-2/3">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Menu List</h2>
          <ul className="space-y-4">
            {menus.map((menu, index) => (
              <li key={menu.id || index} className="flex justify-between p-3 border-b bg-gray-50 rounded-md">
                <span className="font-semibold">{menu.name} - Ksh {menu.price}</span>
                <div className="space-x-2">
                  <button onClick={() => { setEditingMenu(menu); setShowModal(true); }} className="text-yellow-500 font-medium">Edit</button>
                  <button onClick={() => handleDeleteMenu(menu.id)} className="text-red-500 font-medium">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
  
      </div>
  
      {/* Edit Modal */}
      {showModal && editingMenu && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Menu</h2>
            <input type="text" value={editingMenu.name} onChange={(e) => setEditingMenu({ ...editingMenu, name: e.target.value })}
              className="border rounded-md p-2 w-full mb-2"/>
            <input type="number" value={editingMenu.price} onChange={(e) => setEditingMenu({ ...editingMenu, price: e.target.value })}
              className="border rounded-md p-2 w-full mb-2"/>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowModal(false)} className="text-gray-600">Cancel</button>
              <button onClick={handleUpdateMenu} className="bg-yellow-500 text-white py-2 px-4 rounded-md">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}  

