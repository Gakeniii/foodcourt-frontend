// src/app/layout.jsx
import { Geist, Geist_Mono } from "next/font/google";
import Footer from './footer/page'; 
import "@fortawesome/fontawesome-free/css/all.min.css"; 
import "./globals.css";
import { CartProvider } from './context/CartContext'; 
import { OutletProvider } from './context/OutletContext'; 
import ClientLayout from './clientLayout/ClientLayout'; // Import the new ClientLayout component

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <OutletProvider>
      <CartProvider>
        <html lang="en">
          <head>
            <link
              rel="stylesheet"
              href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
              integrity="sha384-k6RqeWeci5ZR/Lv4MR0sA0FfDOMWSfGmW3GScd6g4vGI2C/4VpGV5zlh9Bl2J79j"
              crossOrigin="anonymous"
            />
          </head>
          <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <ClientLayout> {/* Wrap the children with ClientLayout */}
              {children}
            </ClientLayout>
            {/* <Footer /> Add the Footer component here */}
          </body>
        </html>
      </CartProvider>
    </OutletProvider>
  );
}
