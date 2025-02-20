"use client";

import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "./signup.css"; // Import the CSS file

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
      className="signup-container"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      {/* Signup Box */}
      <div className="signup-box">
        <h2 className="text-3xl font-bold text-white">Sign Up</h2>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        {/* Signup Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <input
            {...register("name", { required: "Full Name is required" })}
            placeholder="Full Name"
            required
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}

          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            placeholder="Email"
            required
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}

          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            placeholder="Password"
            required
          />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}

          <input
            type="password"
            {...register("confirmPassword", { required: "Please confirm your password" })}
            placeholder="Re-enter Password"
            required
          />
          {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}

          <select {...register("role", { required: "Role is required" })} required>
            <option value="">Select Role</option>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit">Sign Up</button>
        </form>

        <p className="text-gray-400 mt-4">
          Already have an account?{" "}
          <a href="/auth/login">Sign In</a>
        </p>
      </div>
    </div>
  );
}
