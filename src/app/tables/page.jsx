"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation"; // Ensure this import is correct

export default function Tables() {
  const [tables, setTables] = useState([]); // Initialize tables as an empty array
  const [error, setError] = useState(null);
  const [redirectTableId, setRedirectTableId] = useState(null); // New state to handle navigation
  const router = useRouter(); // Initialize the router
useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch("https://foodcourt-db.onrender.com/bookings");
        if (!response.ok) {
          throw new Error("Failed to fetch table data");
        }
        const data = await response.json();
   const mappedTables = data.map((table) => ({
          id: table.id,
          available: table.available,
          bookedAt: table.bookedAt ? new Date(table.bookedAt) : null,
          bookedFrom: table.bookedFrom ? new Date(table.bookedFrom) : null,
          countdown: table.countdown || 0, // Remaining time in seconds
          availabilityTime: table.availabilityTime || (Math.random() < 0.5 ? 20 : 30), // Random availability time (20 or 30 minutes)
        }));
         const cancelBooking = (tableId) => {
    setTables((prevTables) =>
      prevTables.map((table) =>
        table.id === tableId
          ? { ...table, available: true, bookedAt: null, bookedFrom: null, countdown: 0 }
          : table
      )
    );
  };
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


        setTables(mappedTables);
      } catch (error) {
        console.error("Error fetching tables:", error);
        setError("Failed to load table data. Please try again later.");
      }
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
    };

    fetchTables();
  }, []);
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
