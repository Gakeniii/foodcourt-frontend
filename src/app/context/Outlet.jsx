"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const OutletContext = createContext();

export const useOutlet = () => useContext(OutletContext);

export const OutletProvider = ({ children }) => {
  const [outlets, setOutlets] = useState([]);
  const [selectedOutlet, setSelectedOutlet] = useState(null);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  // Fetch outlets from backend
  useEffect(() => {
    const fetchOutlets = async () => {
      try {
        const response = await fetch(`${BASE_URL}/outlets`);
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
