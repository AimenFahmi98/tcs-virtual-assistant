"use client";

import Spinner from "@/app/ui-components/Spinner";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignupForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      document
        .getElementById("confirmPassword")
        .classList.add("border-red-500");
      setError("Passwords do not match");
    } else {
      document
        .getElementById("confirmPassword")
        .classList.remove("border-red-500");
      setError("");
    }
  }, [password, confirmPassword]);

  const handleSignup = async (e) => {
    e.preventDefault();

    setisLoading(true);

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, password }),
    });

    const data = await response.json();
    if (data.success) {
      toast.success(
        "Signup successful! Please check your email to verify your account.",
        {
          position: "top-center",
        },
      );
    } else {
      toast.error(`Signup failed: ${data.message}`, {
        position: "top-center",
      });
    }

    setisLoading(false);
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 px-4">
        <div className="w-full max-w-lg space-y-6 rounded-lg bg-white p-8 shadow-lg sm:p-12">
          <h1 className="text-center text-2xl font-bold text-gray-800 sm:text-3xl">
            Create an Account
          </h1>
          <p className="text-center text-gray-500">
            Join the TCS family today!
          </p>

          <form className="space-y-6" onSubmit={handleSignup}>
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                autoComplete="off"
                onPaste={(e) => e.preventDefault()}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-sm font-medium text-red-600">{error}</p>
            )}

            <div>
              <button
                type="submit"
                className="w-full transform rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:cursor-not-allowed sm:text-base"
                disabled={isLoading || error !== ""}
              >
                {isLoading ? (
                  <Spinner color="white" borderSize="3px" />
                ) : (
                  "Sign Up"
                )}
              </button>
            </div>
          </form>

          <div className="text-center">
            <p className="flex flex-col items-center justify-center text-sm text-gray-500">
              <span>Already have an account?</span>
              <Link
                href="/auth/login"
                className="font-medium text-orange-600 hover:underline"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
