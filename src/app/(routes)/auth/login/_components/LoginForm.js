"use client";

import { useState } from "react";
import Link from "next/link";
import Spinner from "@/app/ui-components/Spinner";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData) {
    try {
      setIsLoading(true);
      const email = formData.get("email");
      const password = formData.get("password");
      const response = await fetch("/api/supabase/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        redirect: "follow", // Add this to follow redirects
      });

      if (response.redirected) {
        window.location.href = response.url;
        return;
      }

      const data = await response.json();
      const errorMessage =
        data.message === "Invalid login credentials"
          ? "Incorrect email and/or password. Try again"
          : data.message;
      toast.error(`${errorMessage}`, {
        position: "top-center",
      });
    } catch (error) {
      console.error("Unexpected error:", error);
      console.trace(error);
      toast.error(`Unexpected error: ${error}`, {
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-[500px] space-y-6 rounded-3xl bg-background p-8 shadow-lg sm:px-12">
        <div className="mb-9 flex flex-col items-center justify-center gap-2">
          <div className="mb-4 rounded-full p-4 shadow-md_custom">
            <Image
              src={"/tcs-logo-no-text.webp"}
              width={50}
              height={50}
              alt="Logo"
            />
          </div>
          <h1 className="text-2xl font-[500] text-text sm:text-3xl">
            Welcome Back
          </h1>
          <p className="text-text_light">Please Log into your account</p>
        </div>

        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(new FormData(e.target));
          }}
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="you@example.com"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-800"
              >
                Remember me
              </label>
            </div>
            <Link
              href="/auth/forgot-password"
              className="text-sm font-medium text-indigo-600 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>

          <div>
            <button
              type="submit"
              className="w-full transform rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-base"
            >
              {isLoading ? (
                <Spinner color="white" borderSize="3px" size="24px" />
              ) : (
                "Log In"
              )}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="flex flex-col items-center justify-center text-sm text-gray-500">
            <span>Don&apos;t have an account?</span>
            <Link
              href="/auth/signup"
              className="font-medium text-indigo-600 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
