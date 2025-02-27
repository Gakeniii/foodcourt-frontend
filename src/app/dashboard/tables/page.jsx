"use client";

import { useEffect, useState } from "react";

// import { useEffect, useState } from "react";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/bookings");
        if (!response.ok) throw new Error("Failed to fetch bookings");
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Table Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-600">No bookings available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="p-4 border rounded-lg shadow-lg bg-white hover:shadow-xl transition-all"
            >
              <h2 className="text-lg font-semibold text-blue-600">Booking #{booking.id}</h2>
              <p className="text-gray-700">📌 <strong>Table Number:</strong> {booking.table_number}</p>
              <p className="text-gray-700">⏰ <strong>Date and Time:</strong> {booking.booking_time}</p>
              <p className="text-gray-700">🧑 <strong>Customer:</strong> {booking.customer_name}</p>
              <p className="text-gray-700">📧 <strong>Email:</strong> {booking.customer_email}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
