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
        const userRes = await axios.get(`http://localhost:5000/users?email=${data.email}`);

        if (userRes.data.length === 0) {
          setError("User not found. Please check your credentials.");
          return;
        }

        const user = userRes.data[0];
        router.push(user.role === "admin" ? "/dashboard" : "/");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div
  className="h-screen w-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
  style={{ backgroundImage: "url('/background.jpg')", minHeight: "100vh" }}
    >
      <div className="auth-container" style={{ backgroundImage: "url('/background.jpg')" }}>
  <div className="auth-box">
    <h2 className="text-3xl font-bold text-center text-white">Sign Up</h2>
    <form>
      <input type="text" placeholder="Full Name" className="auth-input" />
      <input type="email" placeholder="Email" className="auth-input" />
      <input type="password" placeholder="Password" className="auth-input" />
      <input type="password" placeholder="Re-enter Password" className="auth-input" />
      <select className="auth-input">
        <option value="">Select Role</option>
        <option value="customer">Customer</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit" className="auth-button">Sign Up</button>
    </form>
  </div>
    </div>
    </div>
  );
}
