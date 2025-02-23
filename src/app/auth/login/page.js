"use client";

import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
// import { signIn } from "next-auth/react";
import "./login.css";

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState("");
  const router = useRouter();

  const BASE_URL = "https://foodcourt-db.onrender.com";

  const handleLogin = async (data) => {
    try {
      const response = await axios.post($,{BASE_URL}/api/auth/login, data, {
        headers: { "Content-Type": "application/json" },
      });
  
      if (response.status === 200) {
        const { accessToken, refreshToken, user } = response.data;
  
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
  
        router.push(user.role === "Customer" ? "/home" : "/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
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
          <form onSubmit={handleSubmit(handleLogin)} className="mt-4">
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="auth-input"
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}

            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              placeholder="Password"
              className="auth-input"
            />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}

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