"use client"

import { SessionProvider } from "next-auth/react"
import { CartProvider } from "./app/context/CartContext"
import { OutletProvider } from "./app/context/Outlet";
import { OrderProvider } from "./app/context/OrderContext";


export default function Providers({ children }){
    return (
        <SessionProvider>
            <CartProvider>
                <OutletProvider>
                    <OrderProvider>
                    {children}
                    </OrderProvider>
                </OutletProvider>
            </CartProvider>
        </SessionProvider>
    );
}