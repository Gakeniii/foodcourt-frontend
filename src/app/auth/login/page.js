"use client"; 

import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() { 
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (data) => {
    try {
      const res = await signIn("credentials", { ...data, redirect: false });

      if (res?.error) {
        setError("Invalid credentials. Please try again.");
      } else {
        // Fetch user role from json-server after successful login
        const userRes = await axios.get(`http://localhost:5000/users?email=${data.email}`);
        
        if (userRes.data.length === 0) {
          setError("User not found. Please check your credentials.");
          return;
        }

        const user = userRes.data[0]; // Get the first matching user

        // Redirect based on user role
        if (user.role === "admin") {
          router.push("/dashboard");
        } else {
          router.push("/");
        }
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-blue-500">Login</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form onSubmit={handleSubmit(handleLogin)} className="mt-4">
          {/* Email Field */}
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            placeholder="Email"
            className="w-full p-2 border rounded mb-2 text-black"
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}

          {/* Password Field */}
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            placeholder="Password"
            className="w-full p-2 border rounded mb-2 text-black"
          />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}

          {/* Submit Button */}
          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
            Login
          </button>
        </form>

        <p className="text-center mt-2 text-black">
          Don't have an account? <a href="/auth/signup" className="text-blue-500">Sign Up</a>
        </p>
      </div>
    </div>
  );
}
