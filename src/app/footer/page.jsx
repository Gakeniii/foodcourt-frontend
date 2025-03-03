"use client"
import { usePathname } from 'next/navigation';
import './footer.css';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Star } from "lucide-react"
import Link from 'next/link';


export default function Footer() {
  const pathname = usePathname();

  const hiddenRoutes = ["/", "/auth/signup", "/auth/login"];
  if (hiddenRoutes.includes(pathname)) return null;
  return (
    <footer className=" relative bg-green-950 text-white pt-16 pb-8">
        <div className="absolute -top-10 left-0 w-full overflow-hidden leading-none">
          <svg
            viewBox="0 0 1440 320"
            className="w-full h-24"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg">
              <path
                className="fill-current text-green-900"
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
                  <Link href="/" className="text-gray-400 hover:text-amber-500 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-gray-400 hover:text-amber-500 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-gray-400 hover:text-amber-500 transition-colors">
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
  );
};