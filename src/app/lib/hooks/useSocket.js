import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "http://127.0.0.1:5000";

export function useSocket() {
  const [socket, setSocket] = useState(null);
  const [orderUpdate, setOrderUpdate] = useState(null);

  useEffect(() => {
    // Initialize Socket.IO connection
    const socketInstance = io(SOCKET_SERVER_URL);
    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("Connected to WebSocket server ✅");
    });

    socketInstance.on("order_status_update", (data) => {
      console.log("Order Updated:", data);
      setOrderUpdate(data);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return { socket, orderUpdate };
}