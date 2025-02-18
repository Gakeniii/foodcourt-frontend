"use client";

import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("http://localhost:5000/api/login", data);
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        router.push("/dashboard"); // Redirect after login
      }
    } catch (err) {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <input
            {...register("email", { required: "Email is required" })}
            placeholder="Email"
            className="w-full p-2 border rounded mb-2"
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}

          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            placeholder="Password"
            className="w-full p-2 border rounded mb-2"
          />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}

          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
            Login
          </button>
        </form>
        <p className="text-center mt-2">
          Don't have an account? <a href="/auth/signup" className="text-blue-500">Sign Up</a>
        </p>
      </div>
    </div>
  );
}
