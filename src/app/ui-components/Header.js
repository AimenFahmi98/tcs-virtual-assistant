"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import ProfileMenu from "./ProfileMenu";

/**
 * Header component that displays the main navigation menu of the application.
 * Contains links to the Virtual Assistant, Document Manager, and Settings pages.
 * Uses MenuLink components to render navigation items with icons.
 * Layout is structured using CSS Grid with three columns.
 * @component
 * @returns {JSX.Element} A header component with navigation menu items
 */
function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setEmail(session.user.email);
        setIsAuthenticated(true);
      } else {
        setEmail("");
        setIsAuthenticated(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    isAuthenticated && (
      <div className="col-start-2 text-text">
        <div className="flex items-center justify-end py-1 pr-4">
          <ProfileMenu title={email} />
        </div>
      </div>
    )
  );
}

export default Header;
