import { useState, useEffect } from "react";

function AvailableTables({ onSelectTable }) {
  const [availableTables, setAvailableTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    fetch(`${BASE_URL}/available`)
      .then((response) => response.json())
      .then((data) => setAvailableTables(data.unbooked_tables))
      .catch((error) => console.error("Error fetching available tables:", error));
  }, []);

  const handleSelectTable = (table_number) => {
    setSelectedTable(table_number);
    onSelectTable(table_number);
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-xl mx-auto">
      <h3 className="text-xl font-semibold mb-4 text-center">Available Tables</h3>
      {availableTables.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {availableTables.map((table_number) => (
            <button
              key={table_number}
              onClick={() => handleSelectTable(table_number)}
              className={`p-6 rounded-lg text-center font-semibold transition-all flex items-center justify-center 
                ${
                  selectedTable === table_number
                    ? "bg-green-800 text-white shadow-md scale-105"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
            >
              Table {table_number} {selectedTable === table_number ? "✔" : ""}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No tables available</p>
      )}
    </div>
  );
}

export default AvailableTables;