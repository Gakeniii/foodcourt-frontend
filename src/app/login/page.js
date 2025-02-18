"use client"

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const router = useRouter()
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    // Simulate login validation (you would replace this with an actual API call)
    // if (formData.email !== "user@example.com" || formData.password !== "password123") {
    //   setError("Invalid credentials. Please try again.");
    //   return;
    // }

    // Handle successful login
    // console.log("Logged in:", formData);
    const signInResult = await signIn("credentials", {
            redirect: false,
            email: formData.email,  
            password: formData.password,
        })
        if (signInResult.error){
          setError("Unable to login");
        }
        else{
          router.push("/dashboard")
        }
    

  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-800"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Login
            </button>
          </div>

          <div className="text-sm text-center">
            <a href="#" className="text-indigo-600 hover:text-indigo-800">
              Forgot Password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
