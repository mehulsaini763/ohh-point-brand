"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import logo from "../../public/logo.webp";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase"; // Assuming you have Firebase initialized in a file called firebase.js
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import toast from "react-hot-toast"; 

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is already logged in, redirect to dashboard
        // toast.success("Already logged in...");
        router.push("/"); // Adjust the route as per your application
      }
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      // Using Firebase auth to sign in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user) {
        toast.success("Login successful.");
        router.push("/"); // Adjust the route as per your application
      }
    } catch (error) {
      setErrorMessage("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-oohpoint-primary-1"></div>

      {/* Background Image */}
      {/* <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: url('@/public//bg-signin.png') }}
      ></div> */}

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-center min-h-screen w-full text-white">
        {/* Logo */}
        <Image src={logo} height={100} width={100} alt="Logo" />

        {/* Form Container */}
        <div className="bg-white p-5 lg:p-12 rounded-lg shadow-lg w-full max-w-lg mt-8">
          <h2 className="text-sm font-bold text-center mb-6 text-[#666666]">
            Please fill in your unique admin login details below
          </h2>

          {/* Form */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="text-black">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#666666]"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-oohpoint-grey-200 mt-2 border-none"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Field */}
            <div className="text-black">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#666666]"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="bg-oohpoint-grey-200 mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent border-none"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="w-full flex md:justify-end">
              <h3 onClick={() => router.push("forget-password")} className="text-sm font-medium text-[#666666] cursor-pointer">
                Forgot Password?
              </h3>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <p className="text-red-500 text-sm text-center">{errorMessage}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 mt-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;