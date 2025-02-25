"use client";

import React, { createContext, useContext, useState } from 'react';

const OutletContext = createContext();

export const useOutlet = () => useContext(OutletContext);

export const OutletProvider = ({ children }) => {
  const [outlet, setOutlet] = useState({
    id: 5,
    name: "L'Atelier de paris",
  });

  return (
    <OutletContext.Provider value={{ outlet, setOutlet }}>
      {children}
    </OutletContext.Provider>
  );
};
