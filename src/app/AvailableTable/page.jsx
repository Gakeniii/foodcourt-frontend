import { useState, useEffect } from "react";

function AvailableTables({ onSelectTable }) {
  const [availableTables, setAvailableTables] = useState([]);

  useEffect(() => {
    // Fetch available tables from the API
    fetch("http://localhost:5000/available")
      .then((response) => response.json())
      .then((data) => setAvailableTables(data.unbooked_tables)) // Adjusted to match the new API response
      .catch((error) => console.error("Error fetching available tables:", error));
  }, []);

  return (
    <div>
      <h3>Available Tables</h3>
      {availableTables.length > 0 ? (
        <ul>
          {availableTables.map((table_number) => (
            <li key={table_number}>
              <button onClick={() => onSelectTable(table_number)}>
                Table {table_number} - Available
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tables available</p>
      )}
    </div>
  );
}

export default AvailableTables;
