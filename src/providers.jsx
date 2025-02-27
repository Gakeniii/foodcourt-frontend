"use client"

import { SessionProvider } from "next-auth/react"
import { CartProvider } from "./app/context/CartContext"
import { OutletProvider } from "./app/context/Outlet";


export default function Providers({ children }){
    return (
        <SessionProvider>
            <CartProvider>
                <OutletProvider>
                {children}
                </OutletProvider>
            </CartProvider>
        </SessionProvider>
    );
}