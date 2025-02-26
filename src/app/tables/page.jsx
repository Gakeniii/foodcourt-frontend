// "use client";

// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";

export default function Tables() {
//   const [tables, setTables] = useState([null]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch tables from the database
//   useEffect(() => {
//     const fetchTables = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/bookings"); // Ensure this endpoint is correct
//         if (!response.ok) throw new Error("Failed to fetch tables");
  
//         const data = await response.json();
  
//         if (data.unbooked_tables && Array.isArray(data.unbooked_tables)) {
//           setTables(data.unbooked_tables); // Extract the array properly
//         } else {
//           throw new Error("Invalid data format: Expected an array");
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     fetchTables();
//   }, []);


//   // Handle booking toggle
//   const toggleBooking = async (tableId, available) => {
//     try {
//       const response = await fetch(`http://localhost:5000/bookings`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ available: !available }),
//       });

//       if (!response.ok) throw new Error("Failed to update table");

//       const updatedTable = await response.json();
//       setTables((prevTables) =>
//         prevTables.map((table) => (table.id === tableId ? updatedTable : table))
//       );
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   if (loading) return <p className="text-center text-gray-700">Loading tables...</p>;
//   if (error) return <p className="text-center text-red-500">{error}</p>;

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-300 p-8">
//       <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-lg">
//         <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Welcome!</h1>
//         <h1 className="text-2xl text-gray-700 text-center mb-6">Book a Table</h1>

//         {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}

//         <div className="grid grid-cols-3 gap-6 mt-6">
//           {tables.map((table) => (
//             <div
//               key={table.id}
//               className="flex flex-col items-center border-2 border-gray-300 rounded-lg p-4 shadow-md"
//             >
//               <motion.button
//                 onClick={() => toggleBooking(table.id, table.available)}
//                 whileTap={{ scale: 0.95 }}
//                 className={`p-6 rounded-lg font-semibold text-center text-lg transition duration-300 ease-in-out shadow-lg ${
//                   table.available
//                     ? "bg-green-500 hover:bg-green-600 text-white"
//                     : "bg-gray-500 hover:bg-gray-600 text-gray-100"
//                 }`}
//               >
//                 {table.available ? `Table ${table.id}` : `Table ${table.id} Booked`}
//               </motion.button>
//               <p className="text-gray-700 mt-2">Available for {table.availabilityTime} min</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
}
