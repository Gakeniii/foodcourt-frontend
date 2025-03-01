"use client";

import { useEffect, useState } from "react";
import Navbar from "../navbar";
import { io } from "socket.io-client";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [availableTables, setAvailableTables] = useState([]);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`${BASE_URL}/bookings`);
        if (!response.ok) throw new Error("Failed to fetch bookings");
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    const fetchAvailableTables = async () => {
      try {
        const response = await fetch(`${BASE_URL}/available`);
        if (!response.ok) throw new Error("Failed to fetch available tables");
        const data = await response.json();
        setAvailableTables(data.unbooked_tables || []);
      } catch (error) {
        console.error("Error fetching available tables:", error);
      }
    };

    fetchBookings();
    fetchAvailableTables();

    // ✅ Connect to Socket.IO
    const socket = io(SOCKET_URL, {
      transports: ["websocket"], // Ensure stable connection
    });

    // ✅ Listen for deleted booking event
    socket.on("booking_deleted", (deletedBooking) => {
      console.log("Booking deleted:", deletedBooking);

      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking.id !== deletedBooking.id)
      );
      
      fetchAvailableTables();
    });

    socket.on("table_available", (updatedTables) => {
      console.log("Updated available tables:", updatedTables);
      setAvailableTables(updatedTables);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const cancelReservation = async (bookingId) => {
    try {
      const response = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to cancel reservation");

      // ✅ Optimistically update the UI
      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking.id !== bookingId)
      );
    } catch (error) {
      console.error("Error cancelling reservation:", error);
    }
  };

  return (
    <div className="pt-20 p-6">
      <Navbar />
      <h1 className="text-3xl font-bold mb-6 text-center">Reserved Tables</h1>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-600">No bookings available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="p-4 border rounded-lg shadow-lg bg-white hover:shadow-xl transition-all"
            >
              <h2 className="text-lg font-semibold text-gray-600">Booking No.{booking.id}</h2>
              <p className="text-gray-700"><strong>Table Number:</strong> {booking.table_number}</p>
              <p className="text-gray-700"><strong>Date and Time:</strong> {booking.booking_time}</p>
              <p className="text-gray-700"><strong>Customer:</strong> {booking.customer_name}</p>
              <p className="text-gray-700"><strong>Email:</strong> {booking.customer_email}</p>
              <button
                onClick={() => cancelReservation(booking.id)}
                className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition"
              >
                Cancel Reservation
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
