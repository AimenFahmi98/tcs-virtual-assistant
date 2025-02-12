"use client";

import { useState } from "react";
import { PiSignOut } from "react-icons/pi";

function BtnSignOut({ className }) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignOut() {
    try {
      setIsLoading(true);
      const response = await fetch("/api/supabase/auth/signout", {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      window.location.href = "/auth/login";
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      //   setIsLoading(false);
    }
  }

  return (
    <button className={className} onClick={() => handleSignOut()}>
      <PiSignOut className="h-5 w-5" />
      <span className="text-nowrap text-sm">
        {isLoading ? "Signing out..." : "Sign Out"}
      </span>
    </button>
  );
}

export default BtnSignOut;
