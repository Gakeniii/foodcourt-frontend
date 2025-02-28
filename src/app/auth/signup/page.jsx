"use client";

import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "./signup.css"

export default function SignUp() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState("");
  const router = useRouter();
  
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/signup`, {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      }, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 201) {
        alert("Signup successful! Redirecting to login...");
        router.push("/auth/login");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed. Please try again.");
    }
  };

  return (
    <div
      className="h-screen w-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/background.jpg')", minHeight: "100vh" }}
    >
      {/* Centered Signup Box */}
      <div className="signup-box flex flex-col justify-center items-center w-full max-w-md bg-black bg-opacity-80 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-white">Sign Up</h2>
        {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

        {/* Signup Form */}
        <form  onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col space-y-4 w-full">
          {/* Full Name */}
          <input
            {...register("name", { required: "Full Name is required" })}
            placeholder="Full Name"
            className="auth-input"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}

          {/* Email */}
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            placeholder="Email"
            className="auth-input"
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}

          {/* Password */}
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            placeholder="Password"
            className="auth-input"
          />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}

          <select
            {...register("role", { required: "Role is required" })}
            className="auth-input w-full p-4 bg-gray-900 rounded-xl text-white outline-none"
          >
            <option value="">Select Role</option>
            <option value="Customer">Customer</option>
            <option value="Owner">Owner</option>
          </select>

          {/* Submit Button */}
          <button type="submit" className="w-full bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition">
            Sign Up
          </button>
        </form>

        <p className="text-center mt-4 text-gray-400">
          Already have an account?{" "}
          <a href="/auth/login" className="text-red-500 font-semibold hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}