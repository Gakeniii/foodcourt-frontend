import { CartProvider } from './context/CartContext';
import { Inter, Roboto_Mono } from "next/font/google";
import { Geist, Geist_Mono } from "next/font/google";
import Footer from './footer/page'; // Import the Footer component
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import Font Awesome CSS
import "./globals.css";
import { Navbar } from "./navigation/navbar";
import Providers from "@/providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const robotoMono = Roboto_Mono({ subsets: ["latin"], variable: "--font-roboto-mono" });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      
      {/* <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
          integrity="sha384-k6RqeWeci5ZR/Lv4MR0sA0FfDOMWSfGmW3GScd6g4vGI2C/4VpGV5zlh9Bl2J79j"
          crossOrigin="anonymous" 
        />
      </head> */}
      <body className={`${inter.variable} ${robotoMono.variable} antialiased`}>
        <Navbar/>

        <Providers>
        {children}
        </Providers>       
      </body>
    </html>
  );
}
