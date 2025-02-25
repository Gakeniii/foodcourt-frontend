"use client"
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {Twitter, Instagram, Facebook } from 'lucide-react';

const MotionDiv = dynamic(() => import('framer-motion').then(mod => mod.motion.div), { ssr: false });


export default function LandingPage() {
  return (
    <div 
    className="min-h-screen bg-fit bg-center bg-no-repeat flex flex-col items-center justify-center text-white"
    style={{backgroundImage: "url('https://koa.com/blog/images/healthy-foods.jpg?preset=heroimagecropped')"}}>
      {/* Navbar */}
      <nav className="absolute top-0 left-0 right-0 p-5 flex justify-between items-center bg-black bg-opacity-50 backdrop-blur-md shadow-md">
        <h1 className="text-2xl font-bold text-brown-800">Foodie Eats</h1>
        <div>
          <Link href="/auth/login" className="px-4 py-2 text-white bg-brown-600 rounded-3xl mr-2 hover:bg-black hover:scale-110 transition-transform transition-all duration-300 ease-in-out">Login</Link>
          <Link href="/auth/signup" className="px-4 py-2 text-white bg-black-600 rounded-3xl hover:bg-black hover:scale-110 transition-transform transition-all duration-300 ease-in-out">Sign Up</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="text-center mt-20 p-10 bg-black bg-opacity-50 rounded-xl backdrop-blur-md shadow-md">
        <h2 className="text-5xl font-extrabold mb-4 drop-shadow-lg">Hi Foodie 🖐🏼!</h2>
      <div className="mt-10 text-center p-4 bg-white bg-opacity-30 rounded-lg shadow-md">
        <p className="text-2xl font-semibold text-brown-800">Feeling hungry?</p>
        <p className="text-lg text-brown-700">Let’s taco ‘bout it over some delicious food! 🌮😂</p>
      </div>
        <p className="text-lg text-brown-200 max-w-xl mx-auto">
          Order delicious meals at your convenience and experience a seamless dining adventure today!.
        </p>
        <MotionDiv
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeIn" }}
          whileHover={{ scale: 1.1 }}
        >
          <Link
            href="/auth/signup"
            className="mt-6 inline-block px-6 py-3 text-lg font-bold bg-orange-500 rounded-xl shadow-lg hover:bg-orange-600 transition-all"
          >
            Get Started
          </Link>
        </MotionDiv>

        <div className="mt-6 flex justify-center gap-6">
          <Link href="https://tiktok.com" target="_blank" className="text-white text-2xl hover:scale-110 transition-transform">
            <Facebook size={32} className="text-white" />
          </Link>
          <Link href="https://twitter.com" target="_blank" className="text-white text-2xl hover:scale-110 transition-transform">
            <Twitter size={32} className="text-white" />
          </Link>
          <Link href="https://instagram.com" target="_blank" className="text-white text-2xl hover:scale-110 transition-transform">
            <Instagram size={32} className="text-white" />
          </Link>
        </div>

      </div>
    </div>
  );
}



