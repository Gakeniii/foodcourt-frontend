"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./login.css";
import { getSession, signIn } from "next-auth/react";
import { Mail, Lock, Eye } from "lucide-react";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setErrors({});
    setIsLoading(true);
  
    try {
      const signInResult = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });
      if (signInResult.error) {
        setError(signInResult.error);
        console.log(signInResult);
      } else {
        const session = await getSession()
    
        console.log("Session Data:", session)

        if (session?.user?.role === "Customer") {
          router.push("/home");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err) {
      setError("Something went wrong!");
    }
};


  return (
      <div className="h-screen w-screen flex items-center justify-center bg-cover bg-center bg-no-repeat">
        <div className="flex flex-row-reverse w-full h-screen">
          {/* Right column - Background image (hidden on mobile) */}
          <div
            className="hidden md:block w-1/2 h-full bg-cover bg-right"
            style={{
              backgroundImage: "url('https://st.depositphotos.com/16122460/59967/i/450/depositphotos_599672204-stock-photo-fresh-ripe-lemons-green-leaves.jpg')",
            }}
          ></div>
    
          {/* Left column - Centered form */}
          <div className="w-full md:w-1/2 bg-amber-50 flex flex-col justify-center items-center">
            {/* Mobile curved image */}
            <div className="md:hidden relative w-full">
              <div
                className="h-[360px] bg-cover bg-center"
                style={{
                  backgroundImage: "url('https://plus.unsplash.com/premium_photo-1692976030153-9fd2a84bd711?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8eWVsbG93JTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D')",
                  borderBottomLeftRadius: "50% 10%",
                  borderBottomRightRadius: "50% 10%",
                }}
              ></div>
            </div>
    
            {/* Form container */}
            <div className="w-3/8 px-8">
              {/* Form header */}
              <div className="mb-8 flex justify-between items-center">
                <h2 className="text-3xl font-bold text-green-950">Welcome Back!</h2>
              </div>
    
              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-5 flex-1">
                {/* Email */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-amber-500" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full !bg-amber-100 rounded-lg py-3 px-10 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
    
                {/* Password */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-amber-500" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    className="w-full !bg-amber-100 rounded-lg py-3 px-10 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <Eye className="h-5 w-5 text-gray-400" />
                  </button>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>
    
                {/* Forgot Password */}
                <div className="text-right">
                  <a href="#" className="text-amber-500 text-xs hover:underline">
                    Forgot your password?
                  </a>
                </div>
                {/* Divider */}
                <div className="flex items-center my-6">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="px-4 text-gray-500 text-sm font-medium">OR</span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>

                {/* Social Login */}
                <div className="flex justify-center space-x-4">
                  <button type="button" className="p-2 bg-white rounded-full shadow-md">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  </button>
                  <button type="button" className="p-2 bg-white rounded-full shadow-md">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </button>
                  <button type="button" className="p-2 bg-white rounded-full shadow-md">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#000000" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.05 20.28c-.98.95-2.05.88-3.09.54-1.07-.36-2.06-.35-3.17 0-1.4.44-2.13.31-3.01-.54-4.19-4.27-3.5-11.44 1.4-11.62 1.39.06 2.36.95 3.07.95.71 0 2.05-.94 3.64-.8 1.23.1 2.32.51 3.11 1.45-2.89 1.73-2.39 5.75.48 7.02-1.17 2.37-2.82 4.67-2.43 7zm-3.19-17.53c-2.26.36-4.22 2.39-3.93 4.84 2.19.08 4.24-2.14 3.93-4.84z"/>
                    </svg>
                  </button>
                </div>
    
                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-amber-500 text-white py-3 rounded-full hover:bg-amber-600 transition-colors font-semibold text-sm"
                >
                  {isLoading ? "Loading..." : "Sign In"}
                </button>
              </form><br></br>
    
              <p className="text-gray-500 text-sm mt-1">
                New to our platform?{" "}
                <a href="/auth/signup" className="text-amber-500 font-semibold ml-1 hover:underline">
                  Sign Up
                </a>
              </p>
            </div>
            <br></br>
            <br></br>
          </div>
        </div>
      </div>
    );    
}
