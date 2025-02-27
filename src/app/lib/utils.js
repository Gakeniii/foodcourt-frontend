import { useSession } from "next-auth/react";

export async function login(email, password) {
    const response = await fetch(`http://127.0.0.1:5000/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    // Handle response errors
    if (!response.ok) {
        console.error("Login failed:", response);
        // return null; // This will trigger 401 in NextAuth
    }

    const data = await response.json(); // Parse response body
    return data; // Ensure it returns an object with { id, name, email }
}

// utils.js

// Base URL for API requests (adjust based on your backend)
const BASE_URL = 'http://localhost:5000';  // Change to your Flask API base URL

// Fetch outlets from the backend
export const fetchOutlets = async () => {
  try {
    const response = await fetch(`${BASE_URL}/outlets`);
    if (!response.ok) {
      throw new Error('Failed to fetch outlets');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// Add an outlet

export const addOutlet = async (outletData, token) => {
  try {
    const response = await fetch(`${BASE_URL}/outlets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        name: outletData.name,
        image_url: outletData.image_url
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to add outlet');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// // Fetch menu items from the backend
// export const fetchMenuItems = async () => {
//   try {
//     const response = await fetch(`${BASE_URL}/menu_items`);
//     if (!response.ok) {
//       throw new Error('Failed to fetch menu items');
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error(error);
//     return [];
//   }
// };

// // Add a menu item
// export const addMenuItem = async (menuItemData) => {
//     const token = session?.accessToken; 
//   try {
//     const response = await fetch(`${BASE_URL}/menu_items`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         "Authorization": `Bearer ${token}`
//       },
//       body: JSON.stringify(menuItemData),
//     });
//     if (!response.ok) {
//       throw new Error('Failed to add menu item');
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// };

// // Edit a menu item
// export const editMenuItem = async (menuItemId, updatedData) => {
//     const token = session?.accessToken; 
//   try {
//     const response = await fetch(`${BASE_URL}/menu_items/${menuItemId}`, {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//         "Authorization": `Bearer ${token}`
//       },
//       body: JSON.stringify(updatedData),
//     });
//     if (!response.ok) {
//       throw new Error('Failed to edit menu item');
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// };

// // Delete a menu item
// export const deleteMenuItem = async (menuItemId) => {
//     const token = session?.accessToken; 
//   try {
//     const response = await fetch(`${BASE_URL}/menu_items/${menuItemId}`, {
//       method: 'DELETE',
//       headers: {
//         "Authorization": `Bearer ${token}`
//       }
//     });
//     if (!response.ok) {
//       throw new Error('Failed to delete menu item');
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// };


//MENU FUCNTIONALITIES

// Fetch menus for a specific outlet
export async function fetchOutletMenus(outletId, token) {
  try {
    const response = await fetch(`${BASE_URL}/outlets/${outletId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) throw new Error("Failed to fetch menus");
    
    const data = await response.json();
    return data.menu_items; // Assuming the response contains menu_items inside the outlet object
  } catch (error) {
    console.error("Error fetching outlet menus:", error);
    return [];
  }
}

// Add a new menu item
export async function addMenuItem(menuData, token) {
    console.log("🟡 Sending request to API with data:", JSON.stringify(menuData));
  
    try {
      const response = await fetch(`${BASE_URL}/menu_items`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(menuData),
      });
  
      console.log("🟠 Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("🔴 Failed to add menu:", response.status, errorText);
        return null;
      }
  
      const data = await response.json();
      console.log("🟢 API Response Data:", data);
      return data;
    } catch (error) {
      console.error("🔴 Error making API request:", error);
      return null;
    }
}  

// Edit an existing menu item
export async function updateMenuItem(menuId, updatedData, token) {
  try {
    const response = await fetch(`${BASE_URL}/menu_items/${menuId}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) throw new Error("Failed to update menu item");

    return await response.json();
  } catch (error) {
    console.error("Error updating menu item:", error);
    return null;
  }
}

// Delete a menu item
export async function deleteMenuItem(menuId, token) {
  try {
    const response = await fetch(`${BASE_URL}/menu_items/${menuId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to delete menu item");

    return true; // Successful deletion
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return false;
  }
}
