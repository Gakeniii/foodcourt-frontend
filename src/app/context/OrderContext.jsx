// "use client";
// import { createContext, useContext, useState } from "react";

// const OrderContext = createContext();

// export function OrderProvider({ children }) {
//   const [orderItems, setOrderItems] = useState([]);

//   const addToOrder = (item) => {
//     setOrderItems((prev) => {
//       const existingItem = prev.find((orderItem) => orderItem.id === item.id);
//       if (existingItem) {
//         return prev.map((orderItem) =>
//           orderItem.id === item.id
//             ? { ...orderItem, quantity: orderItem.quantity + 1, totalPrice: orderItem.totalPrice + item.price }
//             : orderItem
//         );
//       }
//       return [...prev, { ...item, quantity: 1, totalPrice: item.price }];
//     });
//   };

//   return (
//     <OrderContext.Provider value={{ orderItems, addToOrder }}>
//       {children}
//     </OrderContext.Provider>
//   );
// }

// export function useOrder() {
//   return useContext(OrderContext);
// }
