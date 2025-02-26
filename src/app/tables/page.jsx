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
