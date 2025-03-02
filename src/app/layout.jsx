import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/providers";
import { Navbar } from "./navigation/navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const robotoMono = Roboto_Mono({ subsets: ["latin"], variable: "--font-roboto-mono" });

export default function RootLayout({ children }) {
  
  return (
    <html lang="en">
      <body className={`${inter.variable} ${robotoMono.variable} antialiased`}>
        <Providers>
        <Navbar/>
        {children}
        </Providers>
      </body>
    </html>
  );
}
