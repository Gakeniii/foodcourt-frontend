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
    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

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

  return (
    <div
      className="h-screen w-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/background.jpg')", minHeight: "100vh" }}
    >
      {/* Centered Signup Box */}
      <div className="auth-box flex flex-col justify-center items-center w-full max-w-md bg-black bg-opacity-80 p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-white">Sign Up</h2>
        {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

        {/* Signup Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col space-y-4 w-full">
          {/* Full Name */}
          <input
            {...register("name", { required: "Full Name is required" })}
            placeholder="Full Name"
            className="auth-input"
            required
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}

          {/* Email */}
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            placeholder="Email"
            className="auth-input"
            required
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}

          {/* Password */}
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            placeholder="Password"
            className="auth-input"
            required
          />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}

          {/* Confirm Password */}
          <input
            type="password"
            {...register("confirmPassword", { required: "Please confirm your password" })}
            placeholder="Re-enter Password"
            className="auth-input"
            required
          />
          {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}

          {/* Role Selection */}
          <select
            {...register("role", { required: "Role is required" })}
            className="auth-input"
            required
          >
            <option value="">Select Role</option>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>

          {/* Submit Button */}
          <button type="submit" className="auth-button">
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
