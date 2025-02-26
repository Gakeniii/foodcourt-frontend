"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const OutletContext = createContext();

export const useOutlet = () => useContext(OutletContext);

export const OutletProvider = ({ children }) => {
  const [outlets, setOutlets] = useState([]); // Store fetched outlets
  const [selectedOutlet, setSelectedOutlet] = useState(null); // Track selected outlet

  // Fetch outlets from backend
  useEffect(() => {
    const fetchOutlets = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/outlets"); // Adjust API endpoint
        if (!response.ok) throw new Error("Failed to fetch outlets");
        const data = await response.json();
        setOutlets(data); // Store outlets in state
      } catch (error) {
        console.error("Error fetching outlets:", error);
      }
    };

    fetchOutlets();
  }, []);

  return (
    <OutletContext.Provider value={{ outlets, selectedOutlet, setSelectedOutlet }}>
      {children}
    </OutletContext.Provider>
  );
};
