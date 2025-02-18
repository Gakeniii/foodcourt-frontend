"use client";

import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("http://localhost:5000/api/signup", data);
      if (response.status === 201) {
        alert("Signup successful! Redirecting to login...");
        router.push("/auth/login");
      }
    } catch (err) {
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <input
            {...register("name", { required: "Full Name is required" })}
            placeholder="Full Name"
            className="w-full p-2 border rounded mb-2"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}

          <input
            {...register("email", { required: "Email is required" })}
            placeholder="Email"
            className="w-full p-2 border rounded mb-2"
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}

          <input
            type="password"
            {...register("password", { required: "Password is required", minLength: 6 })}
            placeholder="Password"
            className="w-full p-2 border rounded mb-2"
          />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}

          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
            Sign Up
          </button>
        </form>
        <p className="text-center mt-2">
          Already have an account? <a href="/auth/login" className="text-blue-500">Login</a>
        </p>
      </div>
    </div>
  );
}
