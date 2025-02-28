
export async function login(email, password) {
    const response = await fetch(`${process.env.BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        console.error("Login failed:", response);
    }

    const data = await response.json();
    return data;
}


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;


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
    return data.menu_items;
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

export async function updateMenuItem(menuId, updatedData, token) {
  try {
    console.log("Updating menu item:", { menuId, updatedData, token });

    if (!token) {
      console.error("❌ Token is missing. Make sure the user is authenticated.");
      return null;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/menu_items/${menuId}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    console.log("Response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API Error Response:", errorText);
      throw new Error(`Failed to update menu item: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ Successfully updated menu item:", data);
    return data;
  } catch (error) {
    console.error("🚨 Error updating menu item:", error.message);
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
