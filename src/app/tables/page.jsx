"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation"; // Ensure this import is correct

export default function Tables() {
  const [tables, setTables] = useState([]); // Initialize tables as an empty array
  const [error, setError] = useState(null);
  const [redirectTableId, setRedirectTableId] = useState(null); // New state to handle navigation
  const router = useRouter(); // Initialize the router

  // Fetch table data from the backend
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch("https://foodcourt-db.onrender.com/bookings");
        if (!response.ok) {
          throw new Error("Failed to fetch table data");
        }
        const data = await response.json();

        // Map backend data to frontend table structure
        const mappedTables = data.map((table) => ({
          id: table.id,
          available: table.available,
          bookedAt: table.bookedAt ? new Date(table.bookedAt) : null,
          bookedFrom: table.bookedFrom ? new Date(table.bookedFrom) : null,
          countdown: table.countdown || 0, // Remaining time in seconds
          availabilityTime: table.availabilityTime || (Math.random() < 0.5 ? 20 : 30), // Random availability time (20 or 30 minutes)
        }));

        setTables(mappedTables);
      } catch (error) {
        console.error("Error fetching tables:", error);
        setError("Failed to load table data. Please try again later.");
      }
    };

    fetchTables();
  }, []);

  const toggleBooking = (tableId) => {
    setTables((prevTables) =>
      prevTables.map((table) =>
        table.id === tableId
          ? table.available
            ? (() => {
                const bookedAt = new Date();
                const countdownMinutes = table.availabilityTime;
                const countdown = countdownMinutes * 60;
                const bookedFrom = new Date(bookedAt.getTime() + countdown * 1000);

                // Set the table ID for redirection
                setRedirectTableId(table.id);

                return {
                  ...table,
                  available: false,
                  bookedAt,
                  bookedFrom,
                  countdown,
                };
              })()
            : table
          : table
      )
    );
    setError(null);
  };

  const cancelBooking = (tableId) => {
    setTables((prevTables) =>
      prevTables.map((table) =>
        table.id === tableId
          ? { ...table, available: true, bookedAt: null, bookedFrom: null, countdown: 0 }
          : table
      )
    );
  };

  // Handle navigation after state update
  useEffect(() => {
    if (redirectTableId) {
      router.push(`/checkout?table=${redirectTableId}`);
      setRedirectTableId(null); // Reset the redirect state
    }
  }, [redirectTableId, router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTables((prevTables) =>
        prevTables.map((table) => {
          if (!table.available && table.countdown > 0) {
            return { ...table, countdown: table.countdown - 1 };
          } else if (!table.available && table.countdown <= 0) {
            return { ...table, available: true, bookedAt: null, bookedFrom: null, countdown: 0 };
          }
          return table;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 p-8">
      <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Welcome!</h1>
        <h1 className="text-2xl text-gray-700 text-center mb-6">Book a Table</h1>

        {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}

        <div className="grid grid-cols-3 gap-6 mt-6">
          {tables.map((table) => (
            <div key={table.id} className="flex flex-col items-center border-2 border-gray-300 rounded-lg p-4 shadow-md">
              <motion.button
                onClick={() => toggleBooking(table.id)}
                whileTap={{ scale: 0.95 }}
                className={`p-6 rounded-lg font-semibold text-center text-lg transition duration-300 ease-in-out shadow-lg ${
                  table.available
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-gray-500 hover:bg-gray-600 text-gray-100"
                }`}
              >
                {table.available ? `Table ${table.id}` : `Table ${table.id} Booked`}
              </motion.button>
              <p className="text-gray-700 mt-2">Available for {table.availabilityTime} min</p>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <h2 className="text-xl font-semibold mb-2">My Reservations</h2>
          {tables.some((table) => !table.available) ? (
            <table className="w-full border-collapse border border-gray-300 mt-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2">Table</th>
                  <th className="border border-gray-300 p-2">Booked At</th>
                  <th className="border border-gray-300 p-2">Arrive By</th>
                  <th className="border border-gray-300 p-2">Time Left</th>
                  <th className="border border-gray-300 p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {tables.map(
                  (table) =>
                    !table.available && (
                      <tr key={table.id} className="text-gray-700">
                        <td className="border border-gray-300 p-2">{table.id}</td>
                        <td className="border border-gray-300 p-2">{new Date(table.bookedAt).toLocaleTimeString()}</td>
                        <td className="border border-gray-300 p-2 text-blue-500 font-semibold">{new Date(table.bookedFrom).toLocaleTimeString()}</td>
                        <td className="border border-gray-300 p-2 text-red-500 font-semibold">
                          {Math.floor(table.countdown / 60)}:{String(table.countdown % 60).padStart(2, "0")}
                        </td>
                        <td className="border border-gray-300 p-2">
                          <button
                            onClick={() => cancelBooking(table.id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    )
                )}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No reservations yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
