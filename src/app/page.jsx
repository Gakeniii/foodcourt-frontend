
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Star } from "lucide-react"

const foodImages = [
  "https://skinnyspatula.com/wp-content/uploads/2022/01/Pink_Pasta_Sauce1.jpg",
  "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?cs=srgb&dl=pexels-janetrangdoan-1092730.jpg&fm=jpg",
  "https://wallpapers.com/images/featured/delicious-food-pictures-i5wjpvjqrk3qroy0.jpg",
  "https://images.contentstack.io/v3/assets/bltcedd8dbd5891265b/blt6542458a3d1e8c6f/664cbc3d213dc5f7fd48a20e/origin-of-sushi-hero.jpeg?q=70&width=3840&auto=webp",
  "https://honeyngreens.co.uk/cdn/shop/articles/joseph-gonzalez-zcUgjyqEwe8-unsplash.jpg?v=1706905216&width=1100",
]

const storyImage = ["https://img.freepik.com/free-vector/hand-drawn-vegetarian-food-instagram-stories_23-2149115013.jpg"]

const testimonials = [
  {
    name: "Sarah Johnson",
    rating: 5,
    comment: "The food service was prompt and the meal was absolutely delicious! Will definitely order again.",
    image: "https://img.freepik.com/free-photo/confident-business-woman-portrait-smiling-face_53876-137693.jpg?t=st=1740898339~exp=1740901939~hmac=6a39ae57b684b611b6eac60df1e39ac6a5c6737bea7f69ba7e757c89621b4adb&w=1380",
  },
  {
    name: "Michael Chen",
    rating: 5,
    comment: "Foodie Eats has the best selection of restaurants in town. The app is so easy to use!",
    image: "https://img.freepik.com/free-photo/black-man-posing_23-2148171637.jpg?t=st=1740898390~exp=1740901990~hmac=07c032a02b7468514eeb83b359971976287f233b0c278ec0dca2b825777a73ff&w=740",
  },
  {
    name: "Marcus Rodriguez",
    rating: 4,
    comment: "Great variety of food options and excellent customer service when I had a question.",
    image: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg",
  },
]

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % foodImages.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-4xl text-gray-800 font-bold">
              Foodie<span className="text-amber-500">.Eats</span>
            </span>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link href="#home" className="text-gray-800 hover:text-amber-500 transition-colors">
              Home
            </Link>
            <Link href="#about" className="text-gray-800 hover:text-amber-500 transition-colors">
              About Us
            </Link>
            <Link href="#menu" className="text-gray-800 hover:text-amber-500 transition-colors">
              Our Menu
            </Link>
            <Link href="#testimonials" className="text-gray-800 hover:text-amber-500 transition-colors">
              Testimonials
            </Link>
          </nav>

          <div className="hidden md:block">
            <Link
              href="/auth/signup"
              className="bg-amber-500 text-white px-6 py-2 rounded-full hover:bg-amber-600 transition-colors"
            >
              Order Now
            </Link>
          </div>

          <button className="md:hidden text-gray-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Hero Section with Slideshow */}
      <section
        id="home"
        className="relative min-h-screen pt-16 overflow-hidden bg-gradient-to-r from-amber-500 to-amber-400"
      >
        <div className="container mx-auto px-4 h-full relative z-10">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between h-full py-12">
          
          {/* Slideshow on the Left */}
          <div className="w-full lg:w-1/2 flex justify-start">
            <div className="relative h-[600px] ml-0 lg:h-[400px] w-[80%] lg:w-[90%] overflow-hidden rounded-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5 }}
                  className="absolute inset-0 w-full h-full"
                >
                  <img
                    src={foodImages[currentSlide]}
                    alt={`Food image ${currentSlide + 1}`}
                    className="w-full h-full object-cover rounded-6xl"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Text Content on the Right */}
          <div className="w-full lg:w-1/2 mb-8 lg:mb-0 text-white text-center lg:text-left lg:mr-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Have no time to <br />
              prepare <span className="text-amber-200">food</span>?
            </h1>
            <p className="text-white/90 text-lg mb-8 max-w-md mx-auto lg:mx-0">
              Choose one of our plans, enter delivery time, and enjoy delicious food without leaving your home!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/auth/signup"
                className="bg-white text-amber-500 px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors text-center"
              >
                Order Now
              </Link>
              <Link
                href="#about"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white/10 transition-colors text-center"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

        {/* Curved bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white rounded-t-[50%] z-20"></div>
      </section>

      {/* About Section with Parallax */}
      <section id="about" className="relative py-20 overflow-hidden">
        <motion.div className="absolute inset-0 -z-10" style={{ y: 0 }}>
          {" "}
          {/*Removed parallax*/}
          <Image
            src="/placeholder.svg?height=1000&width=1920&text=Food+Background"
            alt="Parallax background"
            fill
            className="object-cover opacity-10"
          />
        </motion.div>

        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl text-gray-700 md:text-4xl font-bold mb-4">
              About <span className="text-amber-500">Foodie Eats</span>
            </h2>
            <div className="w-20 h-1 bg-amber-500 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Delicious Food Served At Nextgen Mall</h3>
              <p className="text-gray-600 mb-6">
                Foodie Eats is your premier food app serviced to, connecting you with the best restaurants inside NEXTGEN mall
                .We believe that great food should be accessible to everyone, which is why we've made it our
                mission to enhance your foodcourt experience.
              </p>
              <p className="text-gray-600 mb-6">
                With our easy-to-use app, you can browse menus, customize your orders, and reserve your table in
                real-time. Whether you're craving comfort food, healthy options, or international cuisine, we've got you
                covered.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Fast Service</h4>
                    <p className="text-sm text-gray-500">30 min or less</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 004 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Easy Ordering</h4>
                    <p className="text-sm text-gray-500">User-friendly app</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0M8 10.5h4m-4 3h4m9-1.5a9 9 0 11-18 0 9 9 0 0018 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Best Prices</h4>
                    <p className="text-sm text-gray-500">Special offers daily</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <img
                src={storyImage[0]}
                alt="About Foodie Eats"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <div className="text-white">
                  <p className="text-lg font-medium">Discover</p>
                  <h3 className="text-2xl font-bold">Our Story</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-amber-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
            <div className="w-20 h-1 bg-amber-500 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                  <div>
                    <h4 className="font-medium">{testimonial.name}</h4>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < testimonial.rating ? "fill-amber-500 text-amber-500" : "text-gray-300"}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.comment}"</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/auth/signup"
              className="bg-amber-500 text-white px-8 py-3 rounded-full font-medium hover:bg-amber-600 transition-colors inline-block"
            >
              Join Foodie Eats Today
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-amber-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2ZkzT6flYdLGDxIUfeJQtUzgyfzdPqRQ7GQ&s"
            alt="Background pattern"
            className="w-full object-cover"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to satisfy your cravings?</h2>
            <p className="text-xl mb-8">Download our app now and get your first delivery free!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="bg-white text-amber-500 px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors text-center"
              >
                Order Now
              </Link>
              <Link
                href="#"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white/10 transition-colors text-center"
              >
                View Menu
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className=" relative bg-green-950 text-white pt-16 pb-8">
        <div className="absolute -top-10 left-0 w-full overflow-hidden leading-none">
          <svg
            viewBox="0 0 1440 320"
            className="w-full h-24"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg">
              <path
                fill="#065F46"
                d="M0,288L48,266.7C96,245,192,203,288,202.7C384,203,480,245,576,256C672,267,768,245,864,213.3C960,181,1056,139,1152,133.3C1248,128,1344,160,1392,176L1440,192L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
              />
            </svg>
        </div>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">
                Foodie<span className="text-amber-500">.Eats</span>
              </h3>
              <p className="text-gray-400 mb-4">
                Delicious food delivered to your doorstep. Fast, reliable, and always fresh.
              </p>
              <div className="flex space-x-4">
                <a href="https://facebook.com" className="text-gray-400 hover:text-amber-500 transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="https://instagram.com" className="text-gray-400 hover:text-amber-500 transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="https://twitter.com" className="text-gray-400 hover:text-amber-500 transition-colors">
                  <Twitter size={20} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#home" className="text-gray-400 hover:text-amber-500 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="#about" className="text-gray-400 hover:text-amber-500 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#menu" className="text-gray-400 hover:text-amber-500 transition-colors">
                    Our Menu
                  </Link>
                </li>
                <li>
                  <Link href="#testimonials" className="text-gray-400 hover:text-amber-500 transition-colors">
                    Testimonials
                  </Link>
                </li>
                <li>
                  <Link href="/auth/signup" className="text-gray-400 hover:text-amber-500 transition-colors">
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <MapPin size={20} className="text-amber-500 flex-shrink-0 mt-1" />
                  <span className="text-gray-400">123 Foodie Street, Culinary District, Flavor City, FC 12345</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={20} className="text-amber-500" />
                  <span className="text-gray-400">+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={20} className="text-amber-500" />
                  <span className="text-gray-400">info@foodieeats.com</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-4">Opening Hours</h4>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-400">Monday - Friday</span>
                  <span className="text-amber-500">8:00 AM - 10:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-400">Saturday</span>
                  <span className="text-amber-500">9:00 AM - 11:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-400">Sunday</span>
                  <span className="text-amber-500">10:00 AM - 9:00 PM</span>
                </li>
              </ul>
              <div className="mt-4">
                <a href="https://foodieeats.com" className="text-amber-500 hover:text-amber-400 transition-colors">
                  www.foodieeats.com
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Foodie Eats. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}



// "use client"
// import Link from 'next/link';
// import dynamic from 'next/dynamic';
// import {Twitter, Instagram, Facebook } from 'lucide-react';

// const MotionDiv = dynamic(() => import('framer-motion').then(mod => mod.motion.div), { ssr: false });


// export default function LandingPage() {
//   return (
//     <div 
//     className="min-h-screen bg-fit bg-center bg-no-repeat flex flex-col items-center justify-center text-white"
//     style={{backgroundImage: "url('https://koa.com/blog/images/healthy-foods.jpg?preset=heroimagecropped')"}}>
//       {/* Navbar */}
//       <nav className="absolute top-0 left-0 right-0 p-5 flex justify-between items-center bg-black bg-opacity-50 backdrop-blur-md shadow-md">
//         <h1 className="text-2xl font-bold text-brown-800">Foodie Eats</h1>
//         <div>
//           <Link href="/auth/login" className="px-4 py-2 text-white bg-brown-600 rounded-3xl mr-2 hover:bg-black hover:scale-110 transition-transform transition-all duration-300 ease-in-out">Login</Link>
//           <Link href="/auth/signup" className="px-4 py-2 text-white bg-black-600 rounded-3xl hover:bg-black hover:scale-110 transition-transform transition-all duration-300 ease-in-out">Sign Up</Link>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <div className="text-center mt-20 p-10 bg-black bg-opacity-50 rounded-xl backdrop-blur-md shadow-md">
//         <h2 className="text-5xl font-extrabold mb-4 drop-shadow-lg">Hi Foodie 🖐🏼!</h2>
//       <div className="mt-10 text-center p-4 bg-white bg-opacity-30 rounded-lg shadow-md">
//         <p className="text-2xl font-semibold text-brown-800">Feeling hungry?</p>
//         <p className="text-lg text-brown-700">Let’s taco ‘bout it over some delicious food! 🌮😂</p>
//       </div>
//         <p className="text-lg text-brown-200 max-w-xl mx-auto">
//           Order delicious meals at your convenience and experience a seamless dining adventure today!.
//         </p>
//         <MotionDiv
//           initial={{ scale: 0.8, opacity: 0, y: 20 }}
//           animate={{ scale: 1, opacity: 1, y: 0 }}
//           transition={{ duration: 0.2, ease: "easeIn" }}
//           whileHover={{ scale: 1.1 }}
//         >
//           <Link
//             href="/auth/signup"
//             className="mt-6 inline-block px-6 py-3 text-lg font-bold bg-orange-500 rounded-xl shadow-lg hover:bg-orange-600 transition-all"
//           >
//             Get Started
//           </Link>
//         </MotionDiv>

//         <div className="mt-6 flex justify-center gap-6">
//           <Link href="https://tiktok.com" target="_blank" className="text-white text-2xl hover:scale-110 transition-transform">
//             <Facebook size={32} className="text-white" />
//           </Link>
//           <Link href="https://twitter.com" target="_blank" className="text-white text-2xl hover:scale-110 transition-transform">
//             <Twitter size={32} className="text-white" />
//           </Link>
//           <Link href="https://instagram.com" target="_blank" className="text-white text-2xl hover:scale-110 transition-transform">
//             <Instagram size={32} className="text-white" />
//           </Link>
//         </div>

//       </div>
//     </div>
//   );
// }

// // "use client";
// // import dynamic from 'next/dynamic';

// // const MotionDiv = dynamic(() => import('framer-motion').then(mod => mod.motion.div), { ssr: false });

// // export default function LandingPage() {
// //   return (
// //     <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
// //       <h1>Test</h1>
// //     </MotionDiv>
// //   );
// // }

