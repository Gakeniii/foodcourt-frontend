"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { fetchOutlets, addOutlet } from "../lib/utils";

export default function OwnerDashboard() {
  const [ownerName, setOwnerName] = useState("");
  const [ordersCount, setOrdersCount] = useState(0);
  const [tablesCount, setTablesCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [newOutletName, setNewOutletName] = useState("");
  const [newOutletImageUrl, setNewOutletImageUrl] = useState("");

  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const router = useRouter();
  const { data: session, status } = useSession();
  const BASE_URL = "http://127.0.0.1:5000";
  console.log("Session data:", session);

  useEffect(() => {
    // console.log("Session status:", status);
    // console.log("Session data:", session);

    // if (status === "loading") return;
    // if (status === "unauthenticated") {
    //   router.push("/auth/login");
    //   return;
    // }

    const fetchData = async () => {
      try {
        const userId = session?.user?.id;
        const token = session?.accessToken;

        // if (!userId || !token) {
        //   router.push("/auth/login");
        //   return;
        // }

        const response = await fetch(`${BASE_URL}/users/${userId}`, {
          headers: { "Authorization": `Bearer ${token}` },
        });
        const userData = await response.json();

        if (userData?.role?.toLowerCase() === "owner") {
          setOwnerName(userData.name);
        } else {
          router.push("/auth/login");
        }

        const ordersResponse = await fetch(`${BASE_URL}/orders`, {
          headers: { "Authorization": `Bearer ${token}` },
        });
        const ordersData = await ordersResponse.json();
        setOrdersCount(ordersData.length);
        setRecentOrders(ordersData.slice(0, 5));

        const tablesResponse = await fetch(`${BASE_URL}/bookings`, {
          headers: { "Authorization": `Bearer ${token}` },
        });
        const tablesData = await tablesResponse.json();
        setTablesCount(tablesData.length);

        const outletsData = await fetchOutlets(token);
        setOutlets(outletsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [status, session, router]);

  const handleAddOutlet = async () => {
    if (!newOutletName || !newOutletImageUrl) return;

    const token = session?.accessToken;
    if (!token) return;

    const newOutlet = { name: newOutletName, image_url: newOutletImageUrl };
    const addedOutlet = await addOutlet(newOutlet, token);

    if (addedOutlet) {
      setOutlets([...outlets, addedOutlet]);
      setNewOutletName("");
      setNewOutletImageUrl("");

      // ✅ Show pop-up message
      setPopupMessage("Outlet added successfully!");
      setShowPopup(true);

      // ✅ Hide pop-up after 3 seconds
      setTimeout(() => setShowPopup(false), 3000);
    } else {
      setPopupMessage("Failed to add outlet. Try again.");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    }
  };

  if (status === "loading") return <p>Loading session...</p>;

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">FoodCourt Owner</h1>
        <Link href="/dashboard" className="mr-4 hover:text-gray-300">Dashboard</Link>
      </nav>

      {/* Pop-up Notification */}
      {showPopup && (
        <div className="fixed top-10 right-10 bg-green-500 text-white p-4 rounded-lg shadow-lg">
          {popupMessage}
        </div>
      )}

      {/* Dashboard Content */}
      <div className="flex-grow flex flex-col items-center justify-center p-6">
        <h2 className="text-3xl font-bold mb-4">Welcome, {ownerName || session?.user?.name}!</h2>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <Link href="/dashboard/orders" className="bg-blue-500 text-white p-6 rounded shadow-md hover:bg-blue-600">
            Orders ({ordersCount})
          </Link>
          <Link href="/dashboard/tables" className="bg-green-500 text-white p-6 rounded shadow-md hover:bg-green-600">
            Table Bookings ({tablesCount})
          </Link>
        </div>
                  {/* Add Outlet Form */}
        <div className="mt-6">
            <input
              type="text"
              value={newOutletName}
              onChange={(e) => setNewOutletName(e.target.value)}
              placeholder="New Outlet Name"
              className="p-2 rounded border mb-4"
            />
            <input
              type="text"
              value={newOutletImageUrl}
              onChange={(e) => setNewOutletImageUrl(e.target.value)}
              placeholder="Image URL"
              className="p-2 rounded border mb-4"
            />
            <button
              onClick={handleAddOutlet}
              className="ml-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Outlet
            </button>
        </div>

        {/* Outlets Section */}
        <div className="mb-6 w-full">
          <h3 className="text-xl font-semibold">Your Outlets</h3>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-2 gap-2">
            {outlets.map((outlet) => (
              <div 
                key={outlet.id}
                onClick={() => router.push(`/dashboard/outlet/${outlet.id}`)}
                className="p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex flex-col items-center">
                <img src={outlet.image_url} alt={outlet.name} className="w-full h-48 object-cover rounded-t-lg" />
                <h4 className="text-lg font-semibold mt-4">{outlet.name}</h4>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}



