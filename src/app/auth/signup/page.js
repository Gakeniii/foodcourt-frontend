"use client";

import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignUp() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("http://localhost:5000/users", data);

      if (response.status === 201) {
        alert("Signup successful! Redirecting to login...");
        router.push("/auth/login");
      }
    } catch (err) {
      setError("Signup failed. Please try again.");
    }
  };

  const handleLogin = async (data) => {
    try {
      const res = await signIn("credentials", { ...data, redirect: false });
      if (res?.error) {
        setError("Invalid credentials. Please try again.");
      } else {
        // Fetch user role from json-server
        const userRes = await axios.get(`http://localhost:5000/users?email=${data.email}`);
        const user = userRes.data[0];
        
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
        <h2 className="text-2xl font-bold text-center text-red-500">Sign Up</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          {/* Full Name Field */}
          <input
            {...register("name", { required: "Full Name is required" })}
            placeholder="Full Name"
            className="w-full p-2 border rounded mb-2 text-black"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}

          {/* Email Field */}
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email format"
              }
            })}
            placeholder="Email"
            className="w-full p-2 border rounded mb-2 text-black"
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}

          {/* Password Field */}
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters"
              }
            })}
            placeholder="Password"
            className="w-full p-2 border rounded mb-2 text-black"
          />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}

          {/* Role Selection Field */}
          <select
            {...register("role", { required: "Role is required" })}
            className="w-full p-2 border rounded mb-2 text-black"
          >
            <option value="">Select Role</option>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
          {errors.role && <p className="text-red-500">{errors.role.message}</p>}

          {/* Submit Button */}
          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
            Sign Up
          </button>
        </form>

        <p className="text-center mt-2 text-black">
          Already have an account? <a href="/auth/login" className="text-blue-500">Login</a>
        </p>
      </div>
    </div>
  );
}
