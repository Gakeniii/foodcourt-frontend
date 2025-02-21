"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Tables() {
  const [tables, setTables] = useState(
    Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      available: true,
      bookedAt: null,
      bookedFrom: null,
      countdown: 0, // Remaining time in seconds
    }))
  );
  const [error, setError] = useState(null);

  const toggleBooking = (tableId) => {
    setTables((prevTables) =>
      prevTables.map((table) =>
        table.id === tableId
          ? table.available
            ? (() => {
                const bookedAt = new Date();
                const countdownMinutes = Math.floor(Math.random() * (30 - 20 + 1) + 20);
                const countdown = countdownMinutes * 60;
                const bookedFrom = new Date(bookedAt.getTime() + countdown * 1000);

                return {
                  ...table,
                  available: false,
                  bookedAt,
                  bookedFrom,
                  countdown,
                };
              })()
            : { ...table, available: true, bookedAt: null, bookedFrom: null, countdown: 0 }
          : table
      )
    );
    setError(null);
  };

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
            <motion.button
              key={table.id}
              onClick={() => toggleBooking(table.id)}
              whileTap={{ scale: 0.95 }}
              className={`p-6 rounded-lg font-semibold text-center text-lg transition duration-300 ease-in-out shadow-lg ${
                table.available
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-gray-500 hover:bg-gray-600 text-gray-100"
              }`}
            >
              {table.available ? `Table ${table.id}` : `Cancel Table ${table.id}`}
            </motion.button>
          ))}
        </div>

        <div className="mt-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Reservations</h2>
          {tables.some((table) => !table.available) ? (
            <ul className="space-y-2">
              {tables.map(
                (table) =>
                  !table.available && (
                    <li key={table.id} className="text-gray-700 text-lg">
                      Table {table.id} booked at{" "}
                      <span className="font-semibold">
                        {new Date(table.bookedAt).toLocaleTimeString()}
                      </span>{" "}
                      | Arrive by:{" "}
                      <span className="text-blue-500 font-semibold">
                        {new Date(table.bookedFrom).toLocaleTimeString()}
                      </span>{" "}
                      | Time left:{" "}
                      <span className="text-red-500 font-semibold">
                        {Math.floor(table.countdown / 60)}:
                        {String(table.countdown % 60).padStart(2, "0")}
                      </span>
                    </li>
                  )
              )}
            </ul>
          ) : (
            <p className="text-gray-500">No tables booked yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
