
"use client";
import { useEffect, useState } from "react";
import AvailableTables from "../AvailableTable/page";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Tables() {
  const { data: session, status } = useSession();
  const [availableTables, setAvailableTables] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [reservedTable, setReservedTable] = useState(null);
  const [reservationDateTime, setReservationDateTime] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); 
  const [lastReservationDisplayTime, setLastReservationDisplayTime] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const router = useRouter();

  const fetchAvailableTables = async () => {
    try {
      const response = await fetch(`${BASE_URL}/available`);
      if (!response.ok) throw new Error("Failed to fetch available tables");
      const data = await response.json();
      if (Array.isArray(data.unbooked_tables)) {
        setAvailableTables(data.unbooked_tables);
      } else {
        console.error("Error: Expected an array but got:", data);
      }
    } catch (error) {
      console.error("Error fetching tables:", error);
    }
  };

  const fetchUserReservations = async () => {
    if (!session?.user?.id) return;
  
    const url = `${BASE_URL}/users/${session.user.id}`;  
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });
    
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      const transformedBookings = (data.bookings || []).map((booking) => {
        const dateObj = new Date(booking.booking_time);
        return {
          ...booking,
          booking_time: isNaN(dateObj.getTime()) ? "Invalid Date" : dateObj.toLocaleString(),
        };
      });
      setReservations(transformedBookings);
  
    } catch (error) {
      console.error("Error fetching user reservations:", error);
    }
  };
  
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user) {
      fetchAvailableTables();
      fetchUserReservations();
    }
  }, [status, router, session]);

  const bookTable = async () => {
    if (!session || !session.user) {
      setErrorMessage("You must be logged in to book a table!");
      return;
    }

    setErrorMessage("");
    setIsLoading(true);

    if (!reservedTable || !reservationDateTime) {
      setErrorMessage("⚠️ Please select a table and reservation date & time!");
      return;
    }

    const selectedTime = new Date(reservationDateTime);
    if (isNaN(selectedTime.getTime())) {
      setErrorMessage("Invalid date format. Please select a valid date & time.");
      return;
    }

    const now = new Date();
    const timeDiffMinutes = (selectedTime - now) / (1000 * 60);
    if (timeDiffMinutes < 20) {
      setErrorMessage("You must book at least 20-30 minutes before arriving.");
      return;
    }

    const formattedBookingTime = selectedTime.toISOString();
    const displayBookingTime = new Date(formattedBookingTime).toLocaleString();

    try {
      const bookingResponse = await fetch(`${BASE_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({
          customer_id: session.user.id,
          table_number: reservedTable,
          booking_time: formattedBookingTime,
        }),
      });

      const responseData = await bookingResponse.json();
      if (!bookingResponse.ok) {
        throw new Error(responseData.error || "Failed to book table");
      }

      setAvailableTables((prevTables) =>
        prevTables.filter((table) => table.number !== reservedTable)
      );
      
      setLastReservationDisplayTime(displayBookingTime);

      const newReservation = {
        table_number: reservedTable,
        booking_time: displayBookingTime,
        booking_id: responseData.booking_id || Date.now(),
      };

      setReservations((prevReservations) => [newReservation, ...prevReservations]);

      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        setReservedTable(null);
        setReservationDateTime("");
        fetchAvailableTables();
        fetchUserReservations();
        router.refresh();
      }, 3000);
    } catch (error) {
      console.error("Error reserving table:", error);
      setErrorMessage(error.message || "Error reserving the table. Please try again.");
    }
  };

  return (
    <div className="pt-20 p-6">
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
            <h2 className="text-lg font-semibold text-green-600">✅ Reservation Successful!</h2>
            <p className="text-gray-700 mt-2">
              You have booked Table No.{reservedTable} for {" "}
              {lastReservationDisplayTime ||
                new Date(reservationDateTime).toLocaleString()}
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ✅ Error Message Popup */}
      {errorMessage && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-red-500 text-white font-semibold text-center p-6 rounded-lg shadow-lg w-3/4 md:w-1/2 lg:w-1/3">
            {errorMessage}
            <button
              onClick={() => setErrorMessage("")}
              className="block mt-4 bg-white text-red-600 px-4 py-2 rounded-md mx-auto"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ✅ Display Recent Reservations */}
      <div className="mb-6 p-4 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl text-gray-700 font-semibold text-center mb-4">Reservations</h1>
        <h2 className="text-xl font-semibold text-center mb-4">Recent Reservations</h2>
        {reservations.length > 0 ? (
          <ul className="list-disc pl-5">
            {reservations.map((res, index) => (
              <li key={index} className="text-gray-800">
                Table No.{res.table_number} for {res.booking_time}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">No reservations yet.</p>
        )}
      </div>

      {/* ✅ Booking Section */}
      <div className="p-4 bg-white shadow-md rounded-lg">
        <h2 className="text-xl text-center font-semibold mb-2">Reserve a Table</h2>
        <p className="text-sm text-red-600 bg-yellow-100 p-3 rounded-md text-center mb-4">
          Please note: Reservations must be made at least 20-30 minutes before your arrival.
        </p>
        <label className="block text-gray-700 font-medium mb-1">Select Date & Time:</label>
        <input
          type="datetime-local"
          value={reservationDateTime}
          onChange={(e) => setReservationDateTime(e.target.value)}
          className="border border-gray-300 p-2 rounded-md w-full mb-2"
        />
        <label className="block text-gray-700 font-medium mb-1">Select Table:</label>
        <AvailableTables tables={availableTables} onSelectTable={setReservedTable} />
        <button
          onClick={bookTable}
          className="bg-amber-500 text-white px-4 py-2 rounded-full hover: transition duration-200 w-full mt-4"
        >
          {isLoading ? "Loading..." : "Reserve Table"}
        </button>
      </div>
      <br></br>
      <br></br>
      <br></br>
    </div>
  );
}