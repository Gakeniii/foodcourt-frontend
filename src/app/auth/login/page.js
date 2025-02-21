"use client";

import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import "./login.css"; // Import the CSS file

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
        const userRes = await axios.get(`http://localhost:5000/users?email=${data.email}`);

        if (userRes.data.length === 0) {
          setError("User not found. Please check your credentials.");
          return;
        }

        const user = userRes.data[0];

        // ✅ Store user email in localStorage for later use
        localStorage.setItem("userEmail", data.email);

        // ✅ Redirect based on role
        router.push(user.role === "admin" ? "/dashboard" : "/home");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
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

            <button type="submit">Sign In</button>
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
