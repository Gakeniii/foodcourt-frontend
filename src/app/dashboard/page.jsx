"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { fetchOutlets, addOutlet } from "../lib/utils";
import axios from "axios";
import Footer from "../footer/page";

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
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [loadingOutlets, setLoadingOutlets] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  console.log("Session data:", session);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchData = async () => {
      try {
        const userEmail = session?.user?.email;
        const token = session?.accessToken;

        const response = await axios.get(`${BASE_URL}/users?email=${userEmail}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        console.log("Fetching user with email:", userEmail);

        if (
          response.data.length > 0 &&
          response.data[0].role.toLowerCase() === "owner"
        ) {
          setOwnerName(response.data[0].name);
        } else {
          router.push("/dashboard");
        }

        const ordersResponse = await axios.get(`${BASE_URL}/orders`, {
          headers: { "Authorization": `Bearer ${token}` },
        });
        const ordersData = ordersResponse.data;
        setOrdersCount(ordersData.length);
        setRecentOrders(ordersData.slice(0, 5));

        const tablesResponse = await axios.get(`${BASE_URL}/bookings`, {
          headers: { "Authorization": `Bearer ${token}` },
        });
        const tablesData = tablesResponse.data;
        setTablesCount(tablesData.length);

        // Fetch outlets separately and update its own loading state.
        const outletsData = await fetchOutlets(token);
        setOutlets(outletsData);
        setLoadingOutlets(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingDashboard(false);
      }
    };
    fetchData();
  }, [status, session, router, BASE_URL]);

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

      // Show pop-up message
      setPopupMessage("Outlet added successfully!");
      setShowPopup(true);

      // Hide pop-up after 3 seconds
      setTimeout(() => setShowPopup(false), 3000);
    } else {
      setPopupMessage("Failed to add outlet. Try again.");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    }
  };

  if (status === "loading")
    return <p className="p-4">Loading session...</p>;

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <nav className="bg-green-950 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">
          FoodCourt<span className="text-amber-500">.Owner</span>
        </h1>
        <Link href="/auth/login" className="mr-4 hover:text-gray-300">
          Dashboard
        </Link>
      </nav>

      {showPopup && (
        <div className="fixed top-10 right-10 bg-green-500 text-white p-4 rounded-lg shadow-lg">
          {popupMessage}
        </div>
      )}

      {/* Dashboard Content */}
      {loadingDashboard ? (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-xl text-gray-600">Loading dashboard...</p>
        </div>
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center p-6">
          <h2 className="text-3xl text-gray-800 font-bold mb-4">
            Welcome, {ownerName || session?.user?.name}!
          </h2>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <Link
              href="/dashboard/orders"
              className="bg-amber-500 text-white p-6 rounded-full shadow-md hover:bg-yellow-600"
            >
              Orders ({ordersCount})
            </Link>
            <Link
              href="/dashboard/tables"
              className="bg-green-900 text-white p-6 rounded-full shadow-md hover:bg-green-800"
            >
              Reservations ({tablesCount})
            </Link>
          </div>

          <div className="mt-6">
            <input
              type="text"
              value={newOutletName}
              onChange={(e) => setNewOutletName(e.target.value)}
              placeholder="New Outlet Name"
              className="px-4 py-2 mx-2 gap-2 rounded-full border mb-4"
            />
            <input
              type="text"
              value={newOutletImageUrl}
              onChange={(e) => setNewOutletImageUrl(e.target.value)}
              placeholder="Image URL"
              className="px-4 py-2 rounded-full border mb-4"
            />
            <button
              onClick={handleAddOutlet}
              className="ml-4 p-4 bg-amber-500 text-white rounded-full hover:bg-yellow-600"
            >
              Add Outlet
            </button>
          </div>

          {/* Outlets Section */}
          <div className="mb-6 w-full">
            <h3 className="text-2xl text-gray-800 mb-6 font-semibold">
              Your Outlets
            </h3>
            {loadingOutlets ? (
              <div className="flex justify-center items-center">
                <p className="text-gray-600">Loading outlets...</p>
              </div>
            ) : outlets.length > 0 ? (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-2 gap-2">
                {outlets.map((outlet) => (
                  <div
                    key={outlet.id}
                    onClick={() => router.push(`/dashboard/outlet/${outlet.id}`)}
                    className="p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex flex-col items-center"
                  >
                    <img
                      src={outlet.image_url}
                      alt={outlet.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <h4 className="text-lg text-gray-800 font-semibold mt-4">
                      {outlet.name}
                    </h4>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No outlets found.</p>
            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
