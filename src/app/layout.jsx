import { Inter } from "next/font/google";
import Navbar from './navigation/navbar';
import Footer from './footer/page'; // Import the Footer component
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import Font Awesome CSS
import "./globals.css";
import { Roboto } from 'next/font/google';
import { JetBrains_Mono } from '@fontsource/jetbrains-mono';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "700"], // Specify the weights you want to use
});

const jetBrainsMono = {
  variable: "jetBrainsMono",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
          integrity="sha384-k6RqeWeci5ZR/Lv4MR0sA0FfDOMWSfGmW3GScd6g4vGI2C/4VpGV5zlh9Bl2J79j"
          crossOrigin="anonymous" 
        />
      </head>
      <body className={`${inter.variable} ${roboto.variable} ${jetBrainsMono.variable} antialiased`}>
        {children}
        <Footer /> {/* Add the Footer component here */}
      </body>
    </html>
  );
}
