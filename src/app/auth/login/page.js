"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "./login.css";
// import { signIn } from "next-auth/react";
import { login } from "@/app/lib/utils";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const router = useRouter();


  // Basic form validation
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
  
    try {
      const userData = await login(formData.email, formData.password);
      console.log("User Data:", userData); // Debugging
  
      if (!userData || !userData.user || !userData.user.role) {
          setError("Login failed. Please try again.");
          return;
      }
  
      // Extract user role correctly
      const userRole = userData.user.role;
  
      // Redirect based on role
      router.push(userRole === "Customer" ? "/home" : "/dashboard");
  
    } catch (err) {
      setError("Something went wrong!");
      console.error("Login error:", err);
  }
 
};

  

  return (
    <div className="login-container">
      {/* Background Image */}
      <div className="login-background" style={{ backgroundImage: "url('/background.jpg')" }}>
        {/* Login Box */}
        <div className="login-box">
          <h2 className="text-3xl font-bold text-white">Sign In</h2>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="mt-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="auth-input"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="auth-input"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}

            <button type="submit" className="w-full bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition">
              Sign In
            </button>
          </form>

          <p className="text-gray-400 mt-4">
            New to our platform?{" "}
            <a href="/auth/signup" className="text-red-500 font-semibold hover:underline">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
}
